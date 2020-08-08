using EMaintanance.Repository;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG27")]
    public class ConditionCodeMapController : Controller
    {
        private readonly ConditionCodeMappingRepo ccmRepo;
        private IConfiguration _configuration;
        public ConditionCodeMapController(IConfiguration configuration)
        {
            ccmRepo = new ConditionCodeMappingRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG27:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG27:P1")]
        public async Task<IActionResult> Get(int lId, int csId)
        {
            try
            {
                return Ok(await ccmRepo.GetConditionCodeMapping(lId, csId));
            }
            catch (CustomException cex)
            {
                var responseObj = new EmaintenanceMessage(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, responseObj);
            }
            catch (Exception ex)
            {
                return Ok(new EmaintenanceMessage(ex.Message));
            }
        }

        [HttpGet]
        [SKFAuthorize("PRG27:P1")]
        public async Task<IActionResult> GetConditionCodeSetup(int lId, int csId)
        {
            try
            {
                return Ok(await ccmRepo.GetConditionCodeSetup(lId, csId));
            }
            catch (CustomException cex)
            {
                var responseObj = new EmaintenanceMessage(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, responseObj);
            }
            catch (Exception ex)
            {
                return Ok(new EmaintenanceMessage(ex.Message));
            }
        }

        [HttpPost]
        [SKFAuthorize("PRG27:P2")]
        public async Task<IActionResult> Create([FromBody] List<ConditionCodeMapViewModel> ccmvms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (ConditionCodeMapViewModel ccmvm in ccmvms)
                {
                    if (ccmvm.ClientsConditionName != null)
                    {
                        ccmvm.UserId = cUser.UserId;
                        ccmvm.ConditionName = ccmvm.ClientsConditionName;
                        await ccmRepo.SaveOrUpdate(ccmvm);
                    }
                    else
                    {
                        throw new CustomException("Mandatory", "Client Condition Name is Mandatory.", "Error", true, "Custom Message : Client Condition Name is Mandatory.");
                    }
                }
                return Ok();

            }
            catch (CustomException cex)
            {
                var returnObj = new EmaintenanceMessage(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, returnObj);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new EmaintenanceMessage(ex.Message));
            }
        }

        [HttpGet]
        [SKFAuthorize("PRG27:P4")]
        public async Task<IActionResult> GetTransConditionCodeMapping(int CMappingId)
        {
            try
            {
                return Ok(await ccmRepo.GetTransConditionCodeMapping(CMappingId));
            }
            catch (CustomException cex)
            {
                var responseObj = new EmaintenanceMessage(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, responseObj);
            }
            catch (Exception ex)
            {
                return Ok(new EmaintenanceMessage(ex.Message));
            }
        }

    }
}

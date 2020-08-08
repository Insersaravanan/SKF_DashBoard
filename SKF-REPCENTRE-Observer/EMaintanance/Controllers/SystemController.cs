using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMaintanance.Repository;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG49")]
    public class SystemController : Controller
    {
        private readonly SystemRepo systemRepo;
        private IConfiguration _configuration;
        public SystemController(IConfiguration configuration)
        {
            systemRepo = new SystemRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG49:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG49:P1")]
        public async Task<IActionResult> GetSystemByStatus(int csId, int lId)
        {
            try
            {
                return Ok(await systemRepo.GetSystemByStatus(csId, lId));
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
        [SKFAuthorize("PRG49:P1")]
        public async Task<IActionResult> GetTransSystem(int sId)
        {
            try
            {
                return Ok(await systemRepo.GetTransSystem(sId));
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
        [SKFAuthorize("PRG49:P3")]
        public async Task<IActionResult> Update([FromBody] SystemViewModel svm)
        {
            try
            {
                return Ok(await systemRepo.SaveOrUpdate(svm));
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

        [HttpPost]
        [SKFAuthorize("PRG49:P2")]
        public async Task<IActionResult> Create([FromBody] SystemViewModel svm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                svm.UserId = cUser.UserId;
                svm.ReturnKey = 1;
                svm.SystemId = 0;
                svm.Active = "Y";
                return Ok(await systemRepo.SaveOrUpdate(svm));
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

        [HttpPost]
        [SKFAuthorize("PRG49:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<SystemViewModel> svms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                foreach (SystemViewModel svm in svms)
                {
                    svm.UserId = cUser.UserId;
                    await systemRepo.SaveOrUpdate(svm);
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

    }
}

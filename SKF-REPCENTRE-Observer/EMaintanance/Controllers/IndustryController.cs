using EMaintanance.Repository;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG07")]
    public class IndustryController : Controller
    {
        private readonly IndustryRepo iRepo;
        private IConfiguration _configuration;
        public IndustryController(IConfiguration configuration)
        {
            iRepo = new IndustryRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG07:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG07:P1")]
        public async Task<IActionResult> GetIndustryByStatus(int lId, string status)
        {
            try
            {
                return Ok(await iRepo.GetIndustryByStatus(lId, status));
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
        [SKFAuthorize("PRG07:P1")]
        public async Task<IActionResult> Search([FromBody] IndustryViewModel ivm)
        {
            try
            {
                return Ok(await iRepo.GetIndustryByParams(ivm));
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
        public async Task<IActionResult> GetIndustryBySegment(int lId, int segmentId)
        {
            try
            {
                return Ok(await iRepo.GetIndustryBySegment(lId, segmentId));
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
        public async Task<IActionResult> GetTransIndustry(int iId)
        {
            try
            {
                return Ok(await iRepo.GetTransIndustries(iId));
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
        [SKFAuthorize("PRG07:P3")]
        public async Task<IActionResult> Update([FromBody] IndustryViewModel ivm)
        {
            try
            {
                return Ok(await iRepo.SaveOrUpdate(ivm));
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
        [SKFAuthorize("PRG07:P2")]
        public async Task<IActionResult> Create([FromBody] IndustryViewModel ivm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                ivm.UserId = cUser.UserId;
                ivm.IndustryId = 0;
                ivm.Active = "Y";
                return Ok(await iRepo.SaveOrUpdate(ivm));
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
        [SKFAuthorize("PRG07:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<IndustryViewModel> ivms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (IndustryViewModel ivm in ivms)
                {
                    ivm.UserId = cUser.UserId;
                    await iRepo.SaveOrUpdate(ivm);
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

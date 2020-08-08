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
    [SKFAuthorize("PRG16")]
    public class FailureCauseController : Controller
    {
        private readonly FailureCauseRepo failureCauseRepo;
        private IConfiguration _configuration;
        public FailureCauseController(IConfiguration configuration)
        {
            failureCauseRepo = new FailureCauseRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG16:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG16:P1")]
        public async Task<IActionResult> GetFailureCauseByStatus(int lId, string status)
        {
            try
            {
                return Ok(await failureCauseRepo.GetFailureCauseByStatus(lId, status));
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
        [SKFAuthorize("PRG16:P1")]
        public async Task<IActionResult> Search([FromBody] FailureCauseViewModel fcvm)
        {
            try
            {
                return Ok(await failureCauseRepo.GetFailureCauseByParams(fcvm));
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

        // The below code need to remove once unit test is done this will be achieve by calling Taxonomy List.
        //[HttpGet]
        //public async Task<IActionResult> GetFailureCauseByFailureMode(int lId, int failureModeId)
        //{
        //    try
        //    {
        //        return Ok(await failureCauseRepo.GetFailureCauseByFailureMode(lId, failureModeId));
        //    }
        //    catch (CustomException cex)
        //    {
        //        var responseObj = new EmaintenanceMessage(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
        //        return StatusCode(StatusCodes.Status500InternalServerError, responseObj);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Ok(new EmaintenanceMessage(ex.Message));
        //    }
        //}

        [HttpGet]
        public async Task<IActionResult> GetTransFailureCause(int fcId)
        {
            try
            {
                return Ok(await failureCauseRepo.GetTransFailureCauses(fcId));
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
        [SKFAuthorize("PRG16:P3")]
        public async Task<IActionResult> Update([FromBody] FailureCauseViewModel fcvm)
        {
            try
            {
                return Ok(await failureCauseRepo.SaveOrUpdate(fcvm));
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
        [SKFAuthorize("PRG16:P2")]
        public async Task<IActionResult> Create([FromBody] FailureCauseViewModel fcvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                fcvm.UserId = cUser.UserId;
                fcvm.FailureCauseId = 0;
                fcvm.Active = "Y";
                return Ok(await failureCauseRepo.SaveOrUpdate(fcvm));
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
        [SKFAuthorize("PRG16:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<FailureCauseViewModel> fcvms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                foreach (FailureCauseViewModel fcvm in fcvms)
                {
                    fcvm.UserId = cUser.UserId;
                    await failureCauseRepo.SaveOrUpdate(fcvm);
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
        public async Task<IActionResult> GetFailureCauseModeRel(int LanguageId, int FailureCauseId)
        {
            try
            {
                return Ok(await failureCauseRepo.GetFailureCauseModeRel(LanguageId, FailureCauseId));
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
        public async Task<IActionResult> SaveFailureCauseModeRel([FromBody] List<FailureModeCauseViewModel> fmcvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                foreach (FailureModeCauseViewModel fcvm in fmcvm)
                {
                    fcvm.UserId = cUser.UserId;
                    await failureCauseRepo.SaveFailureCauseModeRel(fcvm);
                }

                return Ok();
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

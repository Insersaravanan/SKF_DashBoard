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
    [SKFAuthorize("PRG15")]
    public class FailureModeController : Controller
    {
        private readonly FailureModeRepo failureModeRepo;
        private IConfiguration _configuration;
        public FailureModeController(IConfiguration configuration)
        {
            failureModeRepo = new FailureModeRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG15:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG15:P1")]
        public async Task<IActionResult> GetFailureModeByStatus(int lId, string status)
        {
            try
            {
                return Ok(await failureModeRepo.GetFailureModeByStatus(lId, status));
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
        [SKFAuthorize("PRG15:P1")]
        public async Task<IActionResult> Search([FromBody] FailureModeViewModel fmvm)
        {
            try
            {
                return Ok(await failureModeRepo.GetFailureModeByParams(fmvm));
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
        //public async Task<IActionResult> GetFailureModeByAssetClass(int lId, int assetClassId)
        //{
        //    try
        //    {
        //        return Ok(await failureModeRepo.GetFailureModeByAssetClass(lId, assetClassId));
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
        public async Task<IActionResult> GetTransFailureMode(int fmId)
        {
            try
            {
                return Ok(await failureModeRepo.GetTransFailureModes(fmId));
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
        public async Task<IActionResult> GetFailureModeAssetClassRel(int LanguageId, int FailureModeId)
        {
            try
            {
                return Ok(await failureModeRepo.GetFailureModeAssetClassRel(LanguageId, FailureModeId));
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
        public async Task<IActionResult> SaveFailureModeAssertRelation([FromBody] List<FailureModeAssetClassRelViewModel> fmacvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                foreach (FailureModeAssetClassRelViewModel fmvm in fmacvm)
                {
                    fmvm.UserId = cUser.UserId;
                    await failureModeRepo.SaveFailureModeAssetClassRel(fmvm);
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

        [HttpPost]
        [SKFAuthorize("PRG15:P3")]
        public async Task<IActionResult> Update([FromBody] FailureModeViewModel fmvm)
        {
            try
            {
                return Ok(await failureModeRepo.SaveOrUpdate(fmvm));
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
        [SKFAuthorize("PRG15:P2")]
        public async Task<IActionResult> Create([FromBody] FailureModeViewModel fmvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                fmvm.UserId = cUser.UserId;
                fmvm.FailureModeId = 0;
                fmvm.Active = "Y";
                return Ok(await failureModeRepo.SaveOrUpdate(fmvm));
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
        [SKFAuthorize("PRG15:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<FailureModeViewModel> fmvms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                foreach (FailureModeViewModel fmvm in fmvms)
                {
                    fmvm.UserId = cUser.UserId;
                    await failureModeRepo.SaveOrUpdate(fmvm);
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

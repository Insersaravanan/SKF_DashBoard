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
    [SKFAuthorize("PRG31")]
    public class AssetSequenceController : Controller
    {
        private readonly AssetSequenceRepo AssetSequenceRepo;
        private IConfiguration _configuration;
        public AssetSequenceController(IConfiguration configuration)
        {
            AssetSequenceRepo = new AssetSequenceRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG31:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG31:P1")]
        public async Task<IActionResult> GetAssetSequenceByStatus(int lId, string status)
        {
            try
            {
                return Ok(await AssetSequenceRepo.GetAssetSequenceByStatus(lId, status));
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
        [SKFAuthorize("PRG31:P1")]
        public async Task<IActionResult> Search([FromBody] AssetSequenceViewModel avm)
        {
            try
            {
                return Ok(await AssetSequenceRepo.GetAssetSequenceByParams(avm));
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
        //public async Task<IActionResult> GetAssetSequenceByIndustry(int lId, int industryId)
        //{
        //    try
        //    {
        //        return Ok(await AssetSequenceRepo.GetAssetSequenceByIndustry(lId, industryId));
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
        public async Task<IActionResult> GetTransAssetSequence(int atId)
        {
            try
            {
                return Ok(await AssetSequenceRepo.GetTransAssetSequences(atId));
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
        [SKFAuthorize("PRG31:P3")]
        public async Task<IActionResult> Update([FromBody] AssetSequenceViewModel svm)
        {
            try
            {
                return Ok(await AssetSequenceRepo.SaveOrUpdate(svm));
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
        [SKFAuthorize("PRG31:P2")]
        public async Task<IActionResult> Create([FromBody] AssetSequenceViewModel avm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                avm.UserId = cUser.UserId;
                avm.AssetSequenceId = 0;
                avm.Active = "Y";
                return Ok(await AssetSequenceRepo.SaveOrUpdate(avm));
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
        [SKFAuthorize("PRG31:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<AssetSequenceViewModel> avms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                foreach (AssetSequenceViewModel avm in avms)
                {
                    avm.UserId = cUser.UserId;
                    await AssetSequenceRepo.SaveOrUpdate(avm);
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

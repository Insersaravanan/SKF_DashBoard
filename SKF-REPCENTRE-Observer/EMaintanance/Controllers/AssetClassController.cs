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
    [SKFAuthorize("PRG30")]
    public class AssetClassController : Controller
    {
        private readonly AssetClassRepo AssetClassRepo;
        private IConfiguration _configuration;
        public AssetClassController(IConfiguration configuration)
        {
            AssetClassRepo = new AssetClassRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG30:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG30:P1")]
        public async Task<IActionResult> GetAssetClassByStatus(int lId, string status)
        {
            try
            {
                return Ok(await AssetClassRepo.GetAssetClassByStatus(lId, status));
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
        public async Task<IActionResult> GetAssetClassIndrel(int lId, int AssetClassId)
        {
            try
            {
                return Ok(await AssetClassRepo.GetAssetClassIndrel(lId, AssetClassId));
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
        [SKFAuthorize("PRG30:P1")]
        public async Task<IActionResult> Search([FromBody] AssetClassViewModel avm)
        {
            try
            {
                return Ok(await AssetClassRepo.GetAssetClassByParams(avm));
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
        //public async Task<IActionResult> GetAssetClassByAssetType(int lId, int AssetId)
        //{
        //    try
        //    {
        //        return Ok(await AssetClassRepo.GetAssetClassByAssetType(lId, AssetId));
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
        public async Task<IActionResult> GetTransAssetClass(int atId)
        {
            try
            {
                return Ok(await AssetClassRepo.GetTransAssetClasss(atId));
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
        [SKFAuthorize("PRG30:P3")]
        public async Task<IActionResult> Update([FromBody] AssetClassViewModel svm)
        {
            try
            {
                return Ok(await AssetClassRepo.SaveOrUpdate(svm));
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
        [SKFAuthorize("PRG30:P2")]
        public async Task<IActionResult> Create([FromBody] AssetClassViewModel avm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                avm.UserId = cUser.UserId;
                avm.AssetClassId = 0;
                avm.Active = "Y";
                return Ok(await AssetClassRepo.SaveOrUpdate(avm));
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
        [SKFAuthorize("PRG30:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<AssetClassViewModel> avms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                foreach (AssetClassViewModel avm in avms)
                {
                    avm.UserId = cUser.UserId;
                    await AssetClassRepo.SaveOrUpdate(avm);
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


        [HttpPost]
        [SKFAuthorize("PRG30:P2")]
        public async Task<IActionResult> SaveAssetClassByIndustryRel([FromBody] List<AssetClassIndustryRelViewModel> avms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                foreach (AssetClassIndustryRelViewModel avm in avms)
                {
                    avm.UserId = cUser.UserId;
                    await AssetClassRepo.SaveAssetClassByIndustryRel(avm);
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

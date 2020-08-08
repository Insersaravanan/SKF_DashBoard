using EMaintanance.Repository;
using EMaintanance.Services;
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
    [SKFAuthorize("PRG14")]
    public class AssetTypeController : Controller
    {
        private readonly AssetTypeRepo assetTypeRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;
        public AssetTypeController(IConfiguration configuration)
        {
            assetTypeRepo = new AssetTypeRepo(configuration);
            _configuration = configuration;
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        [SKFAuthorize("PRG14:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG14:P1")]
        public async Task<IActionResult> GetAssetTypeByStatus(int lId, string status)
        {
            try
            {
                return Ok(await assetTypeRepo.GetAssetTypeByStatus(lId, status));
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
        [SKFAuthorize("PRG14:P1")]
        public async Task<IActionResult> Search([FromBody] AssetTypeViewModel avm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await assetTypeRepo.GetAssetTypeByParams(avm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AssetType", "Asset Type List Loaded");
                return Ok(result);
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
        //public async Task<IActionResult> GetAssetTypeByIndustry(int lId, int industryId)
        //{
        //    try
        //    {
        //        return Ok(await assetTypeRepo.GetAssetTypeByIndustry(lId, industryId));
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
        public async Task<IActionResult> GetTransAssetType(int atId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await assetTypeRepo.GetTransAssetTypes(atId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AssetType", "Translated Asset Type List Loaded");
                return Ok(result);
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
        [SKFAuthorize("PRG14:P3")]
        public async Task<IActionResult> Update([FromBody] AssetTypeViewModel svm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await assetTypeRepo.SaveOrUpdate(svm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AssetType", "Asset Type Modified");
                return Ok(result);
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
        [SKFAuthorize("PRG14:P2")]
        public async Task<IActionResult> Create([FromBody] AssetTypeViewModel avm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                avm.UserId = cUser.UserId;
                avm.AssetTypeId = 0;
                avm.Active = "Y";
                var result = await assetTypeRepo.SaveOrUpdate(avm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AssetType", "Asset Type Created");
                return Ok(result);
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
        [SKFAuthorize("PRG14:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<AssetTypeViewModel> avms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                foreach (AssetTypeViewModel avm in avms)
                {
                    avm.UserId = cUser.UserId;
                    await assetTypeRepo.SaveOrUpdate(avm);
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AssetType", "Asset Type Created / Updated in Multi Language");
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
        public async Task<IActionResult> GetAssetTypeByIndustryRel(int LanguageId, int AssetTypeId)
        {
            try
            {

                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await assetTypeRepo.GetAssetTypeByIndRel(LanguageId, AssetTypeId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AssetType", "Asset Type/Industry list Loaded.");
                return Ok(result);
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
        public async Task<IActionResult> GetAssetTypeClass(int LanguageId, int AssetTypeId)
        {
            try
            {
                return Ok(await assetTypeRepo.GetAssetTypeClass(LanguageId, AssetTypeId));

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
        public async Task<IActionResult> SaveAssetTypeByIndustryRel([FromBody] List<AssertTypeIndustryRelViewModel> atirvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (AssertTypeIndustryRelViewModel avm in atirvm)
                {
                    avm.UserId = cUser.UserId;
                    await assetTypeRepo.SaveAssertIndRel(avm);
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AssetType" ,"Asset Type By Industry relation Created");
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
        public async Task<IActionResult> SaveAssetTypeClass([FromBody] List<AssetTypeClassRelViewModel> atirvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (AssetTypeClassRelViewModel avm in atirvm)
                {
                    avm.UserId = cUser.UserId;
                    await assetTypeRepo.SaveAssetTypeClass(avm);
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Asset Type", "Asset Type/Class relation Created");
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

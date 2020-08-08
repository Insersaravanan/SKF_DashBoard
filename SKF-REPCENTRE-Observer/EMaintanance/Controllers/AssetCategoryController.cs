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
    [SKFAuthorize("PRG29")]
    public class AssetCategoryController : Controller
    {
        private readonly AssetCategoryRepo AssetCategoryRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;

        public AssetCategoryController(IConfiguration configuration)
        {
            AssetCategoryRepo = new AssetCategoryRepo(configuration);
            _configuration = configuration;
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        [SKFAuthorize("PRG29:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [SKFAuthorize("PRG29:P1")]
        public async Task<IActionResult> Search([FromBody] AssetCategoryViewModel avm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await AssetCategoryRepo.GetAssetCategoryByParams(avm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AssetCategory", "Asset Category list Loaded");
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
        [SKFAuthorize("PRG29:P2")]
        public async Task<IActionResult> Create([FromBody] AssetCategoryViewModel avm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                avm.UserId = cUser.UserId;
                avm.AssetCategoryId = 0;
                avm.Active = "Y";
                var result = await AssetCategoryRepo.SaveOrUpdate(avm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AssetCategory", "Asset Category Created");
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
        [SKFAuthorize("PRG29:P3")]
        public async Task<IActionResult> Update([FromBody] AssetCategoryViewModel svm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await AssetCategoryRepo.SaveOrUpdate(svm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AssetCategory", "Asset Category Modified");
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

        [HttpGet]
        [SKFAuthorize("PRG29:P1")]
        public async Task<IActionResult> GetTransAssetCategory(int atId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await AssetCategoryRepo.GetTransAssetCategory(atId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AssetCategory", "Translated Asset Category List Loaded");
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
        [SKFAuthorize("PRG29:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<AssetCategoryViewModel> avms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                foreach (AssetCategoryViewModel avm in avms)
                {
                    avm.UserId = cUser.UserId;
                    await AssetCategoryRepo.SaveOrUpdate(avm);
                   
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AssetCategory", "Asset Category Created / Updated in Multi Language");
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
        public async Task<IActionResult> GetCategoryClassRel(int LanguageId, int AssetCategoryId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await AssetCategoryRepo.GetCategoryClassRel(LanguageId, AssetCategoryId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AssetCategory", "Category Class List Loaded");
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
        [SKFAuthorize("PRG29:P4")]
        public async Task<IActionResult> SaveCategoryClassRel([FromBody] List<AssetCategoryClassRelViewModel> avms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                foreach (AssetCategoryClassRelViewModel avm in avms)
                {
                    avm.UserId = cUser.UserId;
                    await AssetCategoryRepo.SaveCategoryClassRel(avm);
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AssetCategory", "Category/Class Relation Updated.");
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

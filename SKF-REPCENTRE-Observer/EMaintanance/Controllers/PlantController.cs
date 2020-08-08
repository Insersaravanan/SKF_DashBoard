using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG10")]
    public class PlantController : Controller
    {
        private readonly PlantRepo plantRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;
        public PlantController(IConfiguration configuration)
        {
            plantRepo = new PlantRepo(configuration);
            _configuration = configuration;
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        [SKFAuthorize("PRG10:P2")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG10:P2")]
        public async Task<IActionResult> GetPlantByStatus(int lId, int csId, string status)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var result = await plantRepo.GetPlantByStatus(lId, csId, status);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Plant", "Plant list Loaded.");
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
        public async Task<IActionResult> GetTransPlants(int pId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var result = await plantRepo.GetTransPlants(pId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Plant", "Translated Plant List Loaded.");
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
        [SKFAuthorize("PRG10:P2")]
        public async Task<IActionResult> Update([FromBody] PlantViewModel svm)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var result = await plantRepo.SaveOrUpdate(svm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Plant", "Plant Modified.");
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
        [SKFAuthorize("PRG10:P2")]
        public async Task<IActionResult> Create([FromBody] PlantViewModel pvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                pvm.UserId = cUser.UserId;
                pvm.ReturnKey = 1;
                pvm.PlantAreaId = 0;
                pvm.Active = "Y";
                var result = await plantRepo.SaveOrUpdate(pvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Plant", "Plant Created.");
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
        [SKFAuthorize("PRG10:P2")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<PlantViewModel> pvms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (PlantViewModel pvm in pvms)
                {
                    pvm.UserId = cUser.UserId;
                    await plantRepo.SaveOrUpdate(pvm);
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Plant", "Plant Created / Updated in Multi Language.");
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

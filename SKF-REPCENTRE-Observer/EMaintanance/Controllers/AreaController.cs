using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG48")]
    public class AreaController : Controller
    {
        private readonly AreaRepo areaRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;
        public AreaController(IConfiguration configuration)
        {
            areaRepo = new AreaRepo(configuration);
            _configuration = configuration;
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        [SKFAuthorize("PRG48:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG48:P1")]
        public async Task<IActionResult> GetAreaByStatus(int csId, int lId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var result = await areaRepo.GetAreaByStatus(csId, lId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Area", "Area list Loaded.");
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
        [SKFAuthorize("PRG48:P1")]
        public async Task<IActionResult> GetTransArea(int aId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var result = await areaRepo.GetTransArea(aId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Area", "Translated Area List Loaded.");
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
        [SKFAuthorize("PRG48:P3")]
        public async Task<IActionResult> Update([FromBody] AreaViewModel avm)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var result = await areaRepo.SaveOrUpdate(avm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Area", "Area Modified.");
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
        [SKFAuthorize("PRG48:P2")]
        public async Task<IActionResult> Create([FromBody] AreaViewModel avm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                avm.UserId = cUser.UserId;
                avm.ReturnKey = 1;
                avm.AreaId = 0;
                avm.Active = "Y";
                var result = await areaRepo.SaveOrUpdate(avm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Area", "Area Created.");
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
        [SKFAuthorize("PRG48:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<AreaViewModel> avms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (AreaViewModel avm in avms)
                {
                    avm.UserId = cUser.UserId;
                    await areaRepo.SaveOrUpdate(avm);
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Area", "Area Created / Updated in Multi Language.");
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

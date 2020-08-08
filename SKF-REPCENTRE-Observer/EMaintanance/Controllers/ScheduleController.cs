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
    [SKFAuthorize("PRG33")]
    public class ScheduleController : Controller
    {
        private readonly ScheduleRepo scheduleRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;

        public ScheduleController(IConfiguration configuration)
        {
            _configuration = configuration;
            scheduleRepo = new ScheduleRepo(configuration);
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        [SKFAuthorize("PRG33:P1")]
        public IActionResult Index()
        {
            return View();
        }


        [HttpGet]
        [SKFAuthorize("PRG33:P1")]
        public async Task<IActionResult> GetScheduleByStatus(int csId, int ssId, int lId, int statusId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                /* The last parameter is "Mode" which is used to return Dynamic or Specific object Result */
                var result = await scheduleRepo.GetScheduleByStatus(csId, ssId, lId, statusId, null);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Schedule", "Schedule list Loaded.");
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
        [SKFAuthorize("PRG33:P1")]
        public async Task<IActionResult> GetEquipmentByscheduleId(int csId, int scId, int lId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var result = await scheduleRepo.GetEquipmentByScheduleId(csId, scId, lId, string.Empty);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Schedule", "Loaded Equipments based on selected Schedule.");
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
        [SKFAuthorize("PRG33:P2")]
        public async Task<IActionResult> Create([FromBody] ScheduleSetupViewModel scv)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                scv.ScheduleSetupId = 0;
                scv.StatusId = 0;
                scv.UserId = cUser.UserId;
                var result = await scheduleRepo.SaveOrUpdate(scv);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Schedule", "Schedule Created.");
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
        [SKFAuthorize("PRG33:P3")]
        public async Task<IActionResult> Update([FromBody] ScheduleSetupViewModel scv)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                scv.UserId = cUser.UserId;
                var result = await scheduleRepo.SaveOrUpdate(scv);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Schedule", "Schedule Modified.");
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

    }
}

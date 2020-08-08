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
    //[SKFAuthorize("PRG68")]
    public class AlarmEmailNotificationController : Controller
    {
        private readonly AlarmEmailNotificationRepo AlarmEmailNotificationRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;

        public AlarmEmailNotificationController(IConfiguration configuration)
        {
            _configuration = configuration;
            AlarmEmailNotificationRepo = new AlarmEmailNotificationRepo(configuration);
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        [SKFAuthorize("PRG68:P1")]
        public IActionResult Index()
        {
            return View();
        }


        [HttpGet]
        [SKFAuthorize("PRG68:P1")]
        public async Task<IActionResult> GetAlarmEmailNotificationByStatus(int csId, int ssId, int lId, int statusId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                /* The last parameter is "Mode" which is used to return Dynamic or Specific object Result */
                var result = await AlarmEmailNotificationRepo.GetAlarmEmailNotificationByStatus(csId, ssId, lId, statusId, null);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AlarmEmailNotification", "AlarmEmailNotification list Loaded.");
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
        [SKFAuthorize("PRG68:P1")]
        public async Task<IActionResult> GetEquipmentByAlarmEmailNotificationId(int csId, int scId, int lId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var result = await AlarmEmailNotificationRepo.GetEquipmentByAlarmEmailNotificationId(csId, scId, lId, string.Empty);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AlarmEmailNotification", "Loaded Equipments based on selected AlarmEmailNotification.");
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
        [SKFAuthorize("PRG68:P2")]
        public async Task<IActionResult> Create([FromBody] AlarmEmailNotificationViewModel scv)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                scv.AlarmEmailNotificationSetupId = 0;
                scv.StatusId = 0;
                scv.UserId = cUser.UserId;
                var result = await AlarmEmailNotificationRepo.SaveOrUpdate(scv);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AlarmEmailNotification", "AlarmEmailNotification Created.");
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
       // [SKFAuthorize("PRG68:P3")]
        public async Task<IActionResult> Update([FromBody] AlarmEmailNotificationViewModel scv)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                scv.UserId = cUser.UserId;
                var result = await AlarmEmailNotificationRepo.SaveOrUpdate(scv);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "AlarmEmailNotification", "AlarmEmailNotification Modified.");
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

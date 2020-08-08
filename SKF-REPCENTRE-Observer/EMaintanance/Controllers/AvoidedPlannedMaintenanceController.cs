using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG36")]
    public class AvoidedPlannedMaintenanceController : Controller
    {

        private readonly AvoidPlannedMaintenanceRepo avoidPlannedMaintRepo;
        private IConfiguration _configuration;
        private readonly FileUploadService fileUploadService;
        private readonly AuditLogService auditLogService;

        public AvoidedPlannedMaintenanceController(IConfiguration configuration)
        {
            avoidPlannedMaintRepo = new AvoidPlannedMaintenanceRepo(configuration);
            _configuration = configuration;
            fileUploadService = new FileUploadService(configuration);
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        public IActionResult Index()
        {
            return View();
        }


        [HttpPost]
        [SKFAuthorize("PRG36:P1")]
        public async Task<IActionResult> GetAvoidPlannedMaintenance([FromBody] FailureReportSearchViewModel frsvm)
        {
            try

            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await avoidPlannedMaintRepo.GetAvoidPlannedMaintenance(frsvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Avoided Planned Maintenence", "AvoidPlanned Maintenance List Loaded.");
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
        [SKFAuthorize("PRG36:P1")]
        public async Task<IActionResult> Create([FromBody] FailureReportViewModel frvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                frvm.UserId = cUser.UserId;
                frvm.FailureReportHeaderId = 0;
                var result = await avoidPlannedMaintRepo.SaveOrUpdate(frvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Avoided Planned Maintenence", "AvoidPlanned Maintenance Created.");
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
        [SKFAuthorize("PRG36:P1")]
        public async Task<IActionResult> Update([FromBody] FailureReportViewModel frvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                frvm.UserId = cUser.UserId;
                var result = await avoidPlannedMaintRepo.SaveOrUpdate(frvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Avoided Planned Maintenence", "AvoidPlanned Maintenance Modified.");
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

        [SKFAuthorize("PRG36:P2")]
        public async Task<IActionResult> UploadFiles()
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                List<FileUploadViewModel> fuvms = null;
                var customHeaders = Request.Headers;
                StringValues aId = "";
                StringValues Type = "";
                if (customHeaders.ContainsKey("aId") && customHeaders.ContainsKey("Type"))
                {
                    customHeaders.TryGetValue("aId", out aId);
                    customHeaders.TryGetValue("Type", out Type);

                    fuvms = await fileUploadService.UploadFiles(Request, HttpContext);
                }

                foreach (FileUploadViewModel fuvm in fuvms)
                {
                    await avoidPlannedMaintRepo.SaveOrUpdateAttachments(Type, Int32.Parse(aId), 0, fuvm.OriginalFileName, fuvm.LogicalFileName, fuvm.PhysicalFilePath, "Y", cUser.UserId);
                }

                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Avoided Planned Maintenence", "AvoidPlanned Maintenance Document Uploaded.");
                return Json("Success");
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

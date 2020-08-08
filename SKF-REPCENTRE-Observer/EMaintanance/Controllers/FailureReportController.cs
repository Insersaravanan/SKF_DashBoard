using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG35")]
    public class FailureReportController : Controller
    {

        private readonly FailureReportRepo failurereportRepo;
        private IConfiguration _configuration;
        private readonly FileUploadService fileUploadService;
        private readonly AuditLogService auditLogService;


        public FailureReportController(IConfiguration configuration)
        {
            failurereportRepo = new FailureReportRepo(configuration);
            _configuration = configuration;
            fileUploadService = new FileUploadService(configuration);
           auditLogService = new AuditLogService(HttpContext, configuration);
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [SKFAuthorize("PRG35:P1")]
        public async Task<IActionResult> GetFailureReportByStatus([FromBody] FailureReportSearchViewModel frsvm)
        {
            try

            {
                return Ok(await failurereportRepo.GetFailureReportByStatus(frsvm));
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
        [SKFAuthorize("PRG35:P1")]
        public async Task<IActionResult> Create([FromBody] FailureReportViewModel frvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                frvm.UserId = cUser.UserId;
                frvm.FailureReportHeaderId = 0;

                return Ok(await failurereportRepo.SaveOrUpdate(frvm));
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
        [SKFAuthorize("PRG35:P1")]
        public async Task<IActionResult> Update([FromBody] FailureReportViewModel frvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                frvm.UserId = cUser.UserId;
                return Ok(await failurereportRepo.SaveOrUpdate(frvm));
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

        [SKFAuthorize("PRG35:P2")]
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
                    await failurereportRepo.SaveOrUpdateAttachments(Type, Int32.Parse(aId), 0, fuvm.OriginalFileName, fuvm.LogicalFileName, fuvm.PhysicalFilePath, "Y", cUser.UserId);
                }

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


        [HttpGet]
        [SKFAuthorize("PRG35:P1")]
        public async Task<IActionResult> GetAttachmentById(int frhId, string status)
        {
            try
            {
                return Ok(await failurereportRepo.GetAttachmentById(frhId, status));

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
        [SKFAuthorize("PRG35:P1")]
        public async Task<IActionResult> DeleteAttachment(string Type, int AttachmentId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await failurereportRepo.SaveOrUpdateAttachments(Type,0,AttachmentId,null, null,null, "N", 0);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "FailureReport", "FailureReport List Loaded");
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
    }
}

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
using Microsoft.Extensions.Primitives;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG40")]
    public class ClientDocController : Controller
    {
        private readonly ClientDocRepo clientDocRepo;
        private IConfiguration _configuration;
        private readonly FileUploadService fileUploadService;
        private readonly AuditLogService auditLogService;

        public ClientDocController(IConfiguration configuration)
        {
            _configuration = configuration;
            clientDocRepo = new ClientDocRepo(configuration);
            fileUploadService = new FileUploadService(configuration);
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        [SKFAuthorize("PRG40:P1")]
        public IActionResult Index()
        {
            return View();
        }


        [HttpGet]
        [SKFAuthorize("PRG40:P1")]
        public async Task<IActionResult> GetClientDocByStatus(int csId, string status)
        {
            try

            {

                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await clientDocRepo.GetClientDocByStatus(csId, status);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "ClientDoc", "Client Doc List Loaded");
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
        [SKFAuthorize("PRG40:P2")]
        public async Task<IActionResult> UploadFiles()
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                var customHeaders = Request.Headers;
                StringValues aId = "";
                StringValues Type = "";
                StringValues FileDescription = "";
                if (customHeaders.ContainsKey("aId") && customHeaders.ContainsKey("Type"))
                {
                    customHeaders.TryGetValue("aId", out aId);
                    customHeaders.TryGetValue("Type", out Type);
                    customHeaders.TryGetValue("fileDescription", out FileDescription);
                    List<FileUploadViewModel> fuvms = await fileUploadService.UploadFiles(Request, HttpContext);
                    foreach (FileUploadViewModel fuvm in fuvms)
                    {
                        ClientDocViewModel cdvm = new ClientDocViewModel();
                        cdvm.ClientDocAttachId = 0;
                        cdvm.ClientSiteId = Int32.Parse(aId);
                        cdvm.FileDescription = FileDescription;
                        cdvm.FileName = fuvm.OriginalFileName;
                        cdvm.LogicalName = fuvm.LogicalFileName;
                        cdvm.PhysicalPath = fuvm.PhysicalFilePath.Replace(@"\", @"/");
                        cdvm.Active = "Y";
                        cdvm.UserId = cUser.UserId;
                        await clientDocRepo.SaveOrUpdate(cdvm);
                    }
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "ClientDoc", "Client Document Uploaded");
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

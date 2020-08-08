using EMaintanance.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using EMaintanance.Utils;
using Microsoft.AspNetCore.Http;
using EMaintanance.ViewModels;
using System.Net.Http.Headers;
using System.IO;
using Microsoft.Extensions.Primitives;
using EMaintanance.Services;

namespace EMaintanance.Controllers
{
    [Authorize]
    [SKFAuthorize("PRG09")]
    public class ClientSiteController : Controller
    {
        private readonly ClientSiteRepo clientSiteRepo;
        private IConfiguration _configuration;
        private long size;
        private readonly FileUploadService fileUploadService;
        private readonly AuditLogService auditLogService;

        public ClientSiteController(IConfiguration configuration)
        {
            clientSiteRepo = new ClientSiteRepo(configuration);
            fileUploadService = new FileUploadService(configuration);
            _configuration = configuration;
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        [SKFAuthorize("PRG09:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG09:P1")]
        public async Task<IActionResult> GetClientSiteByStatus(int lId, int cliSiteStatus)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await clientSiteRepo.GetClientSiteByStatus(lId, cliSiteStatus, cUser.UserId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Client Site", "Client Site List Loaded");
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
        [SKFAuthorize("PRG09:P1")]
        public async Task<IActionResult> GetSiteUserAccess(int lId, int csId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await clientSiteRepo.GetSiteUserAccess(lId, csId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Client Site", "User Client Access List Loaded");
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
        [SKFAuthorize("PRG09:P2")]
        public async Task<IActionResult> SaveUserSiteAccess([FromBody] ClientSiteUserAccessViewModel csuvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                ClientSiteUserAccessParsedViewModel csuavm = null;

                foreach (UserInfoViewModel uivm in csuvm.AssignedUsers)
                {
                    csuavm = new ClientSiteUserAccessParsedViewModel();
                    csuavm.UserId = uivm.UserId;
                    csuavm.LoginUserId = cUser.UserId;
                    csuavm.ClientSiteId = csuvm.ClientSiteId;
                    csuavm.Active = "Y";
                    await clientSiteRepo.SaveSiteUserAccess(csuavm);
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Client Site", "User Client Site Access Modified");
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
        public async Task<IActionResult> GetTransClientSite(int cliSiteId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await clientSiteRepo.GetTransClientSites(cliSiteId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Client Site", "Translated Client List Loaded");
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
        [SKFAuthorize("PRG09:P3")]
        public async Task<IActionResult> Update([FromBody] ClientSiteViewModel csvm)
        {
            try
            {
                return Ok(await clientSiteRepo.SaveOrUpdate(csvm));
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
        [SKFAuthorize("PRG09:P2")]
        public async Task<IActionResult> Create([FromBody] ClientSiteViewModel csvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                csvm.UserId = cUser.UserId;
                csvm.ClientSiteId = 0;
                return Ok(await clientSiteRepo.SaveOrUpdate(csvm));
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
        [SKFAuthorize("PRG09:P2")]
        public async Task<IActionResult> UploadFilesAjax()
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                var customHeaders = Request.Headers;
                StringValues aId = "";
                StringValues Type = "";
                if (customHeaders.ContainsKey("aId") && customHeaders.ContainsKey("Type"))
                {
                    customHeaders.TryGetValue("aId", out aId);
                    customHeaders.TryGetValue("Type", out Type);

                    List<FileUploadViewModel> fuvms = await fileUploadService.UploadFiles(Request, HttpContext);
                    foreach (FileUploadViewModel fuvm in fuvms)
                    {
                        fuvm.PhysicalFilePath = fuvm.PhysicalFilePath.Replace(@"\", @"/");
                        await clientSiteRepo.SaveClientSiteLogo(fuvm.PhysicalFilePath, Int32.Parse(aId));
                    }
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

        [HttpPost]
        public async Task<IActionResult> UploadFilesAjaxToDelete()
        {
            try
            {
                var files = Request.Form.Files;
                var customHeaders = Request.Headers;
                StringValues clientSiteId = "";
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                if (customHeaders.ContainsKey("clientSiteId"))
                {
                    customHeaders.TryGetValue("clientSiteId", out clientSiteId);
                }
                var filename = "";
                string justFileName = "";
                var filePath = "";
                var file = files[0];
                ContentDispositionHeaderValue.TryParse(file.ContentDisposition, out ContentDispositionHeaderValue parsedContentDisposition);
                parsedContentDisposition.FileName = parsedContentDisposition.FileName.TrimStart('\"').TrimEnd('\"');
                parsedContentDisposition.Name = parsedContentDisposition.Name.TrimStart('\"').TrimEnd('\"');
                string extension = parsedContentDisposition.Name.Substring(parsedContentDisposition.Name.LastIndexOf(".") + 1, (parsedContentDisposition.Name.Length - parsedContentDisposition.Name.LastIndexOf(".") - 1));

                justFileName = clientSiteId + "." + extension;

                var _dir = Directory.GetCurrentDirectory() + $@"\wwwroot\images\clientlogo";
                if (!(Directory.Exists(_dir)))
                {
                    Directory.CreateDirectory(_dir);
                }

                filePath = $@"\" + justFileName;

                filename = _dir + filePath;

                size += file.Length;
                using (FileStream fs = System.IO.File.Create(filename))
                {
                    file.CopyTo(fs);
                    fs.Flush();
                }
                var logo = $@"\images\clientlogo\" + justFileName;
                await clientSiteRepo.SaveClientSiteLogo(logo, Int32.Parse(clientSiteId));
                return Ok();
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [SKFAuthorize("PRG09:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<ClientSiteViewModel> csvms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                foreach (ClientSiteViewModel csvm in csvms)
                {
                    csvm.UserId = cUser.UserId;
                    await clientSiteRepo.SaveOrUpdate(csvm);
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

        [HttpGet]
        public async Task<IActionResult> GetConfiguration(int lId, int cliSiteId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                return Ok(await clientSiteRepo.GetConfiguration(lId, cliSiteId));
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
        public async Task<IActionResult> CreateConfiguration([FromBody] List<ClientSiteConfigurationViewModel> csc)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (ClientSiteConfigurationViewModel cs in csc)
                {
                    cs.UserId = cUser.UserId;
                    await clientSiteRepo.SaveOrUpdate(cs);
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



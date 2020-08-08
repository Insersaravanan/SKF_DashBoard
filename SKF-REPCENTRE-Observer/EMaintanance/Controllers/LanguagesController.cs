using EMaintanance.Models;
using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [Authorize]
    public class LanguagesController : Controller
    {
        private readonly LanguagesRepo lRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;
        public LanguagesController(IConfiguration configuration)
        {
            lRepo = new LanguagesRepo(configuration);
            auditLogService = new AuditLogService(HttpContext, configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG01:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                return Ok(await lRepo.GetAllLanguages());
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
        [SKFAuthorize("PRG01:P1")]
        public async Task<IActionResult> GetLanguagesByStatus(string status)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                if (status != null & status == "All")
                {
                    var result = await lRepo.GetAllLanguages();
                    await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Languages", "Language list Loaded.");
                    return Ok(result);
                }
                else
                {
                    return Ok(await lRepo.GetLanguagesByStatus(status));
                }
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
        [SKFAuthorize("PRG01")]
        public async Task<IActionResult> GetlanguageById(int id)
        {
            try
            {
                return Ok(await lRepo.GetLanguages(id));
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
        [SKFAuthorize("PRG01:P2")]
        public async Task<IActionResult> Create([FromBody] Languages l)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                l.CreatedBy = cUser.UserId;
                var result = await lRepo.AddLanguages(l);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Languages", "Language Created.");
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
        [SKFAuthorize("PRG01:P3")]
        public async Task<IActionResult> Update([FromBody] Languages l)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await lRepo.UpdateLanguage(l);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Languages", "Language Modified.");
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

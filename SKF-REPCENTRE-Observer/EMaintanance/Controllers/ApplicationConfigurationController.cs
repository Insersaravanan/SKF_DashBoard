using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace EMaintanance.Controllers
{
    public class ApplicationConfigurationController : Controller
    {
        private readonly ApplicationConfigurationRepo applicationConfigurationRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;

        public IActionResult Index()
        {
            return View();
        }

        public ApplicationConfigurationController(IConfiguration configuration)
        {
            _configuration = configuration;
            applicationConfigurationRepo = new ApplicationConfigurationRepo(configuration);
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        [HttpGet]
        public async Task<IActionResult> GetApplicationConfigurationByStatus(int acId, string status)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await applicationConfigurationRepo.GetApplicationConfigurationByStatus(acId, status);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "ApplicationConfiguration", "Application Configuration list Loaded");
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

        [AllowAnonymous]
        [HttpGet]
        public async Task<IActionResult> GetAppConfigByName(string name)
        {
            return Ok(await applicationConfigurationRepo.GetAppConfigByName(name, "Y"));
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ApplicationConfigurationViewModel ccv)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                ccv.UserId = cUser.UserId;
                var result = await applicationConfigurationRepo.SaveOrUpdate(ccv);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "ApplicationConfiguration", "Application Configuration Created");
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

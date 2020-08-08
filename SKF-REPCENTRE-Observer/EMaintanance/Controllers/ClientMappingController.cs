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
using EMaintanance.Services;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG59")]
    public class ClientMappingController : Controller
    {
        private readonly ClientMappingRepo clientMappingRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;

        public ClientMappingController(IConfiguration configuration)
        {
            _configuration = configuration;
            clientMappingRepo = new ClientMappingRepo(configuration);
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        [SKFAuthorize("PRG59:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG59:P1")]
        public async Task<IActionResult> GetClientMapping(int lId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await clientMappingRepo.GetClientMapping(lId, cUser.UserId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Client Mapping", "Client Mapping List Loaded");
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
        [SKFAuthorize("PRG59:P2")]
        public async Task<IActionResult> SaveClientMapping([FromBody] ClientMappingViewModel cmvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                await clientMappingRepo.SaveClientMapping(cmvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Client Mapping", "Saved Client Mapping");
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

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
    [SKFAuthorize("PRG39")]
    public class BearingController : Controller
    {
        private readonly BearingRepo bearingRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;

        public BearingController(IConfiguration configuration)
        {
            _configuration = configuration;
            bearingRepo = new BearingRepo(configuration);
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        [SKFAuthorize("PRG39:P1")]
        public IActionResult Index()
        {
            return View();
        }


        [HttpGet]
        [SKFAuthorize("PRG39:P1")]
        public async Task<IActionResult> GetBearingByStatus(int lId, string status)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await bearingRepo.GetBearingByStatus(lId, status);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Bearing", "Bearing List Loaded");
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

        public async Task<IActionResult> GetBearingBybyCount(int lid)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var Uid = cUser.UserId;
                var result = await bearingRepo.GetBearingByCount(lid, Uid);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Bearing", "Bearing List Loaded");
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
        [SKFAuthorize("PRG39:P1")]
        public async Task<IActionResult> GetTransBearing(int bId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await bearingRepo.GetTransBearing(bId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Bearing", "Translated Bearing List Loaded");
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
        [SKFAuthorize("PRG39:P3")]
        public async Task<IActionResult> Update([FromBody] BearingViewModel bs)
        {
            try
            {

                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await bearingRepo.SaveOrUpdate(bs);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Bearing", "Bearing Modified.");
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
        [SKFAuthorize("PRG39:P2")]
        public async Task<IActionResult> Create([FromBody] BearingViewModel bs)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                bs.UserId = cUser.UserId;
                bs.BearingId = 0;
                bs.Active = "Y";
                var result = await bearingRepo.SaveOrUpdate(bs);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Bearing", "Bearing Created.");
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
        [SKFAuthorize("PRG39:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<BearingViewModel> bs)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (BearingViewModel br in bs)
                {
                    br.UserId = cUser.UserId;
                    await bearingRepo.SaveOrUpdate(br);
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Bearing", "Bearing Created / Updated in Multi Language.");
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

using EMaintanance.Repository;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG65")]
    public class FeedBackREPOnlineController : Controller
    {
        private readonly FeedBackREPOnlineRepo sRepo;
        private IConfiguration _configuration;
        public FeedBackREPOnlineController(IConfiguration configuration)
        {
            _configuration = configuration;
            sRepo = new FeedBackREPOnlineRepo(configuration);
        }

        [SKFAuthorize("PRG65:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG65:P1")]
        public async Task<IActionResult> GetFeedBackREPOnlineByStatus(int lId, string status, DateTime FeedBackFromDate, DateTime FeedBackToDate)
        {
            try
            {
                return Ok(await sRepo.GetFeedBackREPOnlineByStatus(lId, status, FeedBackFromDate,FeedBackToDate));
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
        public async Task<IActionResult> GetTransFeedBackREPOnline(int sId)
        {
            try
            {
                return Ok(await sRepo.GetTransFeedBackREPOnlines(sId));
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
        [SKFAuthorize("PRG65:P3")]
        public async Task<IActionResult> Update([FromBody] FeedBackREPOnlineModel svm)
        {
            try
            {
                return Ok(await sRepo.SaveOrUpdate(svm));
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
        [SKFAuthorize("PRG65:P2")]
        public async Task<IActionResult> Create([FromBody] FeedBackREPOnlineModel svm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                svm.UserId = cUser.UserId;
                svm.FeedBackREPOnlineId = 0;
                svm.Active = "Y";
                return Ok(await sRepo.SaveOrUpdate(svm));
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

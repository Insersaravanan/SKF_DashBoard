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

namespace EMaintanance.Controllers
{
    [Authorize]
    public class DashboardController : Controller
    {
        private readonly DashboardRepo dRepo;
        private IConfiguration _configuration;

        public DashboardController(IConfiguration configuration)
        {
            dRepo = new DashboardRepo(configuration);
            _configuration = configuration;
        }

        public IActionResult Index()
        {
            return View();
        }

        public IActionResult Add()
        {
            return View();
        }

        public IActionResult FaultCount()
        {
            return View();
        }

        [HttpPost]
        [SKFAuthorize("WGT01:P1")]
        public async Task<IActionResult> GetFaultCount([FromBody] DashboardReportViewModel drvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                return Ok(await dRepo.GetFaultReportByParam(drvm));
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
        //[SKFAuthorize("WGT01:P1")]
        public async Task<IActionResult> GetFaultReportDetail(int ClientSiteId)
        {
            try
            {
                return Ok(await dRepo.GetFaultReportDetail(ClientSiteId));
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
        //[SKFAuthorize("WGT01:P1")]
        public async Task<IActionResult> GetPlantNameByClientSite(int ClientSiteId)
        {
            try
            {
                return Ok(await dRepo.GetPlantNameByClientSite(ClientSiteId));
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
        public async Task<IActionResult> GetFailureCauseDetail([FromBody] FailureCauseReportDetail fcrd)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                return Ok(await dRepo.GetFailureCauseDetail(fcrd));
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



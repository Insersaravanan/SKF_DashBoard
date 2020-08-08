using EMaintanance.Repository;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG45")]
    public class SummaryReportController : Controller
    {
        private readonly SummaryReportRepo summaryReportRepo;
        private IConfiguration _configuration;

        public SummaryReportController(IConfiguration configuration)
        {
            summaryReportRepo = new SummaryReportRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG45:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [SKFAuthorize("PRG45:P1")]
        public async Task<IActionResult> GetSummaryReportList([FromBody] SearchSummaryReportViewModel scmvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                return Ok(await summaryReportRepo.GetSummaryReportList(scmvm));
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
        [SKFAuthorize("PRG45:P1")]
        public async Task<IActionResult> GetSummaryReportToDownload(int jId, int lId)
        {
            try
            {
                return Ok(await summaryReportRepo.GetSummaryReportToExport(jId, lId));
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
        [SKFAuthorize("PRG45:P1")]
        public async Task<IActionResult> GetSummaryReportDateRangeToDownload([FromBody] SearchSummaryReportViewModel scmvm)
        {
            try
            {
                return Ok(await summaryReportRepo.GetSummaryReportDateRangeToExport(scmvm));
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

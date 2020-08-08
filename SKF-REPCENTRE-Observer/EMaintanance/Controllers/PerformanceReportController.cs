using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG03")]
    public class PerformanceReportController : Controller
    {
        private readonly PerformanceReportRepo prRepo;
        private IConfiguration _configuration;

        public PerformanceReportController(IConfiguration configuration)
        {
            _configuration = configuration;
            prRepo = new PerformanceReportRepo(configuration);

        }

        [SKFAuthorize("PRG03:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [SKFAuthorize("PRG03:P1")]
        public async Task<IActionResult> GetPerformanceReport([FromBody] PerformanceReportViewModel prvm)
        {
            try
            {
                return Ok(await prRepo.GetPerformanceReport(prvm));
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

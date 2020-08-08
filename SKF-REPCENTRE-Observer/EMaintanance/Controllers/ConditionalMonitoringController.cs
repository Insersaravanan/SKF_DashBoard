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
    public class ConditionalMonitoringController : Controller
    {
        private readonly ConditionalMonitoringRepo conditionalMonitoringRepo;
        private IConfiguration _configuration;

        public ConditionalMonitoringController(IConfiguration configuration)
        {
            conditionalMonitoringRepo = new ConditionalMonitoringRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG45:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [SKFAuthorize("PRG45:P1")]
        public async Task<IActionResult> GetConditionReportList([FromBody] SearchConditionalMonitoringViewModel scmvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                return Ok(await conditionalMonitoringRepo.GetConditionReportList(scmvm));
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

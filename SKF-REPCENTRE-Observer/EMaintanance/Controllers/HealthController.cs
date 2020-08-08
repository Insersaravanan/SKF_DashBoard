using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Stimulsoft.Report;
using Stimulsoft.Report.Mvc;

namespace EMaintanance.Controllers
{
    [Authorize]
    public class HealthController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;
        private IConfiguration _configuration;
        public HealthController(IConfiguration configuration, IHostingEnvironment environment)
        {
            Configuration = configuration;
            _hostingEnvironment = environment;
        }

        public IConfiguration Configuration { get; }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Dashboard(ReportViewModel rsvm)
        {
            TempData["csId"] = rsvm.ClientSiteId;
            TempData["lId"] = rsvm.LanguageId;
            return View();
        }

        public IActionResult GetReport()
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            var report = new StiReport();
            var path = Path.Combine(_hostingEnvironment.WebRootPath, "reports/HealthDashboard.mrt");
            report.Load(path);

            string newConnectionString = Configuration.GetConnectionString("SKF.Master");
            report.Dictionary.Databases.Clear();
            report.Dictionary.Databases.Add(new Stimulsoft.Report.Dictionary.StiSqlDatabase("C2Maintenance", newConnectionString));
            Stimulsoft.Report.Dashboard.StiCacheCleaner.Clean(report.Key);
            //report.Dictionary.Variables["@ClientSiteId"].ValueObject = TempData["csId"];
            report.Dictionary.Variables["@UserId"].ValueObject = cUser.UserId;
            report.Dictionary.Variables["@LanguageId"].ValueObject = TempData["lId"];

            return StiNetCoreViewer.GetReportResult(this, report);

        }

        public IActionResult ViewerEvent()
        {
            return StiNetCoreViewer.ViewerEventResult(this);
        }

    }
}
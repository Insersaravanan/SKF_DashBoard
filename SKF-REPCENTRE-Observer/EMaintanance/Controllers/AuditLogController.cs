using EMaintanance.Utils;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Stimulsoft.Report;
using Stimulsoft.Report.Mvc;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG52")]
    public class AuditLogController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;

        public AuditLogController(IConfiguration configuration, IHostingEnvironment environment)
        {
            Configuration = configuration;
            _hostingEnvironment = environment;
        }

        public IConfiguration Configuration { get; }

        [SKFAuthorize("PRG52:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [SKFAuthorize("PRG52:P1")]
        public IActionResult GetReport()
        {
            var report = new StiReport();
            var path = Path.Combine(_hostingEnvironment.WebRootPath, "reports/EmaintenanceAuditLog.mrt");
            report.Load(path);

            string newConnectionString = Configuration.GetConnectionString("SKF.Master");
            report.Dictionary.Databases.Clear();
            report.Dictionary.Databases.Add(new Stimulsoft.Report.Dictionary.StiSqlDatabase("C2Maintenance", newConnectionString));
            Stimulsoft.Report.Dashboard.StiCacheCleaner.Clean(report.Key);
            report.Dictionary.Variables["@LanguageId"].ValueObject = 1;

            return StiNetCoreViewer.GetReportResult(this, report);
        }

        public IActionResult ViewerEvent()
        {
            return StiNetCoreViewer.ViewerEventResult(this);
        }
    }
}

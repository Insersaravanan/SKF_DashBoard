using EMaintanance.Repository;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Stimulsoft.Report;
using Stimulsoft.Report.Mvc;
using System;
using System.IO;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [Authorize]
    public class ReportController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;
        private readonly ApplicationConfigurationRepo appConfigRepo;
        public ReportController(IConfiguration configuration, IHostingEnvironment environment)
        {
            Configuration = configuration;
            _hostingEnvironment = environment;
            appConfigRepo = new ApplicationConfigurationRepo(configuration);
        }

        public IConfiguration Configuration { get; }

        [HttpPost]
        public IActionResult Index(ReportViewModel rsvm)
        {

            if (rsvm.Type == "CMR")
            {
                TempData["jeId"] = rsvm.JobEquipmentId;
                TempData["lId"] = rsvm.LanguageId;
                TempData["type"] = rsvm.Type;
            }
            else if (rsvm.Type == "SR")
            {
                TempData["lId"] = rsvm.LanguageId;
                TempData["jId"] = rsvm.JobId;
                TempData["type"] = rsvm.Type;
                TempData["cId"] = rsvm.ClientSiteId;
            }
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> GetReport()
        {
            var type = TempData["type"];
            var report = new StiReport();

            if (type.Equals("CMR"))
            {
                ApplicationConfigurationViewModel appConfig = null;
                appConfig = await appConfigRepo.GetAppConfigByName("MRXPassword", "Y");
                if (appConfig != null && appConfig.AppConfigValue != null)
                {
                    var path = Path.Combine(_hostingEnvironment.WebRootPath, "reports/EquipmentConditionMonitoring.mrx");
                    report.LoadEncryptedReport(path, appConfig.AppConfigValue);
                }
                else
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!, Please provide a valid password to read the Report Template.", "Error", true, "Unable to Load Data, Please Contact Support!!!, Please provide a valid password to read the Report Template.");
                }
            }
            else if (type.Equals("SR"))
            {
                ApplicationConfigurationViewModel appConfig = null;
                appConfig = await appConfigRepo.GetAppConfigByName("MRXPassword", "Y");
                if (appConfig != null && appConfig.AppConfigValue != null)
                {
                    var path = Path.Combine(_hostingEnvironment.WebRootPath, "reports/SummaryReport.mrx");
                    report.LoadEncryptedReport(path, appConfig.AppConfigValue);
                }
                else
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!, Please provide a valid password to read the Report Template.", "Error", true, "Unable to Load Data, Please Contact Support!!!, Please provide a valid password to read the Report Template.");
                }
            }

            string newConnectionString = Configuration.GetConnectionString("SKF.Master");
            report.Dictionary.Databases.Clear();
            report.Dictionary.Databases.Add(new Stimulsoft.Report.Dictionary.StiSqlDatabase("C2Maintenance", newConnectionString));

            if (type.Equals("CMR"))
            {
                report.Dictionary.Variables["@JobEquipmentId"].ValueObject = TempData["jeId"];
            }
            else if (type.Equals("SR"))
            {
                report.Dictionary.Variables["@JobId"].ValueObject = TempData["jId"];
                report.Dictionary.Variables["@ClientSiteId"].ValueObject = TempData["cId"];
            }
            report.Dictionary.Variables["@LanguageId"].ValueObject = TempData["lId"];

            return StiNetCoreViewer.GetReportResult(this, report);
        }

        public IActionResult ViewerEvent()
        {
            return StiNetCoreViewer.ViewerEventResult(this);
        }

    }
}

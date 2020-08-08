using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Stimulsoft.Base;
using Stimulsoft.Report;
using Stimulsoft.Report.Mvc;

namespace EMaintanance.Controllers
{
    [Authorize]
    public class HomeController : Controller
    {
        private IHostingEnvironment _hostingEnvironment;
        private IConfiguration _configuration;
        private readonly ApplicationConfigurationRepo appConfigRepo;
        private readonly CustomAuthService customAuthService;
        public HomeController(IConfiguration configuration, IHostingEnvironment environment)
        {
            _configuration = configuration;
            _hostingEnvironment = environment;
            appConfigRepo = new ApplicationConfigurationRepo(configuration);
            customAuthService = new CustomAuthService(configuration);
        }

        public IConfiguration Configuration { get; }


        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        public IActionResult Dashboard([FromBody]ReportViewModel rsvm)
        {
            TempData["csId"] = rsvm.ClientSiteId;
            TempData["lId"] = rsvm.LanguageId;
            return View();
        }

        public async Task<IActionResult> GetReport()
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            var report = new StiReport();
            ApplicationConfigurationViewModel appConfig = null;
            appConfig = await appConfigRepo.GetAppConfigByName("MRXPassword", "Y");
            // This is to load Admin Dashboard
            if (customAuthService.CheckPermission(cUser.UserId, "PRG53", "P1"))
            {
                if (appConfig != null && appConfig.AppConfigValue != null)
                {
                    var path = Path.Combine(_hostingEnvironment.WebRootPath, "reports/EmaintAnalystDashboard.mrx");
                    report.LoadEncryptedReport(path, appConfig.AppConfigValue);
                }
                else
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!, Please provide a valid password to read the Report Template.", "Error", true, "Unable to Load Data, Please Contact Support!!!, Please provide a valid password to read the Report Template.");
                }
            }
            // This is to load Client Dashboard
            else if (customAuthService.CheckPermission(cUser.UserId, "PRG54", "P1"))
            {
                if (appConfig != null && appConfig.AppConfigValue != null)
                {
                    var path = Path.Combine(_hostingEnvironment.WebRootPath, "reports/EmaintClientDashboard.mrx");
                    report.LoadEncryptedReport(path, appConfig.AppConfigValue);
                }
                else
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!, Please provide a valid password to read the Report Template.", "Error", true, "Unable to Load Data, Please Contact Support!!!, Please provide a valid password to read the Report Template.");
                }
            }
            // This is to load Warning MRX states, "Insufficient Privilege Please contact your Administrator"
            else
            {
                if (appConfig != null && appConfig.AppConfigValue != null)
                {
                    var path = Path.Combine(_hostingEnvironment.WebRootPath, "reports/UnauthorizedDashboard.mrt");
                    report.Load(path);
                    return StiNetCoreViewer.GetReportResult(this, report);
                }
                else
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!, Please provide a valid password to read the Report Template.", "Error", true, "Unable to Load Data, Please Contact Support!!!, Please provide a valid password to read the Report Template.");
                }
            }

            string newConnectionString = _configuration.GetConnectionString("SKF.Master");
            report.Dictionary.Databases.Clear();
            report.Dictionary.Databases.Add(new Stimulsoft.Report.Dictionary.StiSqlDatabase("C2Maintenance", newConnectionString));
            Stimulsoft.Report.Dashboard.StiCacheCleaner.Clean(report.Key);
            report.Key = StiKeyHelper.GenerateKey();
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
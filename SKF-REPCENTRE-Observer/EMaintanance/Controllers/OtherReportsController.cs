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
using Microsoft.Extensions.Primitives;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG42")]
    public class OtherReportsController : Controller
    {
        private readonly OtherReportsRepo OtherReportsRepo;
        private IConfiguration _configuration;
        private readonly FileUploadService fileUploadService;

        public OtherReportsController(IConfiguration configuration)
        {
            _configuration = configuration;
            OtherReportsRepo = new OtherReportsRepo(configuration);
            fileUploadService = new FileUploadService(configuration);
        }

        [SKFAuthorize("PRG42:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG42:P1")]
        public async Task<IActionResult> GetOtherReportsByStatus(int csId, string status)
        {
            try

            {
                return Ok(await OtherReportsRepo.GetOtherReportsByStatus(csId, status));
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
        [SKFAuthorize("PRG42:P1")]
        public async Task<IActionResult> GetEquipmentByPlant(int lId, int plantId)
        {
            try
            {
                return Ok(await OtherReportsRepo.GetEquipmentByPlant(lId, plantId));
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
        [SKFAuthorize("PRG32:P2")]
        public async Task<IActionResult> UploadFiles()
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                var customHeaders = Request.Headers;
                StringValues aId = "";
                StringValues Type = "";
                StringValues FileDescription = "";
                StringValues PlantAreaId = "";
                StringValues ReportTypeId = "";
                StringValues EquipmentId = "";
                StringValues UnitId = "";
                StringValues ReportDate = "";
                if (customHeaders.ContainsKey("aId") && customHeaders.ContainsKey("Type"))
                {
                    customHeaders.TryGetValue("aId", out aId);
                    customHeaders.TryGetValue("Type", out Type);
                    customHeaders.TryGetValue("fileDescription", out FileDescription);
                    customHeaders.TryGetValue("plantAreaId", out PlantAreaId);
                    customHeaders.TryGetValue("equipmentId", out EquipmentId);
                    customHeaders.TryGetValue("unitId", out UnitId);
                    customHeaders.TryGetValue("reportTypeId", out ReportTypeId);
                    customHeaders.TryGetValue("reportDate", out ReportDate);
                    List<FileUploadViewModel> fuvms = await fileUploadService.UploadFiles(Request, HttpContext);
                    foreach (FileUploadViewModel fuvm in fuvms)
                    {
                        OtherReportsViewModel orvm = new OtherReportsViewModel();
                        orvm.ClientSiteId = Int32.Parse(aId);
                        orvm.PlantAreaId = Int32.Parse(PlantAreaId);
                        orvm.EquipmentId = Int32.Parse(EquipmentId);
                        orvm.UnitId = Int32.Parse(UnitId);
                        orvm.ReportTypeId = Int32.Parse(ReportTypeId);
                        orvm.ReportDate = DateTime.Parse(ReportDate);
                        orvm.FileDescription = FileDescription;
                        orvm.FileName = fuvm.OriginalFileName;
                        orvm.LogicalName = fuvm.LogicalFileName;
                        orvm.PhysicalPath = fuvm.PhysicalFilePath;
                        orvm.Active = "Y";
                        orvm.UserId = cUser.UserId;
                        await OtherReportsRepo.SaveOrUpdate(orvm);
                    }
                }

                return Json("Success");
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

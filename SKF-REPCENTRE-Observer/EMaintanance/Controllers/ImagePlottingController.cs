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
    [SKFAuthorize("PRG58")]
    public class ImagePlottingController : Controller
    {
        private readonly FileUploadService fileUploadService;
        private readonly ImagePlottingRepo imagePlottingRepo;
        private IConfiguration _configuration;

        public ImagePlottingController(IConfiguration configuration)
        {
            fileUploadService = new FileUploadService(configuration);
            imagePlottingRepo = new ImagePlottingRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG58:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [SKFAuthorize("PRG58:P1")]
        [HttpPost]
        public async Task<IActionResult> LoadPlottingDetail([FromBody] ImagePlottingViewModel ipvm)
        {
            try
            {
                return Ok(await imagePlottingRepo.LoadPlottingDetail(ipvm));
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

        [SKFAuthorize("PRG58:P2")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ImagePlottingViewModel ipvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                ipvm.UserId = cUser.UserId;
                return Ok(await imagePlottingRepo.SaveOrUpdate(ipvm));
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

        /** The below method is used to Inactive Attachment by Id (Individual API Service) */
        [HttpPost]
        [SKFAuthorize("PRG58:P3")]
        public async Task<IActionResult> RemoveMapping([FromBody] RemoveMappingViewModel rmvm)
        {
            try
            {
                return Ok(await imagePlottingRepo.DetetePlottingRAttachmentById(rmvm.AttachmentId, rmvm.PlottingId));
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

        [SKFAuthorize("PRG58:P2")]
        public async Task<IActionResult> UploadFiles()
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                var customHeaders = Request.Headers;
                StringValues aId = "";
                StringValues PlantAreaId = "";
                StringValues EquipmentId = "";
                StringValues UnitType = "";
                StringValues UnitId = "";
                StringValues PlotType = "";
                StringValues ImageHeight = "";
                StringValues ImageWidth = "";
                if (customHeaders.ContainsKey("aId") && customHeaders.ContainsKey("Type"))
                {
                    customHeaders.TryGetValue("plantAreaId", out PlantAreaId);
                    customHeaders.TryGetValue("equipmentId", out EquipmentId);
                    customHeaders.TryGetValue("unitType", out UnitType);
                    customHeaders.TryGetValue("unitId", out UnitId);
                    customHeaders.TryGetValue("plotType", out PlotType);
                    List<FileUploadViewModel> fuvms = await fileUploadService.UploadFiles(Request, HttpContext);
                    foreach (FileUploadViewModel fuvm in fuvms)
                    {
                        ImagePlottingAttachmentViewModel ipavm = new ImagePlottingAttachmentViewModel();
                        ipavm.PlottingAttachId = 0;
                        if (PlotType == "PL")
                        {
                            ipavm.PlantAreaId = Int32.Parse(PlantAreaId);
                        }
                        if (PlotType == "EQ")
                        {
                            ipavm.EquipmentId = Int32.Parse(EquipmentId);
                        }
                        if (PlotType == "AS")
                        {
                            ipavm.UnitType = UnitType;
                            ipavm.UnitId = Int32.Parse(UnitId);
                        }
                        ipavm.PlotType = PlotType;
                        ipavm.FileName = fuvm.OriginalFileName;
                        ipavm.LogicalName = fuvm.LogicalFileName;
                        ipavm.PhysicalPath = fuvm.PhysicalFilePath;
                        ipavm.Active = "Y";
                        ipavm.UserId = cUser.UserId;
                        await imagePlottingRepo.SaveOrUpdateAttachment(ipavm);
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

        [SKFAuthorize("PRG58:P2")]
        [HttpPost]
        public async Task<IActionResult>SavePlantGeoLocation ([FromBody]  PlantGeoLocationViewModel pglvm)
        {
            try
            {
                return Ok(await imagePlottingRepo.SavePlantGeoLocation(pglvm));
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
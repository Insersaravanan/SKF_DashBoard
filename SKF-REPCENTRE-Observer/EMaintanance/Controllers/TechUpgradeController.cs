using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG43")]
    public class TechUpgradeController : Controller
    {
        private readonly TechUpgradeRepo iRepo;
        private IConfiguration _configuration;
        private readonly FileUploadService fileUploadService;
        public TechUpgradeController(IConfiguration configuration)
        {
            iRepo = new TechUpgradeRepo(configuration);
            _configuration = configuration;
            fileUploadService = new FileUploadService(configuration);
        }

        [SKFAuthorize("PRG43:P1")]
        public IActionResult Index()
        {
            return View();
        }

     
        [HttpGet]
        [SKFAuthorize("PRG43:P1")]
        public async Task<IActionResult> GetTechUpgradeByStatus(int lId, int csId, string status)
        {
            try

            {
                return Ok(await iRepo.GetTechUpgradeByStatus(lId, csId, status));
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
        [SKFAuthorize("PRG43:P1")]
        public async Task<IActionResult> GetEquipmentByPlant(int lId, int plantId)
        {
            try
            {
                return Ok(await iRepo.GetEquipmentByPlan(lId, plantId));
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
        [SKFAuthorize("PRG43:P2")]
        public async Task<IActionResult> UploadFiles()
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                var customHeaders = Request.Headers;
                StringValues aId = "";
                StringValues Type = "";
                StringValues EquipmentId = "";
                StringValues PlantAreaId = "";
                StringValues Saving = "";
                StringValues ReportDate = "";
                StringValues RecommendationDate = "";
                StringValues Recommendation = "";
                StringValues Remarks = "";
                if (customHeaders.ContainsKey("aId") && customHeaders.ContainsKey("Type"))
                {
                    customHeaders.TryGetValue("aId", out aId);
                    customHeaders.TryGetValue("Type", out Type);
                    customHeaders.TryGetValue("equipmentId", out EquipmentId);
                    customHeaders.TryGetValue("plantAreaId", out PlantAreaId);
                    customHeaders.TryGetValue("saving", out Saving);
                    customHeaders.TryGetValue("reportDate", out ReportDate);
                    customHeaders.TryGetValue("recommendationDate", out RecommendationDate);
                    customHeaders.TryGetValue("recommendation", out Recommendation);
                    customHeaders.TryGetValue("remarks", out Remarks);
                    List<FileUploadViewModel> fuvms = await fileUploadService.UploadFiles(Request, HttpContext);
                    foreach (FileUploadViewModel fuvm in fuvms)
                    {
                        TechUpgradeViewModel svm = new TechUpgradeViewModel();
                        svm.ClientSiteId = Int32.Parse(aId);
                        svm.EquipmentId = Int32.Parse(EquipmentId);
                        svm.ReportDate = DateTime.Parse(ReportDate);
                        svm.Saving = Decimal.Parse(Saving);
                        svm.RecommendationDate = DateTime.Parse(RecommendationDate);
                        svm.Recommendation = Recommendation;
                        svm.OriginalFileName = fuvm.OriginalFileName;
                        svm.LogicalFileName = fuvm.LogicalFileName;
                        svm.PhysicalFilePath = fuvm.PhysicalFilePath.Replace(@"\", @"/");
                        svm.Active = "Y";
                        svm.UserId = cUser.UserId;
                        await iRepo.SaveOrUpdate(svm);
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

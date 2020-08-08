using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
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
    public class LeverageExportController : Controller
    {
        private readonly LeverageExportRepo leverageExportRepo;
        private readonly IConfiguration _configuration;
        private readonly ApplicationConfigurationRepo appConfigRepo;
        public LeverageExportController(IConfiguration configuration)
        {
            leverageExportRepo = new LeverageExportRepo(configuration);
            appConfigRepo = new ApplicationConfigurationRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG56:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG56:P1")]
        public async Task<IActionResult> GetLeveragesByEquipment(int jeId, int lId)
        {
            try
            {
                return Ok(await leverageExportRepo.GetLevergesByEquipmentId(jeId, lId));
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
        [SKFAuthorize("PRG56:P1")]
        public async Task<IActionResult> GetLeveragesByParams([FromBody] LeverageExportSearchViewModel lsvm)
        {
            try
            {
                return Ok(await leverageExportRepo.GetLevergesByParams(lsvm));
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
        [SKFAuthorize("PRG56:P2")]
        public async Task<IActionResult> Create([FromBody] List<LeverageExportViewModel> lvms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                if (lvms != null && lvms.Count > 0)
                {
                    foreach (LeverageExportViewModel lvm in lvms)
                    {
                        if (lvm.LeverageServiceId == 0)
                        {
                            lvm.UserId = cUser.UserId;
                            lvm.LeverageServiceId = 0;
                            lvm.Active = "Y";
                        }

                        await leverageExportRepo.SaveOrUpdate(lvm);
                    }
                    return Ok("Success");
                }
                else
                {
                    throw new CustomException("Unable to Save Data, Please Contact Support!!!", "Error", true, "Please send Valid data to Create Leverage Service.");
                }
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
        [SKFAuthorize("PRG56:P2")]
        public async Task<IActionResult> ExportLeverage([FromBody] LeverageExportViewModel lvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                lvm.UserId = cUser.UserId;
                var appConfig = await appConfigRepo.GetAppConfigByName("LeverageFilePath", "Y");
                lvm.FilePath = appConfig.AppConfigValue;
                return Ok(await leverageExportRepo.SaveExportLeverageFiles(lvm));
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
        [SKFAuthorize("PRG56:P1")]
        public async Task<IActionResult> GetExportLeverageFiles([FromBody] LeverageExportSearchViewModel lsvm)
        {
            try
            {
                return Ok(await leverageExportRepo.GetExportLeverageFiles(lsvm));
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
        [SKFAuthorize("PRG56:P5")]
        public async Task<IActionResult> GetLeveragesToDownload(int leId, int lId)
        {
            try
            {
                return Ok(await leverageExportRepo.GetLeveragesToExport(leId, lId));
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


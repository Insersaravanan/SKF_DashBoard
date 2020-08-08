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
    //[SKFAuthorize("PRG69")]
    public class HistoricalReportsController : Controller
    {
        private readonly HistoricalReportsRepo HistoricalReportsRepo;
        private IConfiguration _configuration;
        private readonly FileUploadService fileUploadService;

        public HistoricalReportsController(IConfiguration configuration)
        {
            _configuration = configuration;
            HistoricalReportsRepo = new HistoricalReportsRepo(configuration);
            fileUploadService = new FileUploadService(configuration);
        }

       // [SKFAuthorize("PRG69:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
      //  [SKFAuthorize("PRG69:P1")]
        public async Task<IActionResult> GetHistoricalReportsByStatus(int csId, int plantId, int EquipmentId, int UnitId, string SensorId, DateTime FromDate, DateTime? ToDate, string Status)
        {
            try

            {
                return Ok(await HistoricalReportsRepo.GetHistoricalReportsByStatus(csId, plantId, EquipmentId, UnitId, SensorId, FromDate, ToDate, Status));
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
       // [SKFAuthorize("PRG69:P1")]
        public async Task<IActionResult> GetHistoricalPlantByStatus(int lId, int csId, string status)
        {
            //CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var result = await HistoricalReportsRepo.GetHistoricalPlantByStatus(lId, csId);
                return Ok(result);
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
       // [SKFAuthorize("PRG69:P1")]
        public async Task<IActionResult> GetHistoricalEquipmentByStatus(int lId, int eId, int csId, int rId, string type, string at, string status)
        {
          //  CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {

                var result = await HistoricalReportsRepo.GetHistoricalEquipmentByStatus(lId, eId, csId, rId, type, at, status);
               // await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Equipment", "Equipment List Loaded");
                return Ok(result);
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
       // [SKFAuthorize("PRG69:P1")]
        public async Task<IActionResult> GetEquipmentByPlant(int lId, int plantId)
        {
            try
            {
                return Ok(await HistoricalReportsRepo.GetEquipmentByPlant(lId, plantId));
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
       // [SKFAuthorize("PRG69:P1")]
        public async Task<IActionResult> GetSensorByUnit(int lId, int UnitId)
        {
            try
            {
                return Ok(await HistoricalReportsRepo.GetSensorByUnit(lId, UnitId));
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

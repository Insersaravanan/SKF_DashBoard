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
    [SKFAuthorize("PRG57")]
    public class AssetSensorMappingController : Controller
    {
        private readonly AssetSensorMappingRepo AssetSensorMappingRepo;
        private IConfiguration _configuration;

        public AssetSensorMappingController(IConfiguration configuration)
        {
            AssetSensorMappingRepo = new AssetSensorMappingRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG57:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [SKFAuthorize("PRG57:P1")]
        [HttpGet]
        public async Task<IActionResult> GetAssetHierarchy(int lId, int cId)
        {
            try
            {
                return Ok(await AssetSensorMappingRepo.GetAssetHierarchy(lId, cId));
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

        [SKFAuthorize("PRG57:P1")]
        [HttpGet]
        public async Task<IActionResult> GetObserverUnitMapping(string uType, int uId, int lId)
        {
            try
            {
                return Ok(await AssetSensorMappingRepo.GetObserverUnitMapping(uType, uId, lId));
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

        [SKFAuthorize("PRG57:P2")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody]  AssetSensorMappingViewModel Asmvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                Asmvm.UserId = cUser.UserId;
                return Ok(await AssetSensorMappingRepo.SaveOrUpdate(Asmvm));
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

        [SKFAuthorize("PRG57:P1")]
        [HttpGet]
        public async Task<IActionResult> GetEunit(string Type, int lId, int sId,int sId1)
        {
            try
            {
                return Ok(await AssetSensorMappingRepo.GetEUnit(Type, lId, sId, sId1));
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
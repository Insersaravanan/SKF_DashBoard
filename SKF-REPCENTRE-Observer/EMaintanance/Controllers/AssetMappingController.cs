using EMaintanance.Repository;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG60")]
    public class AssetMappingController :  Controller
    {
        private readonly AssetMappingRepo AssetMappingRepo;
        private IConfiguration _configuration;
        public AssetMappingController(IConfiguration configuration)
        {
            AssetMappingRepo = new AssetMappingRepo(configuration);
            _configuration = configuration;
        }

       [SKFAuthorize("PRG60:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG60:P1")]
        public async Task<IActionResult> GetAssetMappingList(int cId, int lId)
        {
            try
            {
                return Ok(await AssetMappingRepo.GetAssetMapping(cId, lId));
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
        [SKFAuthorize("PRG60:P2")]
        public async Task<IActionResult> Create([FromBody] AssetMappingViewModel amvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                return Ok(await AssetMappingRepo.SaveOrUpdate(amvm));
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



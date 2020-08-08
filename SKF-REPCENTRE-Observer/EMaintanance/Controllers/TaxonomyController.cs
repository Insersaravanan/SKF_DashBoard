using EMaintanance.Repository;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG17")]
    public class TaxonomyController : Controller
    {
        private readonly TaxonomyRepo taxonomyRepo;
        private IConfiguration _configuration;
        public TaxonomyController(IConfiguration configuration)
        {
            taxonomyRepo = new TaxonomyRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG17:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG17:P1")]
        public async Task<IActionResult> GetTaxonomyByStatus(int lId, string status)
        {
            try
            {
                return Ok(await taxonomyRepo.GetTaxonomyByStatus(lId, status));
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
        [SKFAuthorize("PRG17:P1")]
        public async Task<IActionResult> GetAssetCategory(int LanguageId, string status)
        {
            try
            {
                return Ok(await taxonomyRepo.GetAssetCategory(LanguageId, status));
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
        [SKFAuthorize("PRG17:P1")]
        public async Task<IActionResult> GetLoadListItem(string type, int lId, int sId, int sId1)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                if (type == "UserCountryAccess")
                {
                    sId = cUser.UserId;
                }
                return Ok(await taxonomyRepo.GetLoadListItem(type, lId, sId, sId1));
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
        [SKFAuthorize("PRG17:P1")]
        public async Task<IActionResult> Search([FromBody] TaxonomyViewModel tvm)
        {
            try
            {
                return Ok(await taxonomyRepo.GetTaxonomyByParams(tvm));
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
        [SKFAuthorize("PRG17:P3")]
        public async Task<IActionResult> Update([FromBody] TaxonomyViewModel tvm)
        {
            try
            {
                return Ok(await taxonomyRepo.SaveOrUpdate(tvm));
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

        [HttpPost]
        [SKFAuthorize("PRG17:P2")]
        public async Task<IActionResult> Create([FromBody] TaxonomyViewModel tvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                tvm.UserId = cUser.UserId;
                tvm.TaxonomyId = 0;
                tvm.Active = "Y";
                return Ok(await taxonomyRepo.SaveOrUpdate(tvm));
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

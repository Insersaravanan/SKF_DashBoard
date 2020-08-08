using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMaintanance.Repository;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG41")]
    public class ManufacturerController : Controller
    {
        private readonly ManufactureRepo manuRepo;
        private IConfiguration _configuration;
        public ManufacturerController(IConfiguration configuration)
        {
            _configuration = configuration;
            manuRepo = new ManufactureRepo(configuration);
        }
        [SKFAuthorize("PRG41:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG41:P1")]
        public async Task<IActionResult> GetManufactureByStatus(int lId, string status)
        {
            try
            {
                return Ok(await manuRepo.GetManufactureByStatus(lId, status));
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
        [SKFAuthorize("PRG41:P1")]
        public async Task<IActionResult> GetTransManufacture(int mId)
        {
            try
            {
                return Ok(await manuRepo.GetTransManufacture(mId));
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
        [SKFAuthorize("PRG41:P3")]
        public async Task<IActionResult> Update([FromBody] ManufactureViewModel mt)
        {
            try
            {
                return Ok(await manuRepo.SaveOrUpdate(mt));
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
        [SKFAuthorize("PRG41:P2")]
        public async Task<IActionResult> Create([FromBody] ManufactureViewModel mt)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                mt.UserId = cUser.UserId;
                mt.ManufacturerId = 0;
                mt.Active = "Y";
                return Ok(await manuRepo.SaveOrUpdate(mt));
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
        [SKFAuthorize("PRG41:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<ManufactureViewModel> ml)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (ManufactureViewModel ms in ml)
                {
                    ms.UserId = cUser.UserId;
                    await manuRepo.SaveOrUpdate(ms);
                }

                return Ok();
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

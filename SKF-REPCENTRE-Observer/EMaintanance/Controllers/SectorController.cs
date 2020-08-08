using EMaintanance.Repository;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG06")]
    public class SectorController : Controller
    {
        private readonly SectorRepo sRepo;
        private IConfiguration _configuration;
        public SectorController(IConfiguration configuration)
        {
            _configuration = configuration;
            sRepo = new SectorRepo(configuration);
        }

        [SKFAuthorize("PRG06:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG06:P1")]
        public async Task<IActionResult> GetSectorByStatus(int lId, string status)
        {
            try
            {
                return Ok(await sRepo.GetSectorByStatus(lId, status));
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
        public async Task<IActionResult> GetTransSector(int sId)
        {
            try
            {
                return Ok(await sRepo.GetTransSectors(sId));
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
        [SKFAuthorize("PRG06:P3")]
        public async Task<IActionResult> Update([FromBody] SectorViewModel svm)
        {
            try
            {
                return Ok(await sRepo.SaveOrUpdate(svm));
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
        [SKFAuthorize("PRG06:P2")]
        public async Task<IActionResult> Create([FromBody] SectorViewModel svm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                svm.UserId = cUser.UserId;
                svm.SectorId = 0;
                svm.Active = "Y";
                return Ok(await sRepo.SaveOrUpdate(svm));
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
        [SKFAuthorize("PRG06:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<SectorViewModel> svms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (SectorViewModel svm in svms)
                {
                    svm.UserId = cUser.UserId;
                    await sRepo.SaveOrUpdate(svm);
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

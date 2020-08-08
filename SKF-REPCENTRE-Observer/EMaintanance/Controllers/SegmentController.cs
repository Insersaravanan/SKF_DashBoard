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
    [SKFAuthorize("PRG12")]
    public class SegmentController : Controller
    {
        private readonly SegmentRepo segRepo;
        private IConfiguration _configuration;
        public SegmentController(IConfiguration configuration)
        {
            segRepo = new SegmentRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG12:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetSegmentByStatus(int lId, string status)
        {
            try
            {
                return Ok(await segRepo.GetSegmentByStatus(lId, status));
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
        [SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> Search([FromBody] SegmentViewModel svm)
        {
            try
            {
                return Ok(await segRepo.GetSegmentByParams(svm));
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
        public async Task<IActionResult> GetSegmentBySector(int lId, int sectorId)
        {
            try
            {
                return Ok(await segRepo.GetSegmentBySector(lId, sectorId));
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
        public async Task<IActionResult> GetTransSegment(int sId)
        {
            try
            {
                return Ok(await segRepo.GetTransSegments(sId));
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
        [SKFAuthorize("PRG12:P3")]
        public async Task<IActionResult> Update([FromBody] SegmentViewModel svm)
        {
            try
            {
                return Ok(await segRepo.SaveOrUpdate(svm));
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
        [SKFAuthorize("PRG12:P2")]
        public async Task<IActionResult> Create([FromBody] SegmentViewModel svm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                svm.UserId = cUser.UserId;
                svm.SegmentId = 0;
                svm.Active = "Y";
                return Ok(await segRepo.SaveOrUpdate(svm));
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
        [SKFAuthorize("PRG12:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<SegmentViewModel> svms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                foreach (SegmentViewModel svm in svms)
                {
                    svm.UserId = cUser.UserId;
                    await segRepo.SaveOrUpdate(svm);
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

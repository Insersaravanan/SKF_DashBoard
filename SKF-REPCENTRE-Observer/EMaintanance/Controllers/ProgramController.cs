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
    [SKFAuthorize("PRG19")]
    public class ProgramController : Controller
    {
        private readonly ProgramsRepo pRepo;
        private IConfiguration _configuration;
        public ProgramController(IConfiguration configuration)
        {
            _configuration = configuration;
            pRepo = new ProgramsRepo(configuration);
        }

        [SKFAuthorize("PRG19:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [SKFAuthorize("PRG19:P1")]
        [HttpGet]
        public async Task<IActionResult> GetProgramByStatus(int lId, string status)
        {
            try
            {
                return Ok(await pRepo.GetProgramByStatus(lId, status));
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
        public async Task<IActionResult> GetTransProgram(int pId)
        {
            try
            {
                return Ok(await pRepo.GetTransProgram(pId));
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

        [SKFAuthorize("PRG19:P3")]
        [HttpPost]
        public async Task<IActionResult> Update([FromBody] ProgramViewModel pvm)
        {
            try
            {
                return Ok(await pRepo.SaveOrUpdate(pvm));
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

        [SKFAuthorize("PRG19:P2")]
        [HttpPost]
        public async Task<IActionResult> Create([FromBody] ProgramViewModel pvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                pvm.UserId = cUser.UserId;
                pvm.ProgramId = 0;
                pvm.Active = "Y";
                pvm.Internal = "N";
                return Ok(await pRepo.SaveOrUpdate(pvm));
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

        [SKFAuthorize("PRG19:P4")]
        [HttpPost]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<ProgramViewModel> pvms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (ProgramViewModel pvm in pvms)
                {
                    pvm.UserId = cUser.UserId;
                    await pRepo.SaveOrUpdate(pvm);
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

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
    [SKFAuthorize("PRG24")]
    public class ProgramPrivilegeRelController : Controller
    {
        private readonly ProgramPrivilegeRelRepo pprRepo;
        private IConfiguration _configuration;
        public ProgramPrivilegeRelController(IConfiguration configuration)
        {
            _configuration = configuration;
            pprRepo = new ProgramPrivilegeRelRepo(configuration);
        }

        [SKFAuthorize("PRG24:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG24:P1")]
        public async Task<IActionResult> GetProgramPrivilegeAccess(int lId, string pId)
        {
            try
            {
                return Ok(await pprRepo.GetProgramPrivilegeAccess(lId, pId));
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
        [SKFAuthorize("PRG24:P2")]
        public async Task<IActionResult> Create([FromBody] ProgramPrivilegeViewModel ppvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                ppvm.UserId = cUser.UserId;
                foreach (ProgramPrivilageRelations relation in ppvm.programPrivilageRelations)
                {
                    await pprRepo.SaveOrUpdate(ppvm.ProgramId, relation.Privilegeid, relation.Active, ppvm.UserId);
                }
                return Ok("Success");
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

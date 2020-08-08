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
    [SKFAuthorize("PRG25")]
    public class RolePrgPrivRelController : Controller
    {
        private readonly RolePrgPrivRepo rppRepo;
        private IConfiguration _configuration;
        public RolePrgPrivRelController(IConfiguration configuration)
        {
            _configuration = configuration;
            rppRepo = new RolePrgPrivRepo(configuration);
        }

        [SKFAuthorize("PRG25:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetRolePrgPrivAccess(int lId, int rId)
        {
            try
            {
                return Ok(await rppRepo.GetRolePrgPrivAccess(lId, rId));
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
        [SKFAuthorize("PRG25:P2")]
        public async Task<IActionResult> Create([FromBody] RolePrgPrivViewModel rppvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                rppvm.UserId = cUser.UserId;
                if (rppvm.Programs != null && rppvm.Programs.Count > 0)
                {
                    foreach (ProgramRelations prgRel in rppvm.Programs)
                    {
                        if (prgRel.Privileges != null && prgRel.Privileges.Count > 0)
                        {
                            foreach (PrivilegeRelations privRel in prgRel.Privileges)
                            {
                                await rppRepo.SaveOrUpdate(rppvm.RoleId, prgRel.ProgramId, privRel.PrivilegeId, privRel.Active, prgRel.HideProgram, rppvm.UserId);
                            }
                        }
                        else
                        {
                            continue;
                        }
                    }
                    return Ok("Success");
                }
                else
                {
                    var returnObj = new EmaintenanceMessage("No Records to save or update.", "Error", true, "Empty list, No Records to save or update.");
                    return StatusCode(StatusCodes.Status500InternalServerError, returnObj);
                }
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

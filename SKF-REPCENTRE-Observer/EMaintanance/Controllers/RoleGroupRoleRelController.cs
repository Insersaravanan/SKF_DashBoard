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
    [SKFAuthorize("PRG23")]
    public class RoleGroupRoleRelController : Controller
    {
        private readonly RoleGroupRoleRelRepo rgrrRepo;
        private IConfiguration _configuration;
        public RoleGroupRoleRelController(IConfiguration configuration)
        {
            _configuration = configuration;
            rgrrRepo = new RoleGroupRoleRelRepo(configuration);
        }

        [SKFAuthorize("PRG23:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG23:P1")]
        public async Task<IActionResult> GetRoleGroupRoleAccess(int lId, string rgId)
        {
            try
            {
                return Ok(await rgrrRepo.GetRoleGroupRoleAccess(lId, rgId));
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
        [SKFAuthorize("PRG23:P2")]
        public async Task<IActionResult> Create([FromBody] RoleGroupRoleViewModel rgrvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                rgrvm.UserId = cUser.UserId;
                foreach (RoleRelations relation in rgrvm.RoleRelations)
                {
                    await rgrrRepo.SaveOrUpdate(rgrvm.RoleGroupId, relation.RoleId, relation.Active, rgrvm.UserId);
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

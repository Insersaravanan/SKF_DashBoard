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
    [SKFAuthorize("PRG22")]
    public class UserRoleGroupRelController : Controller
    {
        private readonly UserRoleGroupRelRepo urgrRepo;
        private IConfiguration _configuration;
        public UserRoleGroupRelController(IConfiguration configuration)
        {
            _configuration = configuration;
            urgrRepo = new UserRoleGroupRelRepo(configuration);
        }

        [SKFAuthorize("PRG22:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetUserRoleGroupAccess(int lId, string uId)
        {
            try
            {
                return Ok(await urgrRepo.GetUserRoleGroupAccess(lId, uId));
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
        [SKFAuthorize("PRG22:P2")]
        public async Task<IActionResult> Create([FromBody] UserRoleGroupViewModel urgvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (Relations relation in urgvm.Relations)
                {
                    await urgrRepo.SaveOrUpdate(urgvm.UserId, relation.RoleGroupId, relation.Active);
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

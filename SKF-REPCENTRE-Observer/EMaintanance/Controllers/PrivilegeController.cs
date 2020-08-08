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
    [SKFAuthorize("PRG21")]
    public class PrivilegeController : Controller
    {
        private readonly PrivilegeRepo privilegeRepo;
        private IConfiguration _configuration;
        public PrivilegeController(IConfiguration configuration)
        {
            privilegeRepo = new PrivilegeRepo(configuration);
            _configuration = configuration;
        }

        [SKFAuthorize("PRG21:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [SKFAuthorize("PRG21:P1")]
        public async Task<IActionResult> Search([FromBody] PrivilegeViewModel pvm)
        {
            try
            {
                return Ok(await privilegeRepo.GetPrivilegeByParams(pvm));
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
        [SKFAuthorize("PRG21:P3")]
        public async Task<IActionResult> Update([FromBody] PrivilegeViewModel pvm)
        {
            try
            {
                return Ok(await privilegeRepo.SaveOrUpdate(pvm));
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
        [SKFAuthorize("PRG21:P2")]
        public async Task<IActionResult> Create([FromBody] PrivilegeViewModel pvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                pvm.UserId = cUser.UserId;
                pvm.PrivilegeId = 0;
                pvm.Active = "Y";
                return Ok(await privilegeRepo.SaveOrUpdate(pvm));
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

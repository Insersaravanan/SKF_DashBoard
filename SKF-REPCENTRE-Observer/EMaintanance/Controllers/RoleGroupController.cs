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
    [SKFAuthorize("PRG11")]
    public class RoleGroupController : Controller
    {
        private readonly RolesGroupRepo sRepo;
        private IConfiguration _configuration;
        public RoleGroupController(IConfiguration configuration)
        {
            _configuration = configuration;
            sRepo = new RolesGroupRepo(configuration);
        }

        [SKFAuthorize("PRG11:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [SKFAuthorize("PRG11:P1")]
        public async Task<IActionResult> GetRoleGroupByStatus(int lId, string status)
        {
            try
            {
                return Ok(await sRepo.GetRoleGroupByStatus(lId, status));
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
        public async Task<IActionResult> GetTransRoleGroup(int roleGroupId)
        {
            try
            {
                return Ok(await sRepo.GetTransRoleGroup(roleGroupId));
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
        [SKFAuthorize("PRG11:P3")]
        public async Task<IActionResult> Update([FromBody] RoleGroupViewModel rgvm)
        {
            try
            {
                return Ok(await sRepo.SaveOrUpdate(rgvm));
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
        [SKFAuthorize("PRG11:P2")]
        public async Task<IActionResult> Create([FromBody] RoleGroupViewModel rgvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                rgvm.UserId = cUser.UserId;
                rgvm.RoleGroupId = 0;
                rgvm.Active = "Y";
                return Ok(await sRepo.SaveOrUpdate(rgvm));
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
        [SKFAuthorize("PRG11:P4")]
        public async Task<IActionResult> SaveMultilingual([FromBody] List<RoleGroupViewModel> rgvms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (RoleGroupViewModel rgvm in rgvms)
                {
                    rgvm.UserId = cUser.UserId;
                    await sRepo.SaveOrUpdate(rgvm);
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

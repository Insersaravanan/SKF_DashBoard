using EMaintanance.Repository;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG28")]
    public class MasterImportController : Controller
    {
        private readonly ImportRepo iRepo;
        private IConfiguration _configuration;
        public MasterImportController(IConfiguration configuration)
        {
            _configuration = configuration;
            iRepo = new ImportRepo(configuration);
        }

        [SKFAuthorize("PRG28:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [SKFAuthorize("PRG28:P6")]
        public async Task<IActionResult> Import([FromBody] ImportViewModel ivm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                ivm.UserId = cUser.UserId;
                return Ok(await iRepo.Import(ivm));
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

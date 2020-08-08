using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMaintanance.Controllers;
using EMaintanance.Services;
using EMaintanance.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.RazorPages;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace EMaintanance.Areas.Identity.Pages.Account
{
    [AllowAnonymous]
    public class LogoutModel : PageModel
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly ILogger<LogoutModel> _logger;
        private readonly AuditLogService auditLogService;
        private IConfiguration _configuration;

        public LogoutModel(SignInManager<IdentityUser> signInManager, ILogger<LogoutModel> logger, IConfiguration configuration)
        {
            _configuration = configuration;
            auditLogService = new AuditLogService(HttpContext, configuration);
            _signInManager = signInManager;
            _logger = logger;
        }

        public void OnGet()
        {
            _signInManager.SignOutAsync();
            HttpContext.Session.Clear();
            _logger.LogInformation("User logged out.");
            //RedirectToAction(nameof(HomeController.Index), "Home");
            Redirect("/Identity/Account/Login");
        }

        public async Task<IActionResult> OnPost(string returnUrl = null)
        {
            await _signInManager.SignOutAsync();
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            _ = auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Logout", "User Logged Out.");
            HttpContext.Session.Clear();
            _logger.LogInformation("User logged out.");
            if (returnUrl != null)
            {
                //return LocalRedirect(returnUrl);
                return Redirect("/Identity/Account/Login");
            }
            else
            {
                return RedirectToAction(nameof(HomeController.Index), "Home");
            }
        }
    }
}
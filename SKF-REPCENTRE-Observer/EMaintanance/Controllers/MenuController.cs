using Dapper;
using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [Authorize]
    public class MenuController : Controller
    {
        private readonly Utility util;
        private IConfiguration _configuration;
        public MenuController(IConfiguration configuration)
        {
            _configuration = configuration;
            util = new Utility(configuration);
        }

        [HttpGet]
        public async Task<IActionResult> GetMenus(int LanguageId)
        {
            string sql = "dbo.EAppGetUserMenu";
            using (var conn = util.MasterCon())
            {
                try
                {
                    CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                    return Ok(await conn.QueryAsync<dynamic>(sql, new { LanguageId, cUser.UserId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Menus, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

    }
}

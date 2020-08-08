using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Dapper;
using EMaintanance.Models;
using EMaintanance.Services;
using EMaintananceApi.Utils;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using EMaintanance.Utils;

namespace EMaintanance.Controllers
{
    public class PageSetupController : Controller
    {
        private Utility con;
        private IConfiguration _configuration;
        public PageSetupController(IConfiguration configuration)
        {
            _configuration = configuration;
            con = new Utility(configuration);
        }

        [SKFAuthorize("PRG18:P1")]
        public IActionResult Index()
        {
            return View();
        }
                
        [HttpGet]
        [SKFAuthorize("PRG18:P1")]
        public IActionResult GetList()
        {
            string sql = "SELECT * FROM Cmssetup";

            using (var conn = con.MasterCon())
            {
                return Ok(conn.Query<dynamic>(sql));
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetContentById(int id)
        {
            string sql = "SELECT * FROM Cmssetup where [Cmsid] = " + id;

            using (var conn = con.MasterCon())
            {
                return Ok(conn.Query<Cmssetup>(sql).FirstOrDefault());
            }
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetContentByTypeCode(string typeCode)
        {
            string sql = $"SELECT * FROM Cmssetup where TypeCode = '{typeCode}'";

            using (var conn = con.MasterCon())
            {
                return Ok(conn.Query<Cmssetup>(sql).FirstOrDefault());
            }
        }

        [HttpPost]
        [SKFAuthorize("PRG18:P2")]
        public IActionResult Create([FromBody]Cmssetup contentModel)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                contentModel.CreatedBy = cUser.UserId;
                string insertQuery = @"INSERT INTO [dbo].[Cmssetup]([TypeCode]
                                      ,[TypeName]
                                      ,[Descriptions]
                                      ,[TypeText]
                                        ,[TypeOrder]
                                        ,[CreatedBy]) 
                                        VALUES 
                                        (@TypeCode, @TypeName, @Descriptions, @TypeText, @TypeOrder, @CreatedBy)";

                using (var conn = con.MasterCon())
                {
                    return Ok(conn.Execute(insertQuery, contentModel));
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        [HttpPost]
        [SKFAuthorize("PRG18:P3")]
        public IActionResult Update([FromBody]Cmssetup contentModel)
        {
            string updateQuery = @"UPDATE [dbo].[Cmssetup] SET 
                                    TypeCode = @TypeCode,
                                    TypeName = @TypeName, 
                                    Descriptions = @Descriptions, 
                                    TypeText = @TypeText,
                                    TypeOrder = @TypeOrder,
                                    Active = @Active 
                                    WHERE Cmsid = @Cmsid";

            using (var conn = con.MasterCon())
            {
                return Ok(conn.Execute(updateQuery, contentModel));
            }
        }
    }
}
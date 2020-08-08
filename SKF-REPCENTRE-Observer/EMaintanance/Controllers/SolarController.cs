using Dapper;
using EMaintanance.Services;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    public class SolarController : Controller
    {
        private readonly Utility con;
        private readonly IConfiguration _configuration;
        public SolarController(IConfiguration configuration)
        {
            _configuration = configuration;
            con = new Utility(configuration);
        }

        public IActionResult Create([FromBody]SolarDataViewModel solarData)
        {
            try
            {
                string insertQuery = @"INSERT INTO [dbo].[SolarData](
                    [SiteID]
                    ,[Length]
                    ,[RealTimeClock]
                    ,[ReadingType]
                    ,[ReadingValue]
                    ,[CreatedOn])
                    VALUES 
                    (@SiteID, @Length, @RealTimeClock, @ReadingType, @ReadingValue, @Createdon)";

                using (var conn = con.MasterCon())
                {
                    return Ok(conn.Execute(insertQuery, solarData));
                }

            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

    }
}

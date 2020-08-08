using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class PerformanceReportRepo
    {

        private readonly Utility util;
        public PerformanceReportRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetPerformanceReport(PerformanceReportViewModel prvm)
        {
            string sql = "dbo.EAppRptPerformance";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new {
                        prvm.ReportType,
                        prvm.ClientSiteId,
                        prvm.PlantAreaId,
                        prvm.LanguageId,
                        prvm.FromDate,
                        prvm.ToDate
                       
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }
    }
}

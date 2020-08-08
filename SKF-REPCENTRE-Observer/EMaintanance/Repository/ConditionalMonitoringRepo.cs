using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class ConditionalMonitoringRepo
    {
        private readonly Utility util;
        public ConditionalMonitoringRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

       
        public async Task<IEnumerable<dynamic>> GetConditionReportList(SearchConditionalMonitoringViewModel scmvm)
        {
            string sql = "dbo.EAppListEquipmentConditionReport";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { scmvm.ClientSiteId, scmvm.ReportFromDate, scmvm.ReportToDate, scmvm.ConditionCodeId, scmvm.LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

    }
}

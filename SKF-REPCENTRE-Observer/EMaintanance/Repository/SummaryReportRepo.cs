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
    public class SummaryReportRepo
    {
        private readonly Utility util;
        public SummaryReportRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }


        public async Task<IEnumerable<dynamic>> GetSummaryReportList(SearchSummaryReportViewModel ssrvm)
        {
            string sql = "dbo.EAppListJobSummaryReport";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { ssrvm.ClientSiteId, ssrvm.ReportFromDate, ssrvm.ReportToDate, ssrvm.LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetSummaryReportToExport(int JobId, int LanguageId)
        {
            string sql = "dbo.EAppRptExportJobDetail";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { JobId, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetSummaryReportDateRangeToExport(SearchSummaryReportViewModel ssrvm)
        {
            string sql = "dbo.EAppRptExportJobDetailByDateRange";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        ssrvm.ClientSiteId,
                        ssrvm.ReportFromDate,
                        ssrvm.ReportToDate,
                        ssrvm.LanguageId
                    }, commandType: CommandType.StoredProcedure));

                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Down Export to Excel Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

    }
}

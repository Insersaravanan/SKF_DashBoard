using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class AvoidPlannedMaintenanceRepo
    {

        private readonly Utility util;

        public AvoidPlannedMaintenanceRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetAvoidPlannedMaintenance(FailureReportSearchViewModel frsvm)
        {
            string sql = "dbo.EAppListFailureReport";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { frsvm.ReportType, frsvm.ClientSiteId, frsvm.FailureReportHeaderId, frsvm.LanguageId, frsvm.ReportFromDate, frsvm.ReportToDate }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate(FailureReportViewModel frvm)
        {
            string sql = "dbo.EAppSaveFailureReport";

            var FailureDetailJson = (frvm.FailureReportList != null ? JsonConvert.SerializeObject(frvm.FailureReportList) : null);
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        frvm.FailureReportHeaderId,
                        frvm.ReportType,
                        frvm.ClientsiteId,
                        frvm.EquipmentId,
                        frvm.ReportDate,
                        frvm.Active,
                        frvm.UserId,
                        FailureDetailJson,

                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }

        }


        public async Task<IEnumerable<dynamic>> SaveOrUpdateAttachments(string Type, int FailureReportHeaderId, int FailureReportAttachId, string FileName, string LogicalName, string PhysicalPath, string Active, int UserId)
        {
            string sql = "dbo.EAppSaveFailureReportAttachment";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        FailureReportAttachId,
                        FailureReportHeaderId,
                        FileName,
                        LogicalName,
                        PhysicalPath,
                        Active,
                        UserId
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

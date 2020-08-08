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
    public class LeverageRepo
    {
        private readonly Utility util;
        public LeverageRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetLeverage(DateTime? FromDate, DateTime? ToDate, int LanguageId)
        {
            string sql = "dbo.EAppListJobEquipmentLeverageService";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await conn.QueryAsync<dynamic>(sql, new { FromDate, ToDate, LanguageId }, commandType: CommandType.StoredProcedure);
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetLeverageServiceList(int JobEquipmentId, int LanguageId)
        {
            string sql = "dbo.EAppListLeverageService";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await conn.QueryAsync<dynamic>(sql, new { JobEquipmentId, LanguageId }, commandType: CommandType.StoredProcedure);
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<int> SaveOrUpdate(LeverageViewModel levm)
        {
            string sql = "dbo.EAppSaveLeverageServiceDetail";
            using (var conn = util.MasterCon())
            {
                try
                {
                    foreach (LeverageServices ls in levm.LeverageServices)
                    {
                        await (conn.QueryAsync<dynamic>(sql, new
                        {
                            ls.LeverageServiceId,
                            levm.JobEquipmentId,
                            ls.OpportunityTypeId,
                            ls.Descriptions,
                            levm.LSQuoteReference,
                            levm.LSQuoteAmount,
                            levm.LSQuoteStatusId,
                            levm.LSFileName,
                            levm.LSLogicalName,
                            levm.LSPhysicalPath,
                            levm.LSQuoteComment,
                            ls.Active,
                            levm.UserId
                        }, commandType: CommandType.StoredProcedure));
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
                return levm.JobEquipmentId;
            }
        }

        public async Task<IEnumerable<dynamic>> SaveLeverageImage(string Filename, string LogicalName, string PhysicalPath, int JobEquipmentId)
        {
            string sql = "update [dbo].[JobEquipment] set LSFileName = '" + Filename + "', LSLogicalName = '" + LogicalName + "', LSPhysicalPath = '" + PhysicalPath + "' where JobEquipmentId = " + JobEquipmentId;
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        //public async Task<IEnumerable<dynamic>> SaveOrUpdateAttachments(string Type, int LeverageExternalHeaderId, int LeverageExternalAttachId, string FileName, string LogicalName, string PhysicalPath, string Active, int UserId)
        //{
        //    string sql = "dbo.EAppSaveFailureReportAttachment";
        //    using (var conn = util.MasterCon())
        //    {
        //        try
        //        {
        //            return await (conn.QueryAsync<dynamic>(sql, new
        //            {
        //                LeverageExternalAttachId,
        //                LeverageExternalHeaderId,
        //                FileName,
        //                LogicalName,
        //                PhysicalPath,
        //                Active,
        //                UserId
        //            }, commandType: CommandType.StoredProcedure));
        //        }
        //        catch (Exception ex)
        //        {
        //            throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
        //        }
        //    }
        //}

        //public async Task<IEnumerable<dynamic>> GetAttachmentById(int LeverageExternalHeaderId, string Status)
        //{
        //    using (var conn = util.MasterCon())
        //    {
        //        try
        //        {
        //            string sql = "dbo.EAppListFailureReportAttachment";
        //            return await (conn.QueryAsync<dynamic>(sql, new { LeverageExternalHeaderId, Status }, commandType: CommandType.StoredProcedure));
        //        }
        //        catch (Exception ex)
        //        {
        //            throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
        //        }
        //    }
        //}
    }
}

using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class WorkNotificationRepo
    {
        private readonly Utility util;
        public WorkNotificationRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }


        public async Task<IEnumerable<dynamic>> GetWorkNotificationByStatus(WnSearchViewModel wsvm)
        {
            string sql = "dbo.EAppListWorkNotification";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { wsvm.ClientSiteId, wsvm.LanguageId, wsvm.FromDate, wsvm.ToDate, wsvm.StatusId}, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new Utils.CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetWNEquipUnitAnalysisByEqId(int ClientSiteId, int WNEquipmentId, int LanguageId)
        {
            string sql = "dbo.EAppListWorkNotificationUnit";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteId , WNEquipmentId, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new Utils.CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        //public async Task<IEnumerable<dynamic>> GetListWNEquipmentCommentById(int WNEquipmentId, string WorkNotifcationNumber, int LanguageId)
        //{
        //    string sql = "dbo.EAppListWNEquipmentSubmitComment";
        //    using (var conn = util.MasterCon())
        //    {
        //        try
        //        {
        //            return await (conn.QueryAsync<dynamic>(sql, new { WNEquipmentId, WorkNotifcationNumber, LanguageId }, commandType: CommandType.StoredProcedure));
        //        }
        //        catch (Exception ex)
        //        {
        //            throw new Utils.CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
        //        }
        //    }
        //}

        //public async Task<IEnumerable<dynamic>> GetListWNAttachmentsById(int WNEquipmentId, string Status)
        //{
        //    string sql = "dbo.EAppListWorkNotificationAttachments";
        //    using (var conn = util.MasterCon())
        //    {
        //        try
        //        {
        //            return await (conn.QueryAsync<dynamic>(sql, new { WNEquipmentId, Status }, commandType: CommandType.StoredProcedure));
        //        }
        //        catch (Exception ex)
        //        {
        //            throw new Utils.CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
        //        }
        //    }
        //}

        public async Task<IEnumerable<dynamic>> GetListWNEquipmentOpportunity(int WNJobEquipmentId, int LanguageId)
        {
            string sql = "dbo.EAppListWNEquipmentOpportunity";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { WNJobEquipmentId, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new Utils.CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetLoadWNListItem(string Type, int LanguageId, int SourceId, int ClientSiteId)
        {
            string sql = "dbo.EAppLoadWNListItem";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { Type, LanguageId, SourceId, ClientSiteId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new Utils.CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveWNUnitAnalysis(WorkNotificationUnitViewModel frvm)
        {
            string sql = "dbo.EAppSaveWorkNotificationUnitComplete";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        frvm.WNEquipmentId,
                        frvm.WNUnitAnalysisId,
                        frvm.ActualRepairCost,
                        frvm.ActualOutageHours,
                        frvm.UserId,
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> CancelWNUnitAnalysis(CancelWorkNotificationUnitViewModel cwnvm)
        {
            string sql = "dbo.EAppSaveWorkNotificationUnitCancel";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        cwnvm.WNEquipmentId,
                        cwnvm.WNUnitAnalysisId,
                        cwnvm.CancelRemarks
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveWNEquipmentOpportunity(WnEqOpportunityViewModel weovm)
        {
            string sql = "dbo.EAppSaveWNEquipmentOpportunity";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        weovm.WNOpportunityId,
                        weovm.WNEquipmentId,
                        //weovm.WorkNotificationNumber,
                        weovm.EquipmentId,
                        weovm.ActualOutageHours,
                        weovm.ActualRepairCost,
                        weovm.TrueSavings,
                        weovm.FailureModeId,
                        weovm.FailureCauseId,
                        //weovm.ActionDoneBy,
                        weovm.Active,
                        weovm.UserId,
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveWorkNoficationFeedBack(WnFeedbackViewModel wfvm)
        {
            string sql = "dbo.EAppSaveWorkNotificationComplete";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        wfvm.WNEquipmentId,
                        wfvm.WNCompletionDate,
                        wfvm.Feedback,
                        wfvm.RiAmperage,
                        wfvm.IsAccurate,
                        wfvm.UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetWorkNotificationOpenExportExcel(WnSearchViewModel ssrvm)
        {
            string sql = "dbo.EAppWorkNotificationExportDetail";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        ssrvm.ClientSiteId,
                        ssrvm.FromDate,
                        ssrvm.ToDate,
                        ssrvm.LanguageId,
                        ssrvm.StatusId
                    }, commandType: CommandType.StoredProcedure));

                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Down Export to Excel Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetWorkNotificationStatus(int LanguageId, int ClientSiteId)
        {
            string sql = "dbo.EAppListConditionCodeClientMappingSetup";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, ClientSiteId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }


        //public async Task<IEnumerable<dynamic>> SaveWNEquipmentAttachments(string Type, int TypeId, int AttachId, string FileName, string LogicalName, string PhysicalPath, string Active, int UserId)
        //{
        //    string sql = "dbo.EAppSaveWNEquipmentAttachments";
        //    using (var conn = util.MasterCon())
        //    {
        //        try
        //        {
        //            int WNEquipmentAttachId = AttachId;
        //            int WNEquipmentId = TypeId;
        //            return await (conn.QueryAsync<dynamic>(sql, new
        //            {
        //                WNEquipmentAttachId,
        //                WNEquipmentId,
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
    }
}

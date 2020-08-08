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
    public class ReportFeederRepo
    {

        private readonly Utility util;
        private readonly LookupsRepo lookupsRepo;
        private readonly EmailService emailService;
        private readonly UsersRepo userRepo;
        private readonly NotificationServiceHelper notificationServiceHelper;
        public ReportFeederRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
            lookupsRepo = new LookupsRepo(configuration);
            emailService = new EmailService(configuration);
            userRepo = new UsersRepo(configuration);
            notificationServiceHelper = new NotificationServiceHelper(configuration);
        }

        /** This method is used to Load Job Comments */
        public async Task<IEnumerable<dynamic>> GetJobCommentsById(int JobId, int LanguageId)
        {
            string sql = "dbo.EAppListJobComment";
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

        /** This method is used to Load Equipment Comments */
        public async Task<IEnumerable<dynamic>> GetEquipmentCommentsById(int JobEquipmentId, int LanguageId)
        {
            string sql = "dbo.EAppListJobEquipmentComment";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { JobEquipmentId, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetJobEquipUnitUnselected(int JobEquipmentId, int LanguageId)
        {
            string sql = "dbo.EAppListJobEquipUnitUnselected";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { JobEquipmentId, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        /** This method is used to Load Equipment Unit Comments */
        public async Task<IEnumerable<dynamic>> GetEquipUnitCommentsById(int UnitAnalysisId, int LanguageId)
        {
            string sql = "dbo.EAppListJobEquipmentUnitAnalysisComment";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { UnitAnalysisId, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        /** This method is used to Load Status based on Roles */
        public async Task<IEnumerable<dynamic>> GetStatusByRoleId(string Type, int UserId, int CurrentStatusId, int LanguageId)
        {
            string sql = "dbo.EAppLoadJobStatusListItem";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { Type, UserId, CurrentStatusId, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        /** This method is used to Load Status based on Roles */
        public async Task<IEnumerable<dynamic>> GetStatusEqByRoleId(int UserId, int JobEquipmentId, int LanguageId)
        {
            string sql = "dbo.EAppLoadJobEquipStatusListItem";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { UserId, JobEquipmentId, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        /** This method is used to Save Job Comments */
        public async Task<IEnumerable<dynamic>> SaveJobComments(JobStatusCommentsViewModel jscvm)
        {
            string sql = "dbo.EAppSaveJobComment";
            using (var conn = util.MasterCon())

            {
                try
                {

                    DynamicParameters _params = new DynamicParameters();
                    _params.Add("@JobCommentId", jscvm.CommentId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@JobId", jscvm.TypeId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@StatusId", jscvm.StatusId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@DatacollectionDone", jscvm.DatacollectionDone, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@ReportSent", jscvm.ReportSent, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@Comments", jscvm.Comments, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@DataCollectionDate", jscvm.DataCollectionDate, DbType.Date, direction: ParameterDirection.Input);
                    _params.Add("@ReportDate", jscvm.ReportDate, DbType.Date, direction: ParameterDirection.Input);
                    _params.Add("@Active", jscvm.Active, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@UserId", jscvm.UserId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@ReviewerId", jscvm.ReviewerId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@Result", null, DbType.String, direction: ParameterDirection.Output, size: 4000);
                    _params.Add("@ResultText", null, DbType.String, direction: ParameterDirection.Output, size: 4000);
                    _params.Add("@IsWarningAccepted ", jscvm.IsWarningAccepted, DbType.Int32, direction: ParameterDirection.Input);

                    var returnValue = await (conn.QueryAsync<dynamic>(sql, _params, commandType: CommandType.StoredProcedure));

                    string result = _params.Get<string>("Result");
                    string resultText = _params.Get<string>("ResultText");

                    if (result == "F")
                    {
                        throw new CustomException(resultText, "Error", true, resultText);
                    }
                    else if (result == "W")
                    {
                        throw new CustomException(resultText, "Confirmation", true, resultText);
                    }

                    /** Notify EMail to Analyst */
                    if (jscvm.DatacollectionDone == 1)
                    {
                        try
                        {
                            await Task.Factory.StartNew(async () =>
                            {
                                //string Type = "Notify_Analyst";
                                //int ClientSiteId = 0;
                                //int LanguageId = 1;
                                //int Id = (int)jscvm.TypeId;
                                //int UserId = jscvm.UserId;
                                //String evmStr = (String)await conn.QueryFirstAsync<String>("dbo.EAppGetNotification", new { Type, ClientSiteId, LanguageId, Id, UserId }, commandType: CommandType.StoredProcedure);

                                String evmStr = await emailService.GetEmailNotificationTemplate("Notify_Analyst", 0, 1, (int)jscvm.TypeId, jscvm.UserId);
                                EmailViewModel evm = JsonConvert.DeserializeObject<EmailViewModel>(evmStr);
                                await notificationServiceHelper.PrepareCalendarNotification(evm);
                            });
                        }
                        catch (Exception ex)
                        {
                            // Notification exception.
                            var e = ex;
                        }
                    }

                    int x = await lookupsRepo.GetLookupByNameNCode("SU", "JobProcessStatus");
                    if (jscvm.StatusId == x && jscvm.ReviewerId != null && jscvm.ReviewerId > 0)
                    {
                        if (jscvm.StatusId != jscvm.OldStatusId)
                        {

                            /** Notify EMail to Reviewer */
                            try
                            {
                                await Task.Factory.StartNew(async () =>
                                {
                                    String evmStr = await emailService.GetEmailNotificationTemplate("Notify_Reviewer", 0, 1, (int)jscvm.TypeId, jscvm.UserId);
                                    EmailViewModel evm = JsonConvert.DeserializeObject<EmailViewModel>(evmStr);
                                    await notificationServiceHelper.PrepareCalendarNotification(evm);
                                });
                            }
                            catch (Exception ex)
                            {
                                // Notification exception.
                            }
                        }
                    }

                    x = await lookupsRepo.GetLookupByNameNCode("C", "JobProcessStatus");
                    if (jscvm.StatusId == x && jscvm.StatusId != jscvm.OldStatusId)
                    {
                        /** Notify EMail to Reviewer */
                        try
                        {
                            await Task.Factory.StartNew(async () =>
                            {
                                String evmStr = await emailService.GetEmailNotificationTemplate("Notify_Planner", 0, 1, (int)jscvm.TypeId, jscvm.UserId);
                                EmailViewModel evm = JsonConvert.DeserializeObject<EmailViewModel>(evmStr);
                                await notificationServiceHelper.PrepareCalendarNotification(evm);
                            });
                        }
                        catch (Exception ex)
                        {
                            // Notification exception.
                        }
                    }
                    return returnValue;
                }
                catch (CustomException cex)
                {
                    throw new CustomException(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        /** This method is used to Save Equipment Comments */
        public async Task<IEnumerable<dynamic>> SaveEquipmentComments(JobStatusCommentsViewModel jscvm)
        {
            string sql = "dbo.EAppSaveJobEquipmentComment";
            using (var conn = util.MasterCon())
            {
                try
                {

                    DynamicParameters _params = new DynamicParameters();
                    _params.Add("@JobEquipCommentId", jscvm.CommentId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@JobEquipmentId", jscvm.TypeId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@StatusId", jscvm.StatusId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@DataCollectionDate", jscvm.DataCollectionDate, DbType.Date, direction: ParameterDirection.Input);
                    _params.Add("@ReportDate", jscvm.ReportDate, DbType.Date, direction: ParameterDirection.Input);
                    _params.Add("@Comments", jscvm.Comments, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@ConditionId", jscvm.ConditionId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@EquipmentComment", jscvm.EquipmentComment, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@Active", jscvm.Active, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@UserId", jscvm.UserId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@Result", null, DbType.String, direction: ParameterDirection.Output, size: 4000);
                    _params.Add("@ResultText", null, DbType.String, direction: ParameterDirection.Output, size: 4000);
                    _params.Add("@IsWarningAccepted ", jscvm.IsWarningAccepted, DbType.Int32, direction: ParameterDirection.Input);

                    var returnValue = await (conn.QueryAsync<dynamic>(sql, _params, commandType: CommandType.StoredProcedure));

                    string result = _params.Get<string>("Result");
                    string resultText = _params.Get<string>("ResultText");

                    if (result == "F")
                    {
                        throw new CustomException(resultText, "Error", true, resultText);
                    }
                    else if (result == "W")
                    {
                        throw new CustomException(resultText, "Confirmation", true, resultText);
                    }

                    return returnValue;
                }
                catch (CustomException cex)
                {
                    throw new CustomException(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        /** This method is used to Save UnitAnalysisComments */
        public async Task<IEnumerable<dynamic>> SaveUnitAnalysisComments(JobStatusCommentsViewModel jscvm)
        {
            string sql = "dbo.EAppSaveJobEquipUnitAnalysisComments";
            using (var conn = util.MasterCon())
            {
                try
                {
                    DynamicParameters _params = new DynamicParameters();
                    _params.Add("@Result", null, DbType.String, direction: ParameterDirection.Output, size: 4000);
                    _params.Add("@ResultText", null, DbType.String, direction: ParameterDirection.Output, size: 4000);
                    _params.Add("@UnitAnalysisId", jscvm.TypeId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@JobEquipmentId", jscvm.JobEquipmentId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@ServiceId", jscvm.ServiceId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@UnitType", jscvm.UnitType, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@UnitId", jscvm.UnitId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@StatusId", jscvm.StatusId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@Comments", jscvm.Comments, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@Active", jscvm.Active, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@UserId", jscvm.UserId, DbType.Int32, direction: ParameterDirection.Input);

                    var returnValue = await (conn.QueryAsync<dynamic>(sql, _params, commandType: CommandType.StoredProcedure));

                    string result = _params.Get<string>("Result");
                    string resultText = _params.Get<string>("ResultText");

                    if (result == "F")
                    {
                        throw new CustomException(resultText, "Error", true, resultText);
                    }

                    return returnValue;
                }
                catch (CustomException cex)
                {
                    throw new CustomException(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        /** This method is used to Load Equipments based on Jobs */
        public async Task<IEnumerable<dynamic>> GetEquipmentsByJobId(int JobId, int LanguageId, int StatusId, int ServiceId, int UserId)
        {
            string sql = "dbo.EAppListJobEquipment";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { JobId, ServiceId, LanguageId, StatusId, UserId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        /** This method is used to Load Units based on Equipment */
        public async Task<IEnumerable<dynamic>> GetUnitsByEquipmentId(int JobEquipmentId, int LanguageId, int StatusId)
        {
            using (var conn = util.MasterCon())
            {
                try
                {
                    string sql = "dbo.EAppListJobEquipUnitAnalysis";
                    return await (conn.QueryAsync<dynamic>(sql, new { JobEquipmentId, LanguageId, StatusId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        /** This method is used to Load Units based on Equipment */
        public async Task<IEnumerable<dynamic>> GetOilPropertiesByEquipmentId(int JobEquipmentId, int LanguageId)
        {
            using (var conn = util.MasterCon())
            {
                try
                {
                    string sql = "dbo.EAppListJobEquipmentOilProperties";
                    return await (conn.QueryAsync<dynamic>(sql, new { JobEquipmentId, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        /** This method is used to Load Symptoms based on Unit */
        public async Task<IEnumerable<dynamic>> GetSymptomsByUnitAnalysis(string UnitType, string ServiceType, int LanguageId)
        {
            using (var conn = util.MasterCon())
            {
                try
                {
                    string sql = "dbo.EAppGetUnitSymptomsTemplate";
                    return await (conn.QueryAsync<dynamic>(sql, new { UnitType, ServiceType, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        /** This method is used to Load Units based on UnitAnalysisId */
        public async Task<JobUnitAnalysisViewModel> GetUnitAnalysisById(int UnitAnalysisId, string UnitType, string ServiceType, int LanguageId)
        {
            using (var conn = util.MasterCon())
            {
                try
                {
                    string sql = "dbo.EAppListJobUnitAnalysis";
                    return await (conn.QueryFirstAsync<JobUnitAnalysisViewModel>(sql, new { UnitAnalysisId, UnitType, ServiceType, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        /** This method is used to Load Units based on Equipment */
        public async Task<IEnumerable<dynamic>> GetAttachmentByUnitAnalysisId(int UnitAnalysisId, string Status)
        {
            using (var conn = util.MasterCon())
            {
                try
                {
                    string sql = "dbo.EAppListJobUnitAnalysisAttachments";
                    return await (conn.QueryAsync<dynamic>(sql, new { UnitAnalysisId, Status }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        /** This method is used to Save or Update UnitAnalysis */
        public async Task<IEnumerable<dynamic>> SaveOrUpdate(JobUnitAnalysisViewModel juavm)
        {
            string sql = "dbo.EAppSaveJobUnitAnalysis";
            using (var conn = util.MasterCon())
            {
                try
                {
                    string UnitSymptomsJson = null;
                    string UnitAmplitudeJson = null;
                    if (juavm.JobUnitSymptomsList != null && juavm.JobUnitSymptomsList.Count > 0)
                    {
                        string Header = "{\"JobUnitSymptomsList\": ";
                        string Footer = "}";
                        UnitSymptomsJson = Header + JsonConvert.SerializeObject(juavm.JobUnitSymptomsList) + Footer;
                    }

                    if (juavm.JobUnitAmplitudeList != null && juavm.JobUnitAmplitudeList.Count > 0)
                    {
                        string Header = "{\"JobUnitAmplitudeList\": ";
                        string Footer = "}";
                        UnitAmplitudeJson = Header + JsonConvert.SerializeObject(juavm.JobUnitAmplitudeList) + Footer;
                    }

                    DynamicParameters _params = new DynamicParameters();
                    _params.Add("@Result", null, DbType.String, direction: ParameterDirection.Output, size: 4000);
                    _params.Add("@ResultText", null, DbType.String, direction: ParameterDirection.Output, size: 4000);
                    _params.Add("@UnitAnalysisId", juavm.UnitAnalysisId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@JobEquipmentId", juavm.JobEquipmentId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@ServiceId", juavm.ServiceId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@UnitType", juavm.UnitType, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@UnitId", juavm.UnitId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@ConditionId", juavm.ConditionId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@ConfidentFactorId", juavm.ConfidentFactorId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@FailureProbFactorId", juavm.FailureProbFactorId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@PriorityId", juavm.PriorityId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@IsWorkNotification", juavm.IsWorkNotification, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@IsEC", juavm.IsEC, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@NoOfDays", juavm.NoOfDays, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@Recommendation", juavm.Recommendation, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@Comment", juavm.Comment, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@UnitSymptomsJson", UnitSymptomsJson, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@UnitAmplitudeJson", UnitAmplitudeJson, DbType.String, direction: ParameterDirection.Input);
                    _params.Add("@StatusId", juavm.StatusId, DbType.Int32, direction: ParameterDirection.Input);
                    _params.Add("@UserId", juavm.UserId, DbType.Int32, direction: ParameterDirection.Input);

                    var returnValue = await (conn.QueryAsync<dynamic>(sql, _params, commandType: CommandType.StoredProcedure));

                    string result = _params.Get<string>("Result");
                    string resultText = _params.Get<string>("ResultText");

                    if (result == "F")
                    {
                        throw new CustomException(resultText, "Error", true, resultText);
                    }

                    return returnValue;
                }
                catch (CustomException cex)
                {
                    throw new CustomException(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveJobEquipUnitSelected(JobEquipUnitSelectedViewModel jeusvm)
        {
            string sql = "dbo.EAppSaveJobEquipUnitSelected";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        jeusvm.JobEquipmentId,
                        jeusvm.ServiceId,
                        jeusvm.UnitType,
                        jeusvm.UnitId,
                        jeusvm.StatusId,
                        jeusvm.UserId,
                        jeusvm.languageId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdateAttachments(string Type, int TypeId, int AttachId, string FileName, string LogicalName, string PhysicalPath, string Active, int UserId)
        {
            string sql = "dbo.EAppSaveJobUnitAnalysisAttachments";
            using (var conn = util.MasterCon())
            {
                try
                {
                    int UnitAnalysisAttachId = AttachId;
                    int UnitAnalysisId = TypeId;
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        UnitAnalysisAttachId,
                        UnitAnalysisId,
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

        public async Task<IEnumerable<dynamic>> SaveorUpdateOilProperties(JobEquipOilPropertiesViewModel jeopvm)
        {
            string sql = "dbo.EAppSaveJobEquipmentOilProperties";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        jeopvm.JobEquipOilPropertiesId,
                        jeopvm.JobEquipmentId,
                        jeopvm.OilPropertiesId,
                        jeopvm.OilLevel,
                        jeopvm.SeverityId,
                        jeopvm.OAVibChangePercentageId,
                        jeopvm.Active,
                        jeopvm.UserId
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

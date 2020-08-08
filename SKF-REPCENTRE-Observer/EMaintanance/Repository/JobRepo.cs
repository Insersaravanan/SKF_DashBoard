using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class JobRepo
    {

        private readonly Utility util;
        private readonly NotificationServiceHelper notificationServiceHelper;
        private readonly EmailService emailService;
        public JobRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
            notificationServiceHelper = new NotificationServiceHelper(configuration);
            emailService = new EmailService(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetJobByStatus(int ClientSiteId, int JobId, int ScheduleSetupId, int LanguageId, int StatusId, DateTime FromDate, DateTime? ToDate, int? JobNumber)
        {
            string sql = "dbo.EAppListJobs";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteId, JobId, ScheduleSetupId, LanguageId, StatusId, FromDate, ToDate, JobNumber }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetUserJobStatusColour(int JobId)
        {
            string sql = "dbo.EAppGetUserJobStatusColour";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { JobId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetEquipmentByJobId(int ClientSiteId, int JobId, int LanguageId)
        {
            string sql = "dbo.EAppListJobEquipmentSelected";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteId, JobId, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }


        public async Task<IEnumerable<dynamic>> GetJobEquipmentAssignUser(int JobId, int LanguageId)
        {
            string sql = "dbo.EAppListJobEquipmentAssignUser";
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

        public async Task<IEnumerable<dynamic>> GetAllAssignedJobs(int ClientSiteId, int UserId, int JobId, int ScheduleSetupId, int LanguageId, int StatusId, DateTime FromDate, DateTime? ToDate, int? JobNumber)
        {
            string sql = "dbo.EAppListJobDiagnosis";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteId, UserId, JobId, ScheduleSetupId, LanguageId, StatusId, FromDate, ToDate, JobNumber }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }


        public async Task<IEnumerable<dynamic>> SaveAssignUser(AssignUsersViewModel auvm)
        {
            string sql = "dbo.EAppSaveAssignUser";
            using (var conn = util.MasterCon())
            {
                try
                {
                    var returnValue = await (conn.QueryAsync<dynamic>(sql, new { auvm.Type, auvm.Id, auvm.DataCollectionMode, auvm.DataCollectorId, auvm.AnalystId, auvm.ReviewerId }, commandType: CommandType.StoredProcedure));

                    if (auvm.DataCollectionMode == 0)
                    {
                        /** Notify EMail to Data Collector */
                        try
                        {
                            await Task.Factory.StartNew(async () =>
                            {
                                String evmStr = await emailService.GetEmailNotificationTemplate("Notify_DataCollector", 0, 1, (int)auvm.Id, auvm.UserId);

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


                    return returnValue;
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate(JobViewModel jvm)
        {
            string sql = "dbo.EAppSaveJob";
            using (var conn = util.MasterCon())
            {
                try
                {
                    string JobEquipmentsJson = null;
                    string JobServicesJson = null;

                    if (jvm.JobEquipments != null && jvm.JobEquipments.Count > 0)
                    {
                        string Header = "{\"JobEquipments\": ";
                        string Footer = "}";
                        JobEquipmentsJson = Header + JsonConvert.SerializeObject(jvm.JobEquipments) + Footer;
                    }

                    if (jvm.JobServices != null && jvm.JobServices.Count > 0)
                    {
                        string Header = "{\"JobServices\": ";
                        string Footer = "}";
                        JobServicesJson = Header + JsonConvert.SerializeObject(jvm.JobServices) + Footer;
                    }

                    jvm.AnalystId = jvm.AnalystId == 0 ? null : jvm.AnalystId;

                    var returnValue = await (conn.QueryAsync<dynamic>(sql, new
                    {
                        jvm.JobId,
                        jvm.ScheduleSetupId,
                        jvm.ClientSiteId,
                        jvm.JobName,
                        jvm.EstStartDate,
                        jvm.EstEndDate,
                        jvm.AnalystId,
                        JobEquipmentsJson,
                        JobServicesJson,
                        jvm.StatusId,
                        jvm.UserId,
                        //jvm.ProgramTypeId
                    }, commandType: CommandType.StoredProcedure));

                    return returnValue;
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Job Name already Exists.", "Error", true, sqlException);
                    }
                    else
                    {
                        throw new CustomException("Due to some Technical Reason, Unable to Save or Update", "Error", true, sqlException);
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

    }
}

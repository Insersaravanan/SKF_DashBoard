using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace EMaintanance.Repository
{
    public class EmailConfigurationRepo
    {
        private readonly Utility util;
        public EmailConfigurationRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }
        
        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] EmailConfigurationViewModel emvm)
        {
            string sql = "dbo.EAppSaveCountry";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        emvm.GroupName,
                        emvm.EmailList,
                        emvm.MobileNoList,
                        emvm.Active,
                        emvm.AlarmInterval,
                        emvm.MinutesCount,
                        emvm.CreatedBy,
                        emvm.CreatedOn
                   
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Country Code already Exists.", "Error", true, sqlException);
                    }
                    else
                    {
                        throw new CustomException("Due to some Technical Reason, Unable to Save or Update", "Error", true, sqlException);
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetAlarmEmailNotificationByStatus(int ClientSiteId, int AlarmEmailNotificationSetupId, int LanguageId, int StatusId, string mode)
        {
            string sql = "dbo.OAppListAlarmEmailNotificationSetup";
            using (var conn = util.MasterCon())
            {
                try
                {
                    if (mode != null && mode == "GenerateJob")
                    {
                        return await (conn.QueryAsync<AlarmEmailNotificationEntityModel>(sql, new { ClientSiteId, AlarmEmailNotificationSetupId, LanguageId, StatusId }, commandType: CommandType.StoredProcedure));
                    }
                    else
                    {
                        return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteId, AlarmEmailNotificationSetupId, LanguageId, StatusId }, commandType: CommandType.StoredProcedure));
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetEquipmentByAlarmEmailNotificationId(int ClientSiteId, int AlarmEmailNotificationSetupId, int LanguageId, string mode)
        {
            string sql = "dbo.OAppListAlarmEmailNotificationSetupEquipment";
            using (var conn = util.MasterCon())
            {
                try
                {
                    if (mode != null && mode == "GenerateJob")
                    {
                        return await (conn.QueryAsync<AlarmEmailNotificationEntityModel>(sql, new { ClientSiteId, AlarmEmailNotificationSetupId, LanguageId }, commandType: CommandType.StoredProcedure));
                    }
                    else
                    {
                        return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteId, AlarmEmailNotificationSetupId, LanguageId }, commandType: CommandType.StoredProcedure));
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

    }
}

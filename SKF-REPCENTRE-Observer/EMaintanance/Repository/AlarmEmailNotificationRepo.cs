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
    public class AlarmEmailNotificationRepo
    {
        private readonly Utility util;
        public AlarmEmailNotificationRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
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
            string sql = "dbo.EAppListAlarmEmailNotificationSetupEquipment";
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

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] AlarmEmailNotificationViewModel sv)
        {
            string sql = "dbo.OAppSaveAlarmEmailNotificationSetup";
            using (var conn = util.MasterCon())
            {
                try
                {
                    string AlarmEmailNotificationEquipmentsJson = null;
                    // string AlarmEmailNotificationServicesJson = null;
                    if (sv.AlarmEmailNotificationEquipments != null && sv.AlarmEmailNotificationEquipments.Count > 0)
                    {
                        string Header = "{\"AlarmEmailNotificationEquipments\": ";
                        string Footer = "}";
                        AlarmEmailNotificationEquipmentsJson = Header + JsonConvert.SerializeObject(sv.AlarmEmailNotificationEquipments) + Footer;
                    }

                    //if (sv.AlarmEmailNotificationServices != null && sv.AlarmEmailNotificationServices.Count > 0)
                    //{
                    //    string Header = "{\"AlarmEmailNotificationServices\": ";
                    //    string Footer = "}";
                    //    AlarmEmailNotificationServicesJson = Header + JsonConvert.SerializeObject(sv.AlarmEmailNotificationServices) + Footer;
                    //}

                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        sv.AlarmEmailNotificationSetupId,
                        sv.ClientSiteId,
                        sv.AlarmEmailNotificationID,
                        sv.AlarmSMSNotificationNo,
                        sv.IntervalDays,
                        sv.AdditionalEmailID,
                        sv.AdditionalMobileNo,
                        AlarmEmailNotificationEquipmentsJson,
                       // AlarmEmailNotificationServicesJson,
                        sv.StatusId,
                        sv.UserId,
                        //sv.ProgramTypeId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "AlarmEmailNotification Name already Exists.", "Error", true, sqlException);
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

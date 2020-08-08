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
using Newtonsoft.Json;

namespace EMaintanance.Repository
{
    public class SMSConfigurationRepo
    {
        private readonly Utility util;
        public SMSConfigurationRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }
        
        //public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] SMSConfigurationViewModel emvm)
        //{
        //    string sql = "dbo.EAppSaveCountry";
        //    using (var conn = util.MasterCon())
        //    {
        //        try
        //        {
        //            return await (conn.QueryAsync<dynamic>(sql, new
        //            {
        //                emvm.GroupName,
        //                emvm.EmailList,
        //                emvm.MobileNoList,
        //                emvm.Active,
        //                emvm.AlarmInterval,
        //                emvm.MinutesCount,
        //                emvm.CreatedBy,
        //                emvm.CreatedOn
                   
        //            }, commandType: CommandType.StoredProcedure));
        //        }
        //        catch (SqlException sqlException)
        //        {
        //            if (sqlException.Number == 2601 || sqlException.Number == 2627)
        //            {
        //                throw new CustomException("Duplicate", "Country Code already Exists.", "Error", true, sqlException);
        //            }
        //            else
        //            {
        //                throw new CustomException("Due to some Technical Reason, Unable to Save or Update", "Error", true, sqlException);
        //            }
        //        }
        //        catch (Exception ex)
        //        {
        //            throw new CustomException("Unable to Save or Update, Please Contact Support!!!", "Error", true, ex);
        //        }
        //    }
        //}

        public async Task<IEnumerable<dynamic>> GetAlarmSMSNotificationByStatus(int ClientSiteId, int AlarmSMSNotificationSetupId, int LanguageId, int StatusId, string mode)
        {
            string sql = "dbo.OAppListAlarmSMSNotificationSetup";
            using (var conn = util.MasterCon())
            {
                try
                {
                    if (mode != null && mode == "GenerateJob")
                    {
                        return await (conn.QueryAsync<AlarmSMSNotificationEntityModel>(sql, new { ClientSiteId, AlarmSMSNotificationSetupId, LanguageId, StatusId }, commandType: CommandType.StoredProcedure));
                    }
                    else
                    {
                        return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteId, AlarmSMSNotificationSetupId, LanguageId, StatusId }, commandType: CommandType.StoredProcedure));
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetEquipmentByAlarmSMSNotificationId(int ClientSiteId, int AlarmSMSNotificationSetupId, int LanguageId, string mode)
        {
            string sql = "dbo.EAppListAlarmSMSNotificationSetupEquipment";
            using (var conn = util.MasterCon())
            {
                try
                {
                    if (mode != null && mode == "GenerateJob")
                    {
                        return await (conn.QueryAsync<AlarmSMSNotificationEntityModel>(sql, new { ClientSiteId, AlarmSMSNotificationSetupId, LanguageId }, commandType: CommandType.StoredProcedure));
                    }
                    else
                    {
                        return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteId, AlarmSMSNotificationSetupId, LanguageId }, commandType: CommandType.StoredProcedure));
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] SMSConfigurationViewModel sv)
        {
            string sql = "dbo.EAppSaveAlarmSMSNotificationSetup";
            using (var conn = util.MasterCon())
            {
                try
                {
                    string AlarmSMSNotificationEquipmentsJson = null;
                    // string AlarmSMSNotificationServicesJson = null;
                    if (sv.AlarmSMSNotificationEquipments != null && sv.AlarmSMSNotificationEquipments.Count > 0)
                    {
                        string Header = "{\"AlarmSMSNotificationEquipments\": ";
                        string Footer = "}";
                        AlarmSMSNotificationEquipmentsJson = Header + JsonConvert.SerializeObject(sv.AlarmSMSNotificationEquipments) + Footer;
                    }

                    //if (sv.AlarmSMSNotificationServices != null && sv.AlarmSMSNotificationServices.Count > 0)
                    //{
                    //    string Header = "{\"AlarmSMSNotificationServices\": ";
                    //    string Footer = "}";
                    //    AlarmSMSNotificationServicesJson = Header + JsonConvert.SerializeObject(sv.AlarmSMSNotificationServices) + Footer;
                    //}

                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        sv.AlarmSMSNotificationSetupId,
                        sv.ClientSiteId,
                        sv.AlarmSMSNotificationID,
                        sv.IntervalDays,
                        sv.AdditionalSMSID,
                        AlarmSMSNotificationEquipmentsJson,
                        // AlarmSMSNotificationServicesJson,
                        sv.StatusId,
                        sv.UserId,
                        //sv.ProgramTypeId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "AlarmSMSNotification Name already Exists.", "Error", true, sqlException);
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

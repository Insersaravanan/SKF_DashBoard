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
    public class ScheduleRepo
    {
        private readonly Utility util;
        public ScheduleRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetScheduleByStatus(int ClientSiteId, int ScheduleSetupId, int LanguageId, int StatusId, string mode)
        {
            string sql = "dbo.EAppListScheduleSetup";
            using (var conn = util.MasterCon())
            {
                try
                {
                    if (mode != null && mode == "GenerateJob")
                    {
                        return await (conn.QueryAsync<ScheduleEntityModel>(sql, new { ClientSiteId, ScheduleSetupId, LanguageId, StatusId }, commandType: CommandType.StoredProcedure));
                    }
                    else
                    {
                        return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteId, ScheduleSetupId, LanguageId, StatusId }, commandType: CommandType.StoredProcedure));
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetEquipmentByScheduleId(int ClientSiteId, int ScheduleSetupId, int LanguageId, string mode)
        {
            string sql = "dbo.EAppListScheduleSetupEquipment";
            using (var conn = util.MasterCon())
            {
                try
                {
                    if (mode != null && mode == "GenerateJob")
                    {
                        return await (conn.QueryAsync<ScheduleEntityModel>(sql, new { ClientSiteId, ScheduleSetupId, LanguageId }, commandType: CommandType.StoredProcedure));
                    }
                    else
                    {
                        return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteId, ScheduleSetupId, LanguageId }, commandType: CommandType.StoredProcedure));
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] ScheduleSetupViewModel sv)
        {
            string sql = "dbo.EAppSaveScheduleSetup";
            using (var conn = util.MasterCon())
            {
                try
                {
                    string ScheduleEquipmentsJson = null;
                    string ScheduleServicesJson = null;
                    if (sv.ScheduleEquipments != null && sv.ScheduleEquipments.Count > 0)
                    {
                        string Header = "{\"ScheduleEquipments\": ";
                        string Footer = "}";
                        ScheduleEquipmentsJson = Header + JsonConvert.SerializeObject(sv.ScheduleEquipments) + Footer;
                    }

                    if (sv.ScheduleServices != null && sv.ScheduleServices.Count > 0)
                    {
                        string Header = "{\"ScheduleServices\": ";
                        string Footer = "}";
                        ScheduleServicesJson = Header + JsonConvert.SerializeObject(sv.ScheduleServices) + Footer;
                    }

                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        sv.ScheduleSetupId,
                        sv.ClientSiteId,
                        sv.ScheduleName,
                        sv.StartDate,
                        sv.EndDate,
                        sv.IntervalDays,
                        sv.EstJobDays,
                        ScheduleEquipmentsJson,
                        ScheduleServicesJson,
                        sv.StatusId,
                        sv.UserId,
                        //sv.ProgramTypeId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Schedule Name already Exists.", "Error", true, sqlException);
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

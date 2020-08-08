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
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class ApplicationConfigurationRepo
    {
        private readonly Utility util;
        public ApplicationConfigurationRepo(IConfiguration iconfiguration)
        {
            util = new Utility(iconfiguration);
        }

        public async Task<IEnumerable<dynamic>> GetApplicationConfigurationByStatus(int acId, string Status)
        {
            string sql = "dbo.EAppListApplicationConfiguration";
            string AppConfigName = null;
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { Status, AppConfigName }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<ApplicationConfigurationViewModel> GetAppConfigByName(string AppConfigName, string Status)
        {
            string sql = "dbo.EAppListApplicationConfiguration";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await conn.QueryFirstOrDefaultAsync<ApplicationConfigurationViewModel>(sql, new { Status, AppConfigName }, commandType: CommandType.StoredProcedure);
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public ApplicationConfigurationViewModel GetAppConfigByNameNonAsync(string AppConfigName, string Status)
        {
            string sql = "dbo.EAppListApplicationConfiguration";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return conn.QueryFirstOrDefault<ApplicationConfigurationViewModel>(sql, new { Status, AppConfigName }, commandType: CommandType.StoredProcedure);
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] ApplicationConfigurationViewModel ccv)
        {
            string sql = "dbo.EAppSaveAppConfiguration";
            using (var conn = util.MasterCon())
            {
                try
                {

                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        ccv.AppConfigId,
                        ccv.AppConfigName,
                        ccv.AppConfigCode,
                        ccv.AppConfigValue,
                        ccv.Descriptions,
                        ccv.Active,
                        ccv.UserId,
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "AppConfiguration Code already Exists.", "Error", true, sqlException);
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

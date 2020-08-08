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
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class ConditionCodeMappingRepo
    {
        private readonly Utility util;
        public ConditionCodeMappingRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetConditionCodeMapping(int LanguageId, int ClientSiteId)
        {
            string sql = "dbo.EAppListConditionCodeClientMapping";
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

        public async Task<IEnumerable<dynamic>> GetConditionCodeSetup(int LanguageId, int ClientSiteId)
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

        public async Task<IEnumerable<dynamic>> GetTransConditionCodeMapping(int CMappingId)
        {
            string sql = "dbo.EAppListConditionCodeClientMappingTranslated";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { CMappingId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] ConditionCodeMapViewModel ccmvm)
        {
            string sql = "dbo.EAppSaveConditionCodeClientMapping";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        ccmvm.CMappingId,
                        ccmvm.ClientSiteId,
                        ccmvm.ConditionId,
                        ccmvm.LanguageId,
                        ccmvm.ConditionName,
                        ccmvm.Descriptions,
                        ccmvm.UserId,
                        ccmvm.Active
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Client Condition Name already Exists.", "Error", true, sqlException);
                    }
                    else if (sqlException.Number == 515)
                    {
                        throw new CustomException("Mandatory", "Client Condition Name is Mandatory.", "Error", true, sqlException);
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

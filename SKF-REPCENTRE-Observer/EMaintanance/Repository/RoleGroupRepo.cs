using Dapper;
using EMaintanance.Models;
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
    public class RolesGroupRepo
    {

        private readonly Utility util;
        public RolesGroupRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetRoleGroupByStatus(int LanguageId, string status)
        {
            string sql = "dbo.EAppListRoleGroup";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await conn.QueryAsync<dynamic>(sql, new { LanguageId, status }, commandType: CommandType.StoredProcedure);
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetTransRoleGroup(int RoleGroupId)
        {
            string sql = "dbo.EAppListRoleGroupTranslated";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { RoleGroupId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] RoleGroupViewModel rvm)
        {
            string sql = "dbo.EAppSaveRoleGroup";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        rvm.RoleGroupId,
                        rvm.LanguageId,
                        rvm.RoleGroupName,
                        rvm.Descriptions,
                        rvm.Active,
                        rvm.UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "RoleGroup Name already Exists.", "Error", true, sqlException);
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

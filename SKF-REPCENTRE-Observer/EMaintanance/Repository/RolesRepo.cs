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
    public class RolesRepo
    {

        private readonly Utility util;
        public RolesRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetRolesByStatus(string status)
        {
            string sql = (status != null && status.Equals("ALL"))
                ? "SELECT RoleId as id,* from dbo.Roles"
                : "SELECT RoleId as id,* from dbo.Roles where Active = '" + status + "'";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await conn.QueryAsync<dynamic>(sql);
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<dynamic> GetRoles(int id)
        {
            string sql = "Select * from dbo.Roles where RoleId=" + id;
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await conn.QueryFirstOrDefaultAsync<dynamic>(sql);
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] RoleViewModel rvm)
        {
            string sql = "dbo.EAppSaveRoles";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        rvm.RoleId,
                        rvm.RoleName,
                        rvm.Descriptions,
                        rvm.Active,
                        rvm.Internal,
                        rvm.UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<int> UpdateRoles(RoleViewModel rVM)
        {
            string sql = @"Update dbo.Roles set RoleName = @RoleName,Descriptions = @Descriptions,Active = @Active Where RoleId = @RoleId;";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await conn.ExecuteAsync(sql, new { rVM.RoleName, rVM.Active, rVM.Descriptions, rVM.RoleId });
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<int> AddRoles(RoleViewModel rVM)
        {

            string sql = @"select count(*) from dbo.Roles where RoleName = @RoleName";
            using (var conn = util.MasterCon())
            {
                if ((int)await conn.ExecuteScalarAsync(sql, new { rVM.RoleName }) > 0)
                {
                    throw new CustomException("Role already exists!!!", "Warning", true, null);
                };

                sql = @"Insert into dbo.Roles(RoleName,Descriptions,Active,Internal,CreatedBy)
                           values(@RoleName,@Descriptions,@Active,@Internal,@CreatedBy)";
                rVM.Internal = "Y";
                try
                {
                    return await conn.ExecuteAsync(sql, new { rVM.RoleName, rVM.Descriptions, rVM.Active, rVM.Internal, rVM.UserId });
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Role Name already Exists.", "Error", true, sqlException);
                    }
                    else
                    {
                        throw new CustomException("Due to some Technical Reason, Unable to Save or Update", "Error", true, sqlException);
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to create, Please Contact Support!!!", "Error", true, ex);
                }
            }

        }
    }
}

using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class UserClientSiteRelRepo
    {
        private readonly Utility util;
        public UserClientSiteRelRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetUserClientSites(int LanguageId, string Type, int UserId, int CountryId, int CostCentreId)
        {
            string sql = "dbo.EAppGetUserClientSiteAccess";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, Type, UserId, CountryId, CostCentreId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetUserSiteAccess(int LanguageId, int UserId, int LoginUserId)
        {
            string sql = "dbo.EAppGetUserSiteAccess";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, UserId, LoginUserId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate(int UserId, int LoginUserId, string Type, int Id, string Active)
        {
            string sql = "dbo.EAppSaveUserSiteAccess";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        UserId,
                        LoginUserId,
                        Type,
                        Id,
                        Active
                    }, commandType: CommandType.StoredProcedure));

                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

    }
}

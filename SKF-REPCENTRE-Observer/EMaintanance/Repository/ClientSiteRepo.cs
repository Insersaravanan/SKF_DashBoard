using Dapper;
using EMaintanance.Models;
using EMaintananceApi.Utils;
using EMaintanance.ViewModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Transactions;
using Microsoft.Extensions.Configuration;
using EMaintanance.Services;
using EMaintanance.Utils;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace EMaintanance.Repository
{
    public class ClientSiteRepo
    {
        private readonly Utility util;
        public ClientSiteRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetClientSiteByStatus(int LanguageId, int ClientSiteStatus, int UserId)
        {
            string sql = "dbo.EAppListClientSite";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, ClientSiteStatus, UserId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetSiteUserAccess(int LanguageId, int ClientSiteId)
        {
            string sql = "dbo.EAppGetSiteUserAccess";
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

        public async Task<IEnumerable<dynamic>> SaveSiteUserAccess(ClientSiteUserAccessParsedViewModel csuavm)
        {
            string sql = "dbo.EAppSaveClientUserAccess";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { csuavm.LoginUserId, csuavm.UserId, csuavm.ClientSiteId, csuavm.Active }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetTransClientSites(int ClientSiteId)
        {
            string sql = "dbo.EAppListClientSiteTranslated";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveClientSiteLogo(string logo, int clientSiteId)
        {
            string sql = "update [dbo].[ClientSite] set Logo = '" + logo + "' where ClientSiteId = " + clientSiteId + "";

            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] ClientSiteViewModel csvm)
        {
            string sql = "dbo.EAppSaveClientSite";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        csvm.ClientId,
                        csvm.ClientSiteId,
                        csvm.InternalRefId,
                        csvm.IndustryId,
                        csvm.CountryId,
                        csvm.CostCentreId,
                        csvm.LanguageId,
                        csvm.SiteName,
                        csvm.Address1,
                        csvm.Address2,
                        csvm.City,
                        csvm.Statename,
                        csvm.POBox,
                        csvm.Zip,
                        csvm.Phone,
                        csvm.ClientSiteStatus,
                        csvm.UserId,
                        csvm.Email,
                        csvm.Logo,
                        csvm.SiebelId,
                        csvm.ExcludeFromAnalytics
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    try
                    {
                        CustomUtils.HandleException(sqlException);
                        return null; // Returned Just to solve compile issue.
                    }
                    catch (CustomException cex)
                    {
                        throw new CustomException(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetConfiguration(int LanguageId, int ClientSiteId)
        {
            string sql = "dbo.EAppListClientSiteConfiguration";
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


        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] ClientSiteConfigurationViewModel csc)
        {
            string sql = "dbo.EAppSaveClientSiteConfiguration";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        csc.ClientSiteConfigId,
                        csc.ClientSiteId,
                        csc.ClientSiteConfigValue,
                        csc.ConfigId,
                        csc.UserId,

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
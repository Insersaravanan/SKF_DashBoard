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
    public class ClientMappingRepo
    {
        private readonly Utility util;
        public ClientMappingRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetClientMapping(int LanguageId, int UserId)
        {
            string sql = "dbo.EAppListClientSiteObserverMapping";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, UserId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveClientMapping(ClientMappingViewModel cmvm)
        {
            string sql = "dbo.EAppSaveClientSiteObserverMapping";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new {
                        cmvm.ClientSiteId,
                        cmvm.ObserverDBId,
                        cmvm.ObserverDBName,
                        cmvm.ObserverNodeId,
                        cmvm.ObserverNodeName,
                        cmvm.ObserverNodePath,
                        cmvm.SectorId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }
    }
}
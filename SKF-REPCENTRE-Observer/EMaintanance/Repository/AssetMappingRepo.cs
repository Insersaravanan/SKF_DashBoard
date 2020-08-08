using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    
    public class AssetMappingRepo
    {
        private readonly Utility util;
        public AssetMappingRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetAssetMapping(int ClientSiteID, int LanguageId)
        {
            string sql = "dbo.EAppListAssetObserverMapping";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteID, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate(AssetMappingViewModel amvm)
        {
            string sql = "dbo.EAppSaveAssetObserverMapping";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        amvm.AssetType,
                        amvm.AssetId,
                        amvm.ObserverNodeId,
                        amvm.ObserverNodeName,
                        amvm.ObserverNodePath
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                   
                        throw new CustomException("Due to some Technical Reason, Unable to Save or Update", "Error", true, sqlException);
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }
    }
}

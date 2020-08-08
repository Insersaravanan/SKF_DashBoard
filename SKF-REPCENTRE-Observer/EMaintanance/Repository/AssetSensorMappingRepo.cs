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
    public class AssetSensorMappingRepo
    {
        private readonly Utility util;
        readonly string JsonHeader = ""; 
        readonly string JsonFooter = ""; 
        public AssetSensorMappingRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetAssetHierarchy(int LanguageId, int ClientSiteId)
        {
            string sql = "dbo.EAppListAssetHierarchy";
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

        public async Task<IEnumerable<dynamic>> GetObserverUnitMapping(string UnitType, int UnitId, int LanguageId)
        {
            string sql = "dbo.EAppListObserverMappingUnit";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { UnitType, UnitId, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate(AssetSensorMappingViewModel Asmvm)
        {
            string sql = "dbo.EAppSaveAssetSensorMapping";
            using (var conn = util.MasterCon())
            {
                try
                {
                     var ShaftJson = JsonHeader + JsonConvert.SerializeObject(Asmvm.Shaft) + JsonFooter;

                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        Asmvm.ClientSiteId,
                        Asmvm.PlantAreaId,
                        Asmvm.EquipmentId,
                        Asmvm.UnitType,
                        Asmvm.UnitID,
                        ShaftJson,
                        Asmvm.UserId
                        
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

        public async Task<IEnumerable<dynamic>> GetEUnit(string Type , int LanguageId, int SourceId, int SourceId1)
        {
            string sql = "dbo.EAppLoadListItem";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { Type, LanguageId, SourceId, SourceId1 }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }
    }
}

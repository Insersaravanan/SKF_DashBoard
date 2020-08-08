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
    public class PlantRepo
    {
        private readonly Utility util;
        public PlantRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetPlantByStatus(int LanguageId, int ClientSiteId, string Status)
        {
            string sql = "dbo.EAppListPlantArea";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, ClientSiteId, Status }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetTransPlants(int PlantAreaId)
        {
            string sql = "dbo.EAppListPlantAreaTranslated";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { PlantAreaId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] PlantViewModel pvm)
        {
            string sql = "dbo.EAppSavePlantArea";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        pvm.PlantAreaId,
                        pvm.LanguageId,
                        pvm.ClientSiteId,
                        pvm.PlantAreaCode,
                        pvm.PlantAreaName,
                        pvm.Descriptions,
                        pvm.UserId,
                        pvm.Active,
                        pvm.ReturnKey
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

    }
}

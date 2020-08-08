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
    public class EngineeringUnitRepo
    {
        private readonly Utility util1;
        public EngineeringUnitRepo(IConfiguration configuration)
        {
            util1 = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetEngineeringUnitByStatus(int LanguageId, string Status)
        {
            string sql = "dbo.EAppListEngineeringUnit";
            using (var conn = util1.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, Status }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetTransEngineeringUnits(int EngineeringUnitId)
        {
            string sql = "dbo.EAppListEngineeringUnitTranslated";
            using (var conn = util1.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { EngineeringUnitId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] EngineeringUnitModel eum)
        {
            string sql = "dbo.EAppSaveEngineeringUnit";
            using (var conn = util1.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        eum.EngineeringId,
                        eum.LanguageId,
                        eum.EngineeringCode,
                        eum.EngineeringName,
                        eum.MinimumRange,
                        eum.MaximumRange,
                        eum.Active,
                        eum.UserId

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

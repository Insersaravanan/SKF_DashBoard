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
    public class SectorRepo
    {
        private readonly Utility util;
        public SectorRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetSectorByStatus(int LanguageId, string Status)
        {
            ///COMMENTS SSK ON 14-04-2020 Created New Stored procedure name only Observer Sector List  string sql = "dbo.EAppListSector";
            string sql = "dbo.OAppListSector";
            using (var conn = util.MasterCon())
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

        public async Task<IEnumerable<dynamic>> GetTransSectors(int SectorId)
        {
            string sql = "dbo.EAppListSectorTranslated";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { SectorId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] SectorViewModel svm)
        {
            string sql = "dbo.EAppSaveSector";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        svm.SectorId,
                        svm.LanguageId,
                        svm.SectorCode,
                        svm.SectorName,
                        svm.Descriptions,
                        svm.Active,
                        svm.UserId
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

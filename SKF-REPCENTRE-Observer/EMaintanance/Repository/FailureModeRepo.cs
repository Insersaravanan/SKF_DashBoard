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
    public class FailureModeRepo
    {
        private readonly Utility util;
        public FailureModeRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetFailureModeByStatus(int LanguageId, string Status)
        {
            string sql = "dbo.EAppListFailureMode";
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

        public async Task<IEnumerable<dynamic>> GetFailureModeByParams(FailureModeViewModel fmvm)
        {
            string sql = "dbo.EAppListFailureMode";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    { fmvm.LanguageId, fmvm.Status },
                    commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        // The below code need to remove once unit test is done this will be achieve by calling Taxonomy List.
        //public async Task<IEnumerable<dynamic>> GetFailureModeByAssetClass(int LanguageId, int AssetClassId)
        //{
        //    string sql = "dbo.EAppLoadListItem";
        //    using (var conn = util.MasterCon())
        //    {
        //        try
        //        {
        //            string Type = "FailureMode";
        //            int FailureCauseId = 0;
        //            return await (conn.QueryAsync<dynamic>(sql, new
        //            { Type, LanguageId, AssetClassId, FailureCauseId },
        //            commandType: CommandType.StoredProcedure));
        //        }
        //        catch (Exception ex)
        //        {
        //            throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
        //        }
        //    }
        //}

        public async Task<IEnumerable<dynamic>> GetFailureModeAssetClassRel(int LanguageId, int FailureModeId)
        {
            string sql = "dbo.EAppListFailureModeAssetClassRelation";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, FailureModeId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveFailureModeAssetClassRel(FailureModeAssetClassRelViewModel fmvm)
        {
            string sql = "dbo.EAppSaveFailureModeAssetClassRelation";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        fmvm.FailureModeId,
                        fmvm.AssetClassId,
                        fmvm.Active,
                        fmvm.UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Failure Mode Code already Exists.", "Error", true, sqlException);
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

        public async Task<IEnumerable<dynamic>> GetTransFailureModes(int FailureModeId)
        {
            string sql = "dbo.EAppListFailureModeTranslated";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { FailureModeId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] FailureModeViewModel fmvm)
        {
            string sql = "dbo.EAppSaveFailureMode";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        fmvm.FailureModeId,
                        fmvm.LanguageId,
                        fmvm.FailureModeCode,
                        fmvm.FailureModeName,
                        fmvm.Descriptions,
                        fmvm.Active,
                        fmvm.UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Failure Mode Code already Exists.", "Error", true, sqlException);
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

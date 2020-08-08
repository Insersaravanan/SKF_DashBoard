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
    public class FailureCauseRepo
    {
        private readonly Utility util;
        public FailureCauseRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetFailureCauseByStatus(int LanguageId, string Status)
        {
            string sql = "dbo.EAppListFailureCause";
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

        public async Task<IEnumerable<dynamic>> GetFailureCauseModeRel(int LanguageId, int FailureCauseId)
        {
            string sql = "dbo.EAppListFailureCauseModeRelation";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, FailureCauseId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetFailureCauseByParams(FailureCauseViewModel fcvm)
        {
            string sql = "dbo.EAppListFailureCause";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    { fcvm.LanguageId, fcvm.Status },
                    commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        // The below code need to remove once unit test is done this will be achieve by calling Taxonomy List.
        //public async Task<IEnumerable<dynamic>> GetFailureCauseByFailureMode(int LanguageId, int FailureModeId)
        //{
        //    string sql = "dbo.EAppLoadListItem";
        //    using (var conn = util.MasterCon())
        //    {
        //        try
        //        {
        //            string Type = "FailureCause";
        //            int SourceId = FailureModeId;
        //            int SourceId1 = 0;
        //            return await (conn.QueryAsync<dynamic>(sql, new
        //            { Type, LanguageId, SourceId, SourceId1 },
        //            commandType: CommandType.StoredProcedure));
        //        }
        //        catch (Exception ex)
        //        {
        //            throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
        //        }
        //    }
        //}

        public async Task<IEnumerable<dynamic>> GetTransFailureCauses(int FailureCauseId)
        {
            string sql = "dbo.EAppListFailureCauseTranslated";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { FailureCauseId }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Failure Cause Code already Exists.", "Error", true, sqlException);
                    }
                    else
                    {
                        throw new CustomException("Due to some Technical Reason, Unable to Save or Update", "Error", true, sqlException);
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] FailureCauseViewModel fcvm)
        {
            string sql = "dbo.EAppSaveFailureCause";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        fcvm.FailureCauseId,
                        fcvm.LanguageId,
                        fcvm.FailureCauseCode,
                        fcvm.FailureCauseName,
                        fcvm.Descriptions,
                        fcvm.Active,
                        fcvm.UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveFailureCauseModeRel([FromBody] FailureModeCauseViewModel fcvm)
        {
            string sql = "dbo.EAppSaveFailureCauseModeRelation";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        fcvm.FailureModeId,
                        fcvm.FailureCauseId,
                        fcvm.Active,
                        fcvm.UserId
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

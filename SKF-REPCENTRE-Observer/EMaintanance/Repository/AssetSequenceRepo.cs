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
    public class AssetSequenceRepo
    {
        private readonly Utility util;
        public AssetSequenceRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetAssetSequenceByStatus(int LanguageId, string Status)
        {
            string sql = "dbo.EAppListAssetSequence";
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

        public async Task<IEnumerable<dynamic>> GetAssetSequenceByParams(AssetSequenceViewModel avm)
        {
            string sql = "dbo.EAppListAssetSequence";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { avm.LanguageId, avm.Status }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        // The below code need to remove once unit test is done this will be achieve by calling Taxonomy List.
        //public async Task<IEnumerable<dynamic>> GetAssetSequenceByIndustry(int LanguageId, int IndustryId)
        //{
        //    string sql = "select at.AssetSequenceId,dbo.GetNameTranslated(at.AssetSequenceId," + LanguageId + ",'AssetSequenceName')" +
        //                    " as AssetSequenceName from AssetSequence at join AssetSequenceIndustryRelation atir on at.AssetSequenceId = atir.AssetSequenceId" +
        //                    " where atir.Active = 'Y' and atir.IndustryId = " + IndustryId;
        //    using (var conn = util.MasterCon())
        //    {
        //        try
        //        {
        //            return await (conn.QueryAsync<dynamic>(sql));
        //        }
        //        catch (Exception ex)
        //        {
        //            throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
        //        }
        //    }
        //}

        public async Task<IEnumerable<dynamic>> GetTransAssetSequences(int AssetSequenceId)
        {
            string sql = "dbo.EAppListAssetSequenceTranslated";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { AssetSequenceId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetAssetSequenceByIndRel(int LanguageId, int AssetSequenceId)
        {
            string sql = "dbo.EAppListAssetSequenceIndustryRelation";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, AssetSequenceId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

    
        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] AssetSequenceViewModel avm)
        {
            string sql = "dbo.EAppSaveAssetSequence";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        avm.AssetSequenceId,
                        avm.LanguageId,
                        avm.AssetTypeId,
                        avm.AssetSequenceCode,
                        avm.AssetSequenceName,
                        avm.Descriptions,
                        avm.Active,
                        avm.UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Asset Type Code already Exists.", "Error", true, sqlException);
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

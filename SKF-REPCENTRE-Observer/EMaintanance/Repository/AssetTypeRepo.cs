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
    public class AssetTypeRepo
    {
        private readonly Utility util;
        public AssetTypeRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetAssetTypeByStatus(int LanguageId, string Status)
        {
            string sql = "dbo.EAppListAssetType";
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

        public async Task<IEnumerable<dynamic>> GetAssetTypeByParams(AssetTypeViewModel avm)
        {
            string sql = "dbo.EAppListAssetType";
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
        //public async Task<IEnumerable<dynamic>> GetAssetTypeByIndustry(int LanguageId, int IndustryId)
        //{
        //    string sql = "select at.AssetTypeId,dbo.GetNameTranslated(at.AssetTypeId," + LanguageId + ",'AssetTypeName')" +
        //                    " as AssetTypeName from AssetType at join AssetTypeIndustryRelation atir on at.AssetTypeId = atir.AssetTypeId" +
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

        public async Task<IEnumerable<dynamic>> GetTransAssetTypes(int assetTypeId)
        {
            string sql = "dbo.EAppListAssetTypeTranslated";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { assetTypeId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetAssetTypeByIndRel(int LanguageId, int AssetTypeId)
        {
            string sql = "dbo.EAppListAssetTypeIndustryRelation";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, AssetTypeId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetAssetTypeClass(int LanguageId, int AssetTypeId)
        {
            string sql = "dbo.EAppListAssetTypeClassRelation";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, AssetTypeId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveAssertIndRel([FromBody] AssertTypeIndustryRelViewModel avm)
        {
            string sql = "dbo.EAppSaveAssetTypeIndustryRelation";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        avm.AssetTypeId,
                        avm.IndustryId,
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

        public async Task<IEnumerable<dynamic>> SaveAssetTypeClass([FromBody] AssetTypeClassRelViewModel avm)
        {
            string sql = "dbo.EAppSaveAssetTypeClassRelation";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        avm.AssetClassId,
                        avm.AssetTypeId,
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

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] AssetTypeViewModel avm)
        {
            string sql = "dbo.EAppSaveAssetType";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        avm.AssetTypeId,
                        avm.LanguageId,
                        avm.AssetTypeCode,
                        avm.AssetTypeName,
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

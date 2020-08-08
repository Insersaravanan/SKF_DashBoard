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
    public class TaxonomyRepo
    {
        private readonly Utility util;
        public TaxonomyRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetTaxonomyByStatus(int LanguageId, string Status)
        {
            string sql = "dbo.EAppListTaxonomy";
            using (var conn = util.MasterCon())
            {
                try
                {
                    int SectorId = 0;
                    int SegmentId = 0;
                    int IndustryId = 0;
                    int AssetTypeId = 0;
                    int FailureModeId = 0;
                    int AssetCategoryId = 0;
                    int AssetClassId = 0;
                    int AssetSequenceId = 0;

                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, SectorId, SegmentId, IndustryId, AssetTypeId, FailureModeId, AssetCategoryId, AssetClassId, AssetSequenceId, Status }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetAssetCategory(int LanguageId, string Status)
        {
            string sql = "dbo.EAppListAssetCategory";
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

        public async Task<IEnumerable<dynamic>> GetLoadListItem(string Type, int LanguageId, int SourceId, int SourceId1)
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

        public async Task<IEnumerable<dynamic>> GetTaxonomyByParams(TaxonomyViewModel tvm)
        {
            string sql = "dbo.EAppListTaxonomy";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    { tvm.LanguageId, tvm.SectorId, tvm.SegmentId, tvm.IndustryId, tvm.AssetTypeId, tvm.FailureModeId, tvm.Status, tvm.AssetCategoryId, tvm.AssetClassId, tvm.AssetSequenceId },
                    commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate(TaxonomyViewModel tvm)
        {
            string sql = "dbo.EAppSaveTaxonomy";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        tvm.TaxonomyId,
                        tvm.TaxonomyCode,
                        tvm.SectorId,
                        tvm.SegmentId,
                        tvm.IndustryId,
                        tvm.AssetTypeId,
                        tvm.FailureModeId,
                        tvm.FailureCauseId,
                        tvm.MTTR,
                        tvm.MTTROld,
                        tvm.MTBF,
                        tvm.MTBFOld,
                        tvm.Active,
                        tvm.UserId,
                        tvm.AssetCategoryId,
                        tvm.AssetClassId,
                        tvm.AssetSequenceId,
                        tvm.AssetClassTypeCode,
                        tvm.TaxonomyType

                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Combination of Industry, Asset Type, Failure Mode Type & Failure Cause Type already Exists.", "Error", true, sqlException);
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

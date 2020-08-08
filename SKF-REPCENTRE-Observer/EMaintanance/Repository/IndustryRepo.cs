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
    public class IndustryRepo
    {
        private readonly Utility util;
        public IndustryRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetIndustryByStatus(int LanguageId, string Status)
        {
            string sql = "dbo.EAppListIndustry";
            using (var conn = util.MasterCon())
            {
                try
                {
                    int SectorId = 0;
                    int SegmentId = 0;
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, SectorId, SegmentId, Status }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetIndustryByParams(IndustryViewModel ivm)
        {
            string sql = "dbo.EAppListIndustry";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { ivm.LanguageId, ivm.SectorId, ivm.SegmentId, ivm.Status }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetIndustryBySegment(int LanguageId, int SegmentId)
        {
            //string sql = "select IndustryId, dbo.GetNameTranslated(IndustryId," + LanguageId + ",'IndustryName') as IndustryName from Industry where Active = 'Y' and SegmentId = " + SegmentId;
            string sql = "dbo.EAppLoadListItem";
            using (var conn = util.MasterCon())
            {
                try
                {
                    string Type = "Industry";
                    int SourceId = SegmentId;
                    int SourceId1 = 0;
                    return await (conn.QueryAsync<dynamic>(sql, new { Type, LanguageId, SourceId, SourceId1 }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetTransIndustries(int IndustryId)
        {
            string sql = "dbo.EAppListIndustryTranslated";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { IndustryId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] IndustryViewModel svm)
        {
            string sql = "dbo.EAppSaveIndustry";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        svm.IndustryId,
                        svm.SegmentId,
                        svm.LanguageId,
                        svm.IndustryCode,
                        svm.IndustryName,
                        svm.Descriptions,
                        svm.Active,
                        svm.DownTimeCostPerHour,
                        svm.UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Industry Code already Exists.", "Error", true, sqlException);
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

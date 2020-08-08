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
    public class SegmentRepo
    {
        private readonly Utility util;
        public SegmentRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetSegmentByStatus(int LanguageId, string Status)
        {
            string sql = "dbo.EAppListSegment";
            using (var conn = util.MasterCon())
            {
                try
                {
                    int SectorId = 0;
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, SectorId, Status }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetSegmentByParams(SegmentViewModel svm)
        {
            string sql = "dbo.EAppListSegment";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { svm.LanguageId, svm.SectorId, svm.Status }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetSegmentBySector(int LanguageId, int SectorId)
        {
            //string sql = "select SegmentId,dbo.GetNameTranslated(SegmentId," + LanguageId + ",'SegmentName') as SegmentName from segment where Active = 'Y' and Sectorid = " + SectorId;
            string sql = "dbo.EAppLoadListItem";
            using (var conn = util.MasterCon())
            {
                try
                {
                    string Type = "Segment";
                    int SourceId = SectorId;
                    int SourceId1 = 0;
                    return await (conn.QueryAsync<dynamic>(sql, new { Type, LanguageId, SourceId, SourceId1 }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetTransSegments(int SegmentId)
        {
            string sql = "dbo.EAppListSegmentTranslated";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { SegmentId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] SegmentViewModel svm)
        {
            string sql = "dbo.EAppSaveSegment";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        svm.SegmentId,
                        svm.SectorId,
                        svm.LanguageId,
                        svm.SegmentCode,
                        svm.SegmentName,
                        svm.Descriptions,
                        svm.Active,
                        svm.UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Segment Code already Exists.", "Error", true, sqlException);
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

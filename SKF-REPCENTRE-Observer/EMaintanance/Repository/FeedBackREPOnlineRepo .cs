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
    public class FeedBackREPOnlineRepo
    {
        private readonly Utility util2;
        public FeedBackREPOnlineRepo(IConfiguration configuration)
        {
            util2 = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetFeedBackREPOnlineByStatus(int LanguageId, string Status, DateTime FeedBackFromDate, DateTime FeedBackToDate)
        {
            string sql = "dbo.EAppListFeedBackREPOnline";
            using (var conn = util2.MasterCon())
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

        public async Task<IEnumerable<dynamic>> GetTransFeedBackREPOnlines(int FeedBackREPOnlineId)
        {
            string sql = "dbo.EAppListFeedBackREPOnlineTranslated";
            using (var conn = util2.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { FeedBackREPOnlineId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] FeedBackREPOnlineModel eum)
        {
            string sql = "dbo.EAppSaveFeedBackREPOnline";
            using (var conn = util2.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        eum.FeedBackREPOnlineId,
                        eum.Subject,
                        eum.EmailID,
                        eum.MessageDetails,
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

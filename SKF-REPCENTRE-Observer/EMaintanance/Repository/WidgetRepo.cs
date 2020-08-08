using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class WidgetRepo
    {
        private readonly Utility util;
        public WidgetRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetWidgetByStatus(int LanguageId, int UserId, string Status)
        {
            string sql = "dbo.EAppGetUserWidgets";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, UserId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetDashboardByUser(int LanguageId, int UserId, string Status)
        {
            string sql = "dbo.EAppListUserDashboard";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { UserId, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        /* Save or Update User Dashboard */
        public async Task<IEnumerable<dynamic>> SaveorUpdate(UserDashboardViewModel udvm)
        {
            string sql = "dbo.EAppSaveUserDashboard";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { udvm.UserDashboardId, udvm.WidgetId, udvm.UserId, udvm.XAxis, udvm.YAxis, udvm.WRow, udvm.WColumn, udvm.DataViewPrefId, udvm.Param1, udvm.Param2, udvm.Param3, udvm.Param4, udvm.Param5, udvm.Active }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

    }
}

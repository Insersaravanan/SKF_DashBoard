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
    public class AuditLogRepo
    {
        private readonly Utility util;
        public AuditLogRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate(AuditLogViewModel alvm)
        {
            string sql = "dbo.EAppSaveAuditLog";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        alvm.HostIP,
                        alvm.SessionId,
                        alvm.IsForceLogout,
                        alvm.CurrentPage,
                        alvm.Activity,
                        alvm.UserId
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

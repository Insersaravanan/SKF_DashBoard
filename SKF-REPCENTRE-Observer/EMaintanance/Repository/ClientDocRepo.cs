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
    public class ClientDocRepo
    {
        private readonly Utility util;
        public ClientDocRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetClientDocByStatus(int ClientSiteId, string Status)
        {
            string sql = "dbo.EAppListClientAttachments";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteId, Status }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate(string Type, int TypeId, int AttachId, string FileDescription, string FileName, string LogicalName, string PhysicalPath, string Active, int UserId)
        {
            string sql = "dbo.EAppSaveClientDocAttachments";
            using (var conn = util.MasterCon())
            {
                try
                {
                    int ClientDocAttachId = AttachId;
                    int ClientSiteId = TypeId;
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        ClientDocAttachId,
                        ClientSiteId,
                        FileName,
                        FileDescription,
                        LogicalName,
                        PhysicalPath,
                        Active,
                        UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate(ClientDocViewModel cdvm)
        {
            string sql = "dbo.EAppSaveClientDocAttachments";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        cdvm.ClientDocAttachId,
                        cdvm.ClientSiteId,
                        cdvm.FileName,
                        cdvm.FileDescription,
                        cdvm.LogicalName,
                        cdvm.PhysicalPath,
                        cdvm.Active,
                        cdvm.UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

    }
}

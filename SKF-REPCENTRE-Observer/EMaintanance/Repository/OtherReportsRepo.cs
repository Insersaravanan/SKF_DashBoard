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
    public class OtherReportsRepo
    {
        private readonly Utility util;
        public OtherReportsRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetOtherReportsByStatus(int ClientSiteId, string Status)
        {
            string sql = "dbo.EAppListOtherReportsAttachments";
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

        public async Task<IEnumerable<dynamic>> GetEquipmentByPlant(int LanguageId, int plantId)
        {
            string sql = "select EquipmentId,dbo.GetNameTranslated(EquipmentId," + LanguageId + ",'EquipmentName') as EquipmentName from Equipment where Active = 'Y' and PlantAreaId = " + plantId;
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }




        public async Task<IEnumerable<dynamic>> SaveOrUpdate(OtherReportsViewModel orvm)
        {
            string sql = "dbo.EAppSaveOtherReportsAttachments";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        orvm.OtherReportsAttachId,
                        orvm.ClientSiteId,
                        orvm.ReportTypeId,
                        orvm.PlantAreaId,
                        orvm.ReportDate,
                        orvm.FileName,
                        orvm.FileDescription,
                        orvm.LogicalName,
                        orvm.PhysicalPath,
                        orvm.Active,
                        orvm.UserId
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

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
    public class TechUpgradeRepo
    {
        private readonly Utility util;
        public TechUpgradeRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetEquipmentByPlan(int LanguageId, int plantId)
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


         public async Task<IEnumerable<dynamic>> GetTechUpgradeByStatus(int LanguageId, int ClientSiteId, string Status)
        {
            string sql = "dbo.EAppListTechUpgrade";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, ClientSiteId, Status }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }


        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] TechUpgradeViewModel svm)
        {
            string sql = "dbo.EAppSaveTechUpgrade";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        svm.TechUpgradeId,
                        svm.ClientSiteId,
                        svm.EquipmentId,
                        svm.ReportDate,
                        svm.RecommendationDate,                       
                        svm.Saving,
                        svm.Recommendation  ,
                        svm.Remarks,
                        svm.OriginalFileName,
                        svm.LogicalFileName,
                        svm.PhysicalFilePath,
                        svm.Active,
                        svm.UserId

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

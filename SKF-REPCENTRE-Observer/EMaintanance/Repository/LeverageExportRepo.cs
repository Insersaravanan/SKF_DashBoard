using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class LeverageExportRepo
    {
        private readonly Utility util;
        public LeverageExportRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetLevergesByEquipmentId(int JobEquipmentId, int LanguageId)
        {
            string sql = "dbo.EAppListLeverageService";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { JobEquipmentId, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetLevergesByParams(LeverageExportSearchViewModel lsvm)
        {
            string sql = "dbo.EAppListLeverageServiceGeneration";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { lsvm.LeverageFromDate, lsvm.LeverageToDate, lsvm.CountryId, lsvm.LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate(LeverageExportViewModel lvm)
        {
            string sql = "dbo.EAppSaveLeverageService";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { lvm.LeverageServiceId, lvm.JobEquipmentId, lvm.OpportunityTypeId, lvm.Descriptions, lvm.LeverageExportId, lvm.Active, lvm.UserId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveExportLeverageFiles(LeverageExportViewModel lvm)
        {
            string sql = "dbo.EAppSaveLeverageServiceExport";
            using (var conn = util.MasterCon())
            {
                try
                {
                    string LeverageServiceJson = null;

                    if (lvm.LeverageExportServices != null && lvm.LeverageExportServices.Count > 0)
                    {
                        string Header = "{\"LeverageService\": ";
                        string Footer = "}";
                        LeverageServiceJson = Header + JsonConvert.SerializeObject(lvm.LeverageExportServices) + Footer;
                    }

                    return await (conn.QueryAsync<dynamic>(sql, new { LeverageServiceJson, lvm.FilePath, lvm.UserId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetExportLeverageFiles(LeverageExportSearchViewModel lsvm)
        {
            string sql = "dbo.EAppListLeverageServiceFiles";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { lsvm.FileFromDate, lsvm.FileToDate, lsvm.LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetLeveragesToExport(int LeverageExportId, int LanguageId)
        {
            string sql = "dbo.EAppExportOpportunityFile";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LeverageExportId, LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }
    }
}

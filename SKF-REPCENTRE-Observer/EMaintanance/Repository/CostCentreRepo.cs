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
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class CostCentreRepo
    {
        private readonly Utility util;
        public CostCentreRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetCostCentreByStatus(int CountryId, int LanguageId, string Status)
        {
            string sql = "dbo.EAppListCostCentre";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { CountryId, LanguageId, Status }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetTransCostCentre(int CostCentreId)
        {
            string sql = "dbo.EAppListCostCentreTranslated";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { CostCentreId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SearchCostCentre(CostCentreViewModel cvm)
        {
            string sql = "select c.CostCentreId,c.CountryId,dbo.GetNameTranslated(c.CountryId, " + cvm.LanguageId + ",'CountryName') as CountryName,ct.CostCentreName,ct.Descriptions, c.Active,c.CostCentreCode,ct.LanguageId,c.CreatedLanguageId from CostCentre c right join CostCentreTranslated ct on ct.CostCentreId = c.CostCentreId where c.countryId = " + cvm.CountryId + " and (c.Active = '" + cvm.Active + "' or '" + cvm.Active + "' = 'ALL') and( ct.LanguageId = " + cvm.LanguageId + " or (ct.LanguageId  = c.CreatedLanguageId and not exists (select 'x' from CostCentreTranslated where CostCentreId = c.CostCentreId and languageid = " + cvm.LanguageId + ")))";
            if (cvm.CostCentreName != null && cvm.CostCentreName.Length > 0)
            {
                sql = sql + " and CostCentreName like ('%" + cvm.CostCentreName + "%')";
            }
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

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] CostCentreViewModel cvm)
        {
            string sql = "dbo.EAppSaveCostCentre";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        cvm.CountryId,
                        cvm.CostCentreId,
                        cvm.LanguageId,
                        cvm.CostCentreName,
                        cvm.CostCentreCode,
                        cvm.Descriptions,
                        cvm.Active,
                        cvm.UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "CostCentre Code already Exists.", "Error", true, sqlException);
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

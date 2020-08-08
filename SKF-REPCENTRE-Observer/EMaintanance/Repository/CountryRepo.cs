using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace EMaintanance.Repository
{
    public class CountryRepo
    {
        private readonly Utility util;
        public CountryRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetAllCountries(int LanguageId, string Status)
        {
            string sql = "dbo.EAppListCountry";
            using (var conn = util.MasterCon())
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

        public async Task<IEnumerable<dynamic>> GetCountryByName(int LanguageId, string Name, string SearchParam)
        {
            string sql = "select c.CountryId,c.CountryCode,ct.CountryName from country c right " +
                "join CountryTranslated ct on ct.CountryId = c.CountryId where  " +
                "( ct.LanguageId = " + LanguageId + " or (  ct.LanguageId  = c.CreatedLanguageId " +
                "and not exists (select 'x' from CountryTranslated where countryid = c.countryid " +
                "and languageid = " + LanguageId + "))) and ct.CountryName like (N'%" + SearchParam + "%')";
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

        public async Task<IEnumerable<dynamic>> GetTransCountries(int CountryId)
        {
            string sql = "dbo.EAppListCountryTranslated";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { CountryId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] CountryViewModel cvm)
        {
            string sql = "dbo.EAppSaveCountry";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        cvm.CountryId,
                        cvm.LanguageId,
                        cvm.CountryCode,
                        cvm.CountryName,
                        cvm.Active,
                        cvm.UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Country Code already Exists.", "Error", true, sqlException);
                    }
                    else
                    {
                        throw new CustomException("Due to some Technical Reason, Unable to Save or Update", "Error", true, sqlException);
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }
    }
}

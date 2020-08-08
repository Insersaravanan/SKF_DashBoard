using Dapper;
using EMaintanance.Models;
using EMaintanance.Services;
using EMaintanance.Utils;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class LanguagesRepo
    {

        private readonly Utility util;
        public LanguagesRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetAllLanguages()
        {
            string sql = "SELECT LanguageId as id,* from dbo.Languages";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await conn.QueryAsync<dynamic>(sql);
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetLanguagesByStatus(string status)
        {
            string sql = "SELECT LanguageId as id,* from dbo.Languages where Active = '" + status + "'";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await conn.QueryAsync<dynamic>(sql);
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<dynamic> GetLanguages(int id)
        {
            string sql = "SELECT * from dbo.Languages where LanguageId=" + id;
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await conn.QueryFirstOrDefaultAsync<dynamic>(sql);
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<int> UpdateLanguage(Languages lang)
        {
            string sql = @"Update dbo.Languages set Lname = @Lname,Active = @Active,CountryCode = @CountryCode Where LanguageId = @LanguageId;";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await conn.ExecuteAsync(sql, new { lang.Lname, lang.Active, lang.CountryCode, lang.LanguageId });
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<int> AddLanguages(Languages lang)
        {
            string sql = null;
            using (var conn = util.MasterCon())
            {
                sql = @"Insert into dbo.Languages(Lname,CreatedBy,CountryCode)
                           values(@Lname,@CreatedBy,@CountryCode)";
                try
                {
                    return await conn.ExecuteAsync(sql, new { lang.Lname, lang.Active, lang.CreatedBy, lang.CountryCode });
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Language Name already Exists.", "Error", true, sqlException);
                    }
                    else
                    {
                        throw new CustomException("Due to some Technical Reason, Unable to Save or Update", "Error", true, sqlException);
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to create, Please Contact Support!!!", "Error", true, ex);
                }
            }

        }
    }
}

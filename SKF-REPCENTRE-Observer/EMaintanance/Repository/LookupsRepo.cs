using Dapper;
using EMaintanance.Models;
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
using System.Transactions;

namespace EMaintanance.Repository
{
    public class LookupsRepo
    {

        private readonly Utility util;
        public LookupsRepo(IConfiguration iconfiguration)
        {
            util = new Utility(iconfiguration);
        }

        public async Task<IEnumerable<dynamic>> GetLookupByStatus(int LanguageId, string Status)
        {
            string sql = "dbo.EAppListLookups";
            string LName = null;
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, Status, LName }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetLookupByName(int LanguageId, string LName)
        {
            string sql = "dbo.EAppListLookups";
            string Status = "Y";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, Status, LName }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<LookupsViewModel> GetLookupConfigByName(int LanguageId, string Status, string LName)
        {
            string sql = "dbo.EAppListLookups";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return (await conn.QueryFirstOrDefaultAsync<LookupsViewModel>(sql, new { LanguageId, Status, LName }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<int> GetLookupByNameNCode(string LookupCode, string LName)
        {
            string sql = "select LookupId from Lookups where LName = '" + LName + "' and LookupCode = '" + LookupCode + "'";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryFirstOrDefaultAsync<int>(sql));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetTransLookups(int LookupId)
        {
            string sql = "dbo.EAppListLookupTranslated";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LookupId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] LookupsViewModel lvm)
        {
            string sql = "dbo.EAppSaveLookups";
            using (var conn = util.MasterCon())
            {
                try
                {
                    string LookupName = lvm.Lname;
                    string LookupValue = lvm.Lvalue;
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        lvm.LookupId,
                        lvm.LanguageId,
                        lvm.LookupCode,
                        LookupName,
                        LookupValue,
                        lvm.ListOrder,
                        lvm.Descriptions,
                        lvm.Active,
                        lvm.UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Lookup Code already Exists.", "Error", true, sqlException);
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

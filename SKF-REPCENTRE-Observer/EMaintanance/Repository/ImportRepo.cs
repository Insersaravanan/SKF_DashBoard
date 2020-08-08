using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class ImportRepo
    {
        private readonly Utility util;
        public ImportRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> Import(ImportViewModel ivm)
        {
            string sql = "dbo.EAppMasterImport";
            using (var conn = util.MasterCon())
            {
                try
                {
                    string Header = "{\"Header\": [";
                    string Footer = "]}";
                    string Json = Header + JsonConvert.SerializeObject(ivm) + Footer;
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        Json
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

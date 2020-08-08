using Dapper;
using EMaintanance.Models;
using EMaintanance.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class CMSRepo
    {
        Utility util;
        private readonly ApplicationConfigurationRepo appConfigRepo;
        public CMSRepo(IConfiguration iconfiguration)
        {
            util = new Utility(iconfiguration);
        }

        public async Task<Cmssetup> GetContentById(int id)
        {
            string sql = "SELECT * FROM Cmssetup where [Cmsid] = " + id;

            using (var conn = util.MasterCon())
            {
                return await conn.QueryFirstOrDefaultAsync<Cmssetup>(sql);
            }
        }

        public async Task<Cmssetup> GetContentByTypeCode(string typeCode)
        {
            string sql = "SELECT * FROM Cmssetup where TypeCode = '" + typeCode + "'";

            using (var conn = util.MasterCon())
            {
                return await conn.QueryFirstOrDefaultAsync<Cmssetup>(sql);
            }
        }

    }
}

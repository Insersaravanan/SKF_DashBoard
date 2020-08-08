using Dapper;
using EMaintanance.Models;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Services
{
    public class CustomAuthService
    {
        private IConfiguration _configuration;
        private readonly Utility util;

        public CustomAuthService(IConfiguration configuration)
        {
            _configuration = configuration;
            util = new Utility(configuration);
        }

        public bool CheckPermission(int UserId, String ProgramCode, String PrivilegeCode)
        {
            bool result = false;
            List<RoleManager> userRoles = null;
            using (var conn = util.MasterCon())
            {
                var sql1 = @"select distinct ps.ProgramCode, p.PrivilegeCode
                            from Roles as r1
                            join [dbo].[RolePrgPrivilegeRelation] rp ON r1.RoleId = rp.RoleId and rp.Active = 'Y'
                            join [dbo].[Programs] ps ON ps.ProgramId = rp.ProgramId 
                            join [dbo].Privileges p on rp.PrivilegeId = p.PrivilegeID
                            join RoleGroupRoleRelation rr on rr.RoleId = r1.RoleId and rr.Active = 'Y' 
                            join RoleGroup r on r.RoleGroupId = rr.RoleGroupId and r.Active = 'Y'
                            join UserRoleGroupRelation ur on ur.RoleGroupId = r.RoleGroupId and ur.Active = 'Y'
                            WHERE ur.UserId = " + UserId + " order by ps.ProgramCode";

                userRoles = conn.Query<RoleManager>(sql1).ToList();

            }

            if (userRoles != null && userRoles.Count() > 0)
            {
                JArray jRoles = JArray.FromObject(userRoles);

                if (PrivilegeCode != null)
                {
                    if (jRoles.FirstOrDefault(x => x.Value<string>("ProgramCode") == ProgramCode && x.Value<string>("PrivilegeCode") == PrivilegeCode) != null)
                    {
                        result = true;
                    }
                }
                else
                {
                    if (jRoles.FirstOrDefault(x => x.Value<string>("ProgramCode") == ProgramCode) != null)
                    {
                        result = true;
                    }
                }
            }

            return result;
        }

        public class RoleManager
        {
            public string ProgramCode { get; set; }
            public string PrivilegeCode { get; set; }
        }

    }
}

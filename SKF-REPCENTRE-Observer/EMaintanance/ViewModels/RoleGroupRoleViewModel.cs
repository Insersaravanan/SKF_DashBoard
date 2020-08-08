using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class RoleGroupRoleViewModel
    {
        public int RoleGroupId { get; set; }
        public List<RoleRelations> RoleRelations { get; set; }
        public int UserId { get; internal set; }
    }

    public class RoleRelations
    {
        public int RoleId { get; set; }
        public string RoleName { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }
    }
}

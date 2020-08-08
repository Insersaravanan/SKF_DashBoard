using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class UserRoleGroupViewModel
    {
        public int UserId { get; set; }
        public List<Relations> Relations { get; set; }
    }

    public class Relations
    {
        public int RoleGroupId { get; set; }
        public string RoleGroupName { get; set; }
        public string Active { get; set; }
    }
}

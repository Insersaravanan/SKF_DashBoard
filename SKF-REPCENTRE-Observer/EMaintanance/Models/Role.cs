using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class Role
    {
        public Role()
        {
            ProgramRoleRelation = new HashSet<ProgramRoleRelation>();
            RoleGroupRoleRelation = new HashSet<RoleGroupRoleRelation>();
        }

        public int RoleId { get; set; }
        public string Internal { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public string RoleName { get; set; }
        public string Descriptions { get; set; }
        public string Active { get; set; }

        public Users CreatedByNavigation { get; set; }
        public ICollection<ProgramRoleRelation> ProgramRoleRelation { get; set; }
        public ICollection<RoleGroupRoleRelation> RoleGroupRoleRelation { get; set; }
    }
}

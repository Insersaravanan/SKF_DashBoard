using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class RoleGroupRoleRelation
    {
        public int RoleGroupRoleRelationId { get; set; }
        public int RoleGroupId { get; set; }
        public int RoleId { get; set; }
        public string Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Role Role { get; set; }
        public RoleGroup RoleGroup { get; set; }
    }
}

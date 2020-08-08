using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class UserRoleGroupRelation
    {
        public long UserRoleGroupRelId { get; set; }
        public int RoleGroupId { get; set; }
        public int UserId { get; set; }
        public string Active { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }

        public Users CreatedByNavigation { get; set; }
        public RoleGroup RoleGroup { get; set; }
        public Users User { get; set; }
    }
}

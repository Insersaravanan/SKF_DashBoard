using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class ProgramRoleRelation
    {
        public int ProrgramRoleRelationId { get; set; }
        public int ProgramId { get; set; }
        public int RoleId { get; set; }
        public string Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Programs Program { get; set; }
        public Role Role { get; set; }
    }
}

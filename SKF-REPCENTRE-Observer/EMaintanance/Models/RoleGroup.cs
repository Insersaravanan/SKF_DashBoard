using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class RoleGroup
    {
        public RoleGroup()
        {
            RoleGroupRoleRelation = new HashSet<RoleGroupRoleRelation>();
            RoleGroupTranslated = new HashSet<RoleGroupTranslated>();
            UserRoleGroupRelation = new HashSet<UserRoleGroupRelation>();
        }

        public int RoleGroupId { get; set; }
        public int CreatedLanguageId { get; set; }
        public int CountryId { get; set; }
        public string Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }

        public Country Country { get; set; }
        public Users CreatedByNavigation { get; set; }
        public Languages CreatedLanguage { get; set; }
        public ICollection<RoleGroupRoleRelation> RoleGroupRoleRelation { get; set; }
        public ICollection<RoleGroupTranslated> RoleGroupTranslated { get; set; }
        public ICollection<UserRoleGroupRelation> UserRoleGroupRelation { get; set; }
    }
}

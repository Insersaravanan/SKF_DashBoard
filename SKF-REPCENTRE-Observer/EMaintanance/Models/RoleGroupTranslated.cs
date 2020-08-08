using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class RoleGroupTranslated
    {
        public int RoleGroupTid { get; set; }
        public int RoleGroupId { get; set; }
        public int LanguageId { get; set; }
        public string RoleGroupName { get; set; }
        public string Descriptions { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Languages Language { get; set; }
        public RoleGroup RoleGroup { get; set; }
    }
}

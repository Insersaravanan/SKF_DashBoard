using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class RoleTranslated
    {
        public int RoleTid { get; set; }
        public int RoleId { get; set; }
        public int LanguageId { get; set; }
        public string RoleName { get; set; }
        public string Descriptions { get; set; }
        public string Active { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Languages Language { get; set; }
        public Role Role { get; set; }
    }
}

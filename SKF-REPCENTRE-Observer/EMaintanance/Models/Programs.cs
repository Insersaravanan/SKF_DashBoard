using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class Programs
    {
        public Programs()
        {
            ProgramRoleRelation = new HashSet<ProgramRoleRelation>();
            ProgramTranslated = new HashSet<ProgramTranslated>();
        }

        public int ProgramId { get; set; }
        public string Active { get; set; }
        public int CreatedLanguageId { get; set; }
        public int CountryId { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public int? MenuGroupId { get; set; }
        public string ProgramCode { get; set; }
        public int? MenuOrder { get; set; }
        public string ControllerName { get; set; }
        public string ActionName { get; set; }
        public string LinkUrl { get; set; }
        public string IconName { get; set; }
        public string CssClassName { get; set; }
        public string GroupCode { get; set; }
        public string SubGroupCode { get; set; }

        public Country Country { get; set; }
        public Users CreatedByNavigation { get; set; }
        public Languages CreatedLanguage { get; set; }
        public Lookups MenuGroup { get; set; }
        public ICollection<ProgramRoleRelation> ProgramRoleRelation { get; set; }
        public ICollection<ProgramTranslated> ProgramTranslated { get; set; }
    }
}

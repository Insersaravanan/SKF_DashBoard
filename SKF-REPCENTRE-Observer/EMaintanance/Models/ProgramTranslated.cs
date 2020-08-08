using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class ProgramTranslated
    {
        public int ProgramTid { get; set; }
        public int ProgramId { get; set; }
        public int LanguageId { get; set; }
        public string ProgramName { get; set; }
        public string Descriptions { get; set; }
        public string Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public string MenuName { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Languages Language { get; set; }
        public Programs Program { get; set; }
    }
}

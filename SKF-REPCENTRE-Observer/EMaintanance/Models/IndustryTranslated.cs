using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class IndustryTranslated
    {
        public int IndustryTid { get; set; }
        public int IndustryId { get; set; }
        public int LanguageId { get; set; }
        public string IndustryName { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public string Descriptions { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Languages Language { get; set; }
    }
}

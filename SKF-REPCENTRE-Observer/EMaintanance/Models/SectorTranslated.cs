using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class SectorTranslated
    {
        public int SectorTid { get; set; }
        public int SectorId { get; set; }
        public int LanguageId { get; set; }
        public string SectorName { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public string Descriptions { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Languages Language { get; set; }
    }
}

using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class SegmentTranslated
    {
        public int SegmentTid { get; set; }
        public int SegmentId { get; set; }
        public int LanguageId { get; set; }
        public string SegmentName { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public string Descriptions { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Languages Language { get; set; }
    }
}

using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class Industry
    {
        public int IndustryId { get; set; }
        public string IndustryCode { get; set; }
        public int SegmentId { get; set; }
        public int CreatedLanguageId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime Createdon { get; set; }
        public string Active { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Languages CreatedLanguage { get; set; }
        public Segment Segment { get; set; }
    }
}

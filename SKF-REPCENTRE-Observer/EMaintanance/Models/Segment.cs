using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class Segment
    {
        public Segment()
        {
            Industry = new HashSet<Industry>();
        }

        public int SegmentId { get; set; }
        public string SegmentCode { get; set; }
        public int SectorId { get; set; }
        public int CreatedLanguageId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime Createdon { get; set; }
        public string Active { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Sector Sector { get; set; }
        public ICollection<Industry> Industry { get; set; }
    }
}

using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class Sector
    {
        public Sector()
        {
            Segment = new HashSet<Segment>();
        }

        public int SectorId { get; set; }
        public string SectorCode { get; set; }
        public int CreatedLanguageId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime Createdon { get; set; }
        public string Active { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Languages CreatedLanguage { get; set; }
        public ICollection<Segment> Segment { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class SegmentViewModel
    {
        public int SegmentId { get; set; }
        public int SectorId { get; set; }
        public int LanguageId { get; set; }
        public string SegmentCode { get; set; }
        public string SegmentName { get; set; }
        public string Descriptions { get; set; }
        public string Active { get; set; }
        public string Status { get; set; }
        public int UserId { get; set; }
    }
}

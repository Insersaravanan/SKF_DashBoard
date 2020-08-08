using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class FailureCauseViewModel
    {
        public int FailureCauseId { get; set; }
        public int LanguageId { get; set; }
        public int FailureModeId { get; set; }
        public int AssetTypeId { get; set; }
        public int IndustryId { get; set; }
        public int SegmentId { get; set; }
        public int SectorId { get; set; }
        public String FailureCauseCode { get; set; }
        public String FailureCauseName { get; set; }
        public String Descriptions { get; set; }
        public string Active { get; set; }
        public string Status { get; set; }
        public int UserId { get; set; }
    }
}

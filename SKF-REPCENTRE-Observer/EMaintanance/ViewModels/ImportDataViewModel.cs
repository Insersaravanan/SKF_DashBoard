using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ImportDataViewModel
    {
        public string ReferenceNo { get; set; }
        public string SectorCode { get; set; }
        public string SectorName { get; set; }
        public string SectorDescriptions { get; set; }
        public string SegmentCode { get; set; }
        public string SegmentName { get; set; }
        public string SegmentDescriptions { get; set; }
        public string IndustryCode { get; set; }
        public string IndustryName { get; set; }
        public string IndustryDescriptions { get; set; }
        public string AssetTypeCode { get; set; }
        public string AssetTypeName { get; set; }
        public string AssetTypeDescriptions { get; set; }
        public string AssetCategoryCode { get; set; }
        public string AssetCategoryName { get; set; }
        public string AssetCategoryDescriptions { get; set; }
        public string AssetClassCode { get; set; }
        public string AssetClassName { get; set; }
        public string AssetClassDescriptions { get; set; }
        public string AssetSequenceCode { get; set; }
        public string AssetSequenceName { get; set; }
        public string AssetSequenceDescriptions { get; set; }
        public string FailureModeCode { get; set; }
        public string FailureModeName { get; set; }
        public string FailureModeDescriptions { get; set; }
        public string FailureCauseCode { get; set; }
        public string FailureCauseName { get; set; }
        public string FailureCauseDescriptions { get; set; }
        public string ValidationStatus { get; set; }
        public string ValidationResult { get; set; }
    }
}

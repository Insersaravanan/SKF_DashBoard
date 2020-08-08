using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class TaxonomyViewModel
    {
        public int LanguageId { get; set; }
        public int TaxonomyId { get; set; }
        public string TaxonomyCode { get; set; }
        public int SectorId { get; set; }
        public int SegmentId { get; set; }
        public int IndustryId { get; set; }
        public int AssetTypeId { get; set; }
        public int AssetCategoryId { get; set; }
        public int AssetClassId { get; set; }
        public int AssetSequenceId { get; set; }
        public int AssetClassTypeName { get; set; }
        public int FailureModeId { get; set; }
        public int FailureCauseId { get; set; }
        public decimal MTTR { get; set; }
        public decimal MTBF { get; set; }
        public decimal MTTROld { get; set; }
        public decimal MTBFOld { get; set; }
        public string Active { get; set; }
        public string Status { get; set; }
        public int UserId { get; set; }
        public string AssetClassTypeCode { get; set; }
        public string TaxonomyType { get; set; }
    }
}

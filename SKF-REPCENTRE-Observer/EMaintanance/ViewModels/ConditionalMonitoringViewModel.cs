using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ConditionalMonitoringViewModel
    {
        public string ReportName { get; set; }
        public string PreparedByName { get; set; }
        public string PreparedByEmail { get; set; }
        public string EquipmentName { get; set; }
        public string EquipmentCode { get; set; }
        public string ClientSiteName { get; set; }
        public string PlantAreaName { get; set; }
        public string DataCollectionDate { get; set; }
        public string ReportDate { get; set; }
        public string ApprovedBy { get; set; }
        public int EquipmentConditionCode { get; set; }
        public string EquipmentConditionName { get; set; }
        public string EquipmentComment { get; set; }
        public List<EquipConditionHistory> EquipConditionHistoryList { get; set; }
        public List<EquipmentUnitAnalysis> UnitAnalysisList { get; set; }

    }

    public class SearchConditionalMonitoringViewModel
    {
        public int ClientSiteId { get; set; }
        public DateTime? ReportFromDate { get; set; }
        public DateTime? ReportToDate { get; set; }
        public int? ConditionCodeId { get; set; }
        public int LanguageId { get; set; }
    }

    public class EquipConditionHistory
    {
        public string ReportDate { get; set; }
        public string ConditionStatus { get; set; }
        public string ConditionLegendColour { get; set; }
    }

    public class EquipmentUnitAnalysis
    {
        public string UnitType { get; set; }
        public string UnitName { get; set; }
        public string UnitCode { get; set; }
        public string AssetConditionName { get; set; }
        public string AsserConditionCodeColor { get; set; }
        public int AssetConditionCode { get; set; }
        public string FailureCause { get; set; }
        public string ConfidenceFactor { get; set; }
        public string Priority { get; set; }
        public string FailureProbabiltyFactor { get; set; }
        public int IntervalDays { get; set; }
        public string AssetComments { get; set; }
        public string Recommendation { get; set; }
        public List<Images> Images { get; set; }
    }

    public class Images
    {
        public string ImageUrl { get; set; }
    }

}

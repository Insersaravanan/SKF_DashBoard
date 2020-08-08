using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class FailureReportViewModel
    {
        [JsonProperty(PropertyName = "FailureReportHeaderId")]
        public int FailureReportHeaderId { get; set; }
        [JsonProperty(PropertyName = "ReportType")]
        public string ReportType { get; set; }
        [JsonProperty(PropertyName = "ClientsiteId")]
        public int ClientsiteId { get; set; }
        [JsonProperty(PropertyName = "EquipmentId")]
        public int EquipmentId { get; set; }
        [JsonProperty(PropertyName = "ReportDate")]
        public DateTime ReportDate { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
        [JsonProperty(PropertyName = "FailureReportList")]
        public List<UnitViewModel> FailureReportList { get; set; }
        [JsonProperty(PropertyName = "FailureDetailJson ")]
        public string FailureDetailJson { get; set; }
       
    }

    public class UnitViewModel
    {
        [JsonProperty(PropertyName = "FailureReportHeaderId")]
        public int FailureReportHeaderId { get; set; }
        [JsonProperty(PropertyName = "FailureReportDetailId")]
        public int FailureReportDetailId { get; set; }
        [JsonProperty(PropertyName = "UnitType")]
        public string UnitType { get; set; }
        [JsonProperty(PropertyName = "UnitId")]
        public int UnitId { get; set; }
        [JsonProperty(PropertyName = "FailureModeId")]
        public int? FailureModeId { get; set; }
        [JsonProperty(PropertyName = "FailureCauseId")]
        public int? FailureCauseId { get; set; }
        [JsonProperty(PropertyName = "DActualRepairCost")]
        public decimal? DActualRepairCost { get; set; }
        [JsonProperty(PropertyName = "DActualOutageTime")]
        public decimal? DActualOutageTime { get; set; }
        [JsonProperty(PropertyName = "Descriptions")]
        public string Descriptions { get; set; }
        [JsonProperty(PropertyName = "MTTR")]
        public decimal? MTTR { get; set; }
        [JsonProperty(PropertyName = "MTBF")]
        public decimal? MTBF { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
        [JsonProperty(PropertyName = "DActive")]
        public string DActive { get; set; }

    }

    public class FailureReportSearchViewModel
    {
        public string ReportType { get; set; }
        public int ClientSiteId { get; set; }
        public DateTime? ReportFromDate { get; set; }
        public DateTime? ReportToDate { get; set; }
        public int? FailureReportHeaderId { get; set; }
        public int LanguageId { get; set; }


    }

}
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class DashboardReportViewModel
    {
        public string ChartType { get; set; }
        public string WidgetCode { get; set; }
        public string WidgetId { get; set; }
        public int UserId { get; set; }
        public int ClientSiteId { get; set; }
        public string PlantName { get; set; }
        public string MachineName { get; set; }
        public string AssetName { get; set; }
        public int JobId { get; set; }
        public int DataLimit { get; set; }
    }

    public class FailureCauseReportDetail
    {
        public int UserId { get; set; }
        public int LanguageId { get; set; }
        public List<SectorListViewModel> SectorId { get; set; }
        public List<SegmentListViewModel> SegmentId { get; set; }
        public List<IndustryListViewModel> IndustryId { get; set; }
        public List<PlantListViewModel> PlantAreaId { get; set; }
        public List<CountryListViewModel> CountryId { get; set; }
        public List<ClientSiteListViewModel> ClientSiteId { get; set; }
        public List<CostCentreListViewModel> CostCentreId { get; set; }
        public String ReportType { get; set; }
    }

    public class CountryListViewModel
    {
        [JsonProperty(PropertyName = "CountryId")]
        public int? CountryId { get; set; }
    }

    public class CostCentreListViewModel
    {
        [JsonProperty(PropertyName = "CostCentreId")]
        public int? CostCentreId { get; set; }
    }

    public class SectorListViewModel
    {
        [JsonProperty(PropertyName = "SectorId")]
        public int? SectorId { get; set; }
    }

    public class SegmentListViewModel
    {
        [JsonProperty(PropertyName = "SegmentId")]
        public int? SegmentId { get; set; }
    }

    public class IndustryListViewModel
    {
        [JsonProperty(PropertyName = "IndustryId")]
        public int? IndustryId { get; set; }
    }

    public class PlantListViewModel
    {
        [JsonProperty(PropertyName = "PlantId")]
        public int? PlantAreaId { get; set; }
    }

    public class ClientSiteListViewModel
    {
        [JsonProperty(PropertyName = "ClientSiteId")]
        public int? ClientSiteId { get; set; }
    }
}

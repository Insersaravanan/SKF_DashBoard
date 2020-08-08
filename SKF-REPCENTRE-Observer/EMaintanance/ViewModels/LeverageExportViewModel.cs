using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class LeverageExportViewModel
    {
        [JsonProperty(PropertyName = "LeverageServiceId")]
        public int LeverageServiceId { get; set; }
        [JsonProperty(PropertyName = "JobEquipmentId")]
        public int JobEquipmentId { get; set; }
        [JsonProperty(PropertyName = "OpportunityTypeId")]
        public int OpportunityTypeId { get; set; }
        [JsonProperty(PropertyName = "Descriptions")]
        public string Descriptions { get; set; }
        [JsonProperty(PropertyName = "LeverageExportId")]
        public int? LeverageExportId { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
        [JsonProperty(PropertyName = "LeverageServices")]
        public List<LeverageExportServices> LeverageExportServices { get; set; }
        [JsonProperty(PropertyName = "FilePath")]
        public string FilePath { get; set; }
    }

    public class LeverageExportServices
    {
        public int LeverageServiceId { get; set; }
    }
}
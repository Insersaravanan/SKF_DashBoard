using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class OtherReportsViewModel
    {
        [JsonProperty(PropertyName = "OtherReportsAttachId")]
        public int OtherReportsAttachId { get; set; }
        [JsonProperty(PropertyName = "ClientSiteId")]
        public int ClientSiteId { get; set; }
        [JsonProperty(PropertyName = "ReportTypeId")]
        public int ReportTypeId { get; set; }
        [JsonProperty(PropertyName = "PlantAreaId")]
        public int PlantAreaId { get; set; }
        [JsonProperty(PropertyName = "EquipmentId")]
        public int EquipmentId { get; set; }
        [JsonProperty(PropertyName = "UnitId")]
        public int UnitId { get; set; }
        [JsonProperty(PropertyName = "ReportDate")]
        public DateTime ReportDate { get; set; }
        [JsonProperty(PropertyName = "FileName")]
        public string FileName { get; set; }
        [JsonProperty(PropertyName = "FileDescription")]
        public string FileDescription { get; set; }
        [JsonProperty(PropertyName = "LogicalName")]
        public string LogicalName { get; set; }
        [JsonProperty(PropertyName = "PhysicalPath")]
        public string PhysicalPath { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
    }
}

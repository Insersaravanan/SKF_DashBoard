using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class AssetTypeViewModel
    {
        [JsonProperty(PropertyName = "AssetTypeId")]
        public int AssetTypeId { get; set; }
        [JsonProperty(PropertyName = "LanguageId")]
        public int LanguageId { get; set; }
        [JsonProperty(PropertyName = "IndustryId")]
        public int IndustryId { get; set; }
        [JsonProperty(PropertyName = "SegmentId")]
        public int SegmentId { get; set; }
        [JsonProperty(PropertyName = "SectorId")]
        public int SectorId { get; set; }
        [JsonProperty(PropertyName = "AssetTypeCode")]
        public String AssetTypeCode { get; set; }
        [JsonProperty(PropertyName = "AssetTypeName")]
        public String AssetTypeName { get; set; }
        [JsonProperty(PropertyName = "Descriptions")]
        public String Descriptions { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        [JsonProperty(PropertyName = "Status")]
        public string Status { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
    }


    public class AssetTypeClassRelViewModel
    {
        public int AssetClassId { get; set; }
        public int AssetTypeId { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }
    }
}

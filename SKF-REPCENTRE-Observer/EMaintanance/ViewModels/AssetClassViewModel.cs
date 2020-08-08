using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class AssetClassViewModel
    {
        [JsonProperty(PropertyName = "AssetClassId")]
        public int AssetClassId { get; set; }
        [JsonProperty(PropertyName = "LanguageId")]
        public int LanguageId { get; set; }
        [JsonProperty(PropertyName = "AssetClassCode")]
        public String AssetClassCode { get; set; }
        [JsonProperty(PropertyName = "AssetTypeId")]
        public String AssetTypeID { get; set; }
        [JsonProperty(PropertyName = "AssetClassName")]
        public String AssetClassName { get; set; }
        [JsonProperty(PropertyName = "Descriptions")]
        public String Descriptions { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        [JsonProperty(PropertyName = "Status")]
        public string Status { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
    }

    public class AssetClassIndustryRelViewModel
    {
        public int AssetClassId { get; set; }
        public int IndustryId { get; set; }
        public string Active { get; set; }
        public string OriginalActive { get; set; }
        public int UserId { get; set; }
    }

}

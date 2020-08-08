using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class AssetCategoryViewModel
    {
        [JsonProperty(PropertyName = "AssetCategoryId")]
        public int AssetCategoryId { get; set; }
        [JsonProperty(PropertyName = "LanguageId")]
        public int LanguageId { get; set; }
        [JsonProperty(PropertyName = "AssetCategoryCode")]
        public String AssetCategoryCode { get; set; }
        [JsonProperty(PropertyName = "AssetCategoryName")]
        public String AssetCategoryName { get; set; }
        [JsonProperty(PropertyName = "Descriptions")]
        public String Descriptions { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        [JsonProperty(PropertyName = "Status")]
        public string Status { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
    }

    public class AssetCategoryClassRelViewModel
    {
        public int AssetClassId { get; set; }
        public int AssetCategoryId { get; set; }
        public string Active { get; set; }
        public string OriginalActive { get; set; }
        public int UserId { get; set; }
    }
}

using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class AssetSequenceViewModel
    {
        [JsonProperty(PropertyName = "AssetSequenceId")]
        public int AssetSequenceId { get; set; }
        [JsonProperty(PropertyName = "AssetTypeId")]
        public int AssetTypeId { get; set; }
        [JsonProperty(PropertyName = "LanguageId")]
        public int LanguageId { get; set; }
        [JsonProperty(PropertyName = "AssetSequenceCode")]
        public String AssetSequenceCode { get; set; }
        [JsonProperty(PropertyName = "AssetSequenceName")]
        public String AssetSequenceName { get; set; }
        [JsonProperty(PropertyName = "Descriptions")]
        public String Descriptions { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        [JsonProperty(PropertyName = "Status")]
        public string Status { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
    }
}

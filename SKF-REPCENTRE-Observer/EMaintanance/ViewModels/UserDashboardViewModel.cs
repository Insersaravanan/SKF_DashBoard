using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class UserDashboardViewModel
    {
        [JsonProperty(PropertyName = "UserDashboardId")]
        public int UserDashboardId { get; set; }
        [JsonProperty(PropertyName = "WidgetId")]
        public int WidgetId { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int? UserId { get; set; }
        [JsonProperty(PropertyName = "sizeX")]
        public int? XAxis { get; set; }
        [JsonProperty(PropertyName = "sizeY")]
        public int? YAxis { get; set; }
        [JsonProperty(PropertyName = "row")]
        public int? WRow { get; set; }
        [JsonProperty(PropertyName = "col")]
        public int? WColumn { get; set; }
        [JsonProperty(PropertyName = "DataViewPrefId")]
        public int? DataViewPrefId { get; set; }
        [JsonProperty(PropertyName = "Param1")]
        public string Param1 { get; set; }
        [JsonProperty(PropertyName = "Param2")]
        public string Param2 { get; set; }
        [JsonProperty(PropertyName = "Param3")]
        public string Param3 { get; set; }
        [JsonProperty(PropertyName = "Param4")]
        public string Param4 { get; set; }
        [JsonProperty(PropertyName = "Param5")]
        public string Param5 { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; } = "Y";

    }
}

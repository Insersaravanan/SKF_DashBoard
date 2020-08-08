using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ClientDocViewModel
    {
        [JsonProperty(PropertyName = "ClientDocAttachId")]
        public int ClientDocAttachId { get; set; }
        [JsonProperty(PropertyName = "ClientSiteId")]
        public int ClientSiteId { get; set; }
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

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class PlantViewModel
    {
        public int PlantAreaId { get; set; }
        public int LanguageId { get; set; }
        public int ClientSiteId { get; set; }
        public string PlantAreaCode { get; set; }
        public string PlantAreaName { get; set; }
        public string Descriptions { get; set; }
        public string Status { get; set; }
        public int UserId { get; set; }
        public string Active { get; set; }
        public int? ReturnKey { get; set; }
        public object ChannelCode { get; internal set; }
    }
}

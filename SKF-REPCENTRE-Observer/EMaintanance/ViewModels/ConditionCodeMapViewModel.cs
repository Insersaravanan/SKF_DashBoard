using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ConditionCodeMapViewModel
    {
        public int CMappingId { get; set; }
        public int CMappingTId { get; set; }
        public int ConditionId { get; set; }
        public int ClientSiteId { get; set; }
        public int LanguageId { get; set; }
        public string ClientsConditionName { get; set; }
        public string ConditionName { get; set; }
        public string Descriptions { get; set; }
        public int UserId { get; set; }
        public string Active { get; set; }
    }
}

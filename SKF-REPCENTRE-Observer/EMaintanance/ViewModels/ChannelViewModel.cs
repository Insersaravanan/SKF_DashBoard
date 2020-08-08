using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ChannelViewModel
    {
        public int ChannelId { get; set; }
        public int LanguageId { get; set; }
        public int ClientSiteId { get; set; }
        public string ChannelCode { get; set; }
        public string ChannelName { get; set; }
        public string Descriptions { get; set; }
        public string Status { get; set; }
        public int UserId { get; set; }
        public string Active { get; set; }
        public int? ReturnKey { get; set; }
    }
}

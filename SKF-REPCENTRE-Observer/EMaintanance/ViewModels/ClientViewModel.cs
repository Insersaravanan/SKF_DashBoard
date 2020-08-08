using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ClientViewModel
    {
        public int ClientId { get; set; }
        public int ClientTid { get; set; }
        public int LanguageId { get; set; }
        public string ClientName { get; set; }
        public int ClientStatus { get; set; }
        public string ClientStatusName { get; set; }
        public int UserId { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class AuditLogViewModel
    {
        public int AuditLogHeaderId { get; set; }
        public string SessionId { get; set; }
        public DateTime InTime { get; set; }
        public DateTime OutTime { get; set; }
        public string HostIP { get; set; }
        public string IsForceLogout { get; set; }
        public string CurrentPage { get; set; }
        public string Activity { get; set; }
        public int ClientSiteId { get; set; }
        public int UserId { get; set; }
    }
}

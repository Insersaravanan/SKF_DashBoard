using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ReportViewModel
    {
        public int? JobId { get; set; }
        public int? JobEquipmentId { get; set; }
        public int? LanguageId { get; set; }
        public int? ClientSiteId { get; set; }
        public string Type { get; set; }
    }
}

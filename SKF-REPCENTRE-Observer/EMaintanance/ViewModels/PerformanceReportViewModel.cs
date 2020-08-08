using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class PerformanceReportViewModel
    {
        public DateTime FromDate { get; set; }
        public DateTime ToDate { get; set; }
        public int ClientSiteId { get; set; }
        public int PlantAreaId { get; set; }
        public int LanguageId { get; set; }
        public string ReportType { get; set; }
    }
}

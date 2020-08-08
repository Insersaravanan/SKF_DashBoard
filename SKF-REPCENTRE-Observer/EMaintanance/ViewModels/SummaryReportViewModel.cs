using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class SummaryReportViewModel
    {
        public string CustomHeader { get; set; }
        public string CustomerLogo { get; set; }
        public string PlantAreaName { get; set; }
        public string ClientSiteName { get; set; }
        public string PreparedByName { get; set; }
        public string PreparedByEmail { get; set; }
        public string ApprovedBy { get; set; }
        public string DataCollectionDate { get; set; }
        public string ReportDate { get; set; }

        public string ServiceTypeCode { get; set; }
    }

    public class SearchSummaryReportViewModel
    {
        public int ClientSiteId { get; set; }
        public DateTime? ReportFromDate { get; set; }
        public DateTime? ReportToDate { get; set; }
        public int LanguageId { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class TechUpgradeViewModel
    {
        public int TechUpgradeId { get; set; }
        public int ClientSiteId { get; set; }
        public DateTime ReportDate { get; set; }
        public DateTime RecommendationDate { get; set; }
        public decimal Saving { get; set; }
        public int EquipmentId { get; set; }
        public string Recommendation { get; set; }
        public string Remarks { get; set; }
        public String OriginalFileName { get; set; }
        public String PhysicalFilePath { get; set; }
        public String LogicalFileName { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }
    }   
}

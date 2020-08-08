using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class CostCentreTranslated
    {
        public int CostCentreTid { get; set; }
        public int CostCentreId { get; set; }
        public int LanguageId { get; set; }
        public string CostCentreName { get; set; }
        public string Descriptions { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }

        public CostCentre CostCentre { get; set; }
        public Users CreatedByNavigation { get; set; }
        public Languages Language { get; set; }
    }
}

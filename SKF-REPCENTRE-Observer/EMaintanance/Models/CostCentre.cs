using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class CostCentre
    {
        public CostCentre()
        {
            CostCentreTranslated = new HashSet<CostCentreTranslated>();
        }

        public int CostCentreId { get; set; }
        public int CountryId { get; set; }
        public string Active { get; set; }
        public int CreatedLanguageId { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }

        public Country Country { get; set; }
        public Users CreatedByNavigation { get; set; }
        public Languages CreatedLanguage { get; set; }
        public ICollection<CostCentreTranslated> CostCentreTranslated { get; set; }
    }
}

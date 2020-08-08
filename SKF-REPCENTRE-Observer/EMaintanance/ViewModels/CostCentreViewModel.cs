using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class CostCentreViewModel
    {
        public int CostCentreId { get; set; }
        public int CountryId { get; set; }
        public string Active { get; set; }
        public int CreatedLanguageId { get; set; }
        public int CostCentreTid { get; set; }
        public int LanguageId { get; set; }
        public string CostCentreName { get; set; }
        public string CostCentreCode { get; set; }
        public string Descriptions { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UserId { get; set; }
    }
}

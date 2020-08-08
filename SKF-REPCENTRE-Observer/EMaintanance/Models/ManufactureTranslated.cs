using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Models
{
    public class ManufactureTranslated
    {
        public int ManufacturerTid { get; set; }
        public int ManufacturerId { get; set; }
        public int LanguageId { get; set; }
        public string ManufacturerName { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public string Descriptions { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Languages Language { get; set; }
    }
}

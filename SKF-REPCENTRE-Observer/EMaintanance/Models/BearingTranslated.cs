using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Models
{
    public class BearingTranslated
    {
        public int BearingTid { get; set; }
        public int BearingId { get; set; }
        public int LanguageId { get; set; }
        public string BearingName { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public string Descriptions { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Languages Language { get; set; }
    }
}

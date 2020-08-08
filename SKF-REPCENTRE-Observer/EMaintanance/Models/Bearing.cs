using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Models
{
    public class Bearing
    {

        public int BearingId { get; set; }
        public string BearingCode { get; set; }
        public int CreatedLanguageId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime Createdon { get; set; }
        public string Active { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Languages CreatedLanguage { get; set; }
      
    }

}

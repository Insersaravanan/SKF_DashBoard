using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class BearingViewModel
    {
        public int BearingId { get; set; }
        public int ManufacturerId { get; set; }
        public int LanguageId { get; set; }
        public String BearingCode { get; set; }
        public String BearingName { get; set; }
        public String Descriptions { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }
    }
}

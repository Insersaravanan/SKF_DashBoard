using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class SectorViewModel
    {
        public int SectorId { get; set; }
        public int LanguageId { get; set; }
        public String SectorCode { get; set; }
        public String SectorName { get; set; }
        public String Descriptions { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }
    }
}

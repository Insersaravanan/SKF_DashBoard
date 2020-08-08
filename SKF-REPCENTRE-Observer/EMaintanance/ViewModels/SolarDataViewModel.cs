using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class SolarDataViewModel
    {
        public string SolarDataID { get; set; }
        public string SiteID { get; set; }
        public string Length { get; set; }
        public string RealTimeClock { get; set; }
        public string ReadingType { get; set; }
        public string ReadingValue { get; set; }
        public DateTime Createdon { get; set; } = DateTime.Now;
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ManufactureViewModel
    {
        public int ManufacturerId { get; set; }
        public int LanguageId { get; set; }
        public String ManufacturerCode { get; set; }
        public String ManufacturerName { get; set; }
        public String Descriptions { get; set; }
        public string Active { get; set; }
        public string BearingMFT { get; set; }
        public string DriveMFT { get; set; }
        public string IntermediateMFT { get; set; }
        public string DrivenMFT { get; set; }
        public int UserId { get; set; }
    }

}

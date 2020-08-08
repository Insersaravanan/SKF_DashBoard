using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class EmailConfigurationViewModel
    {
        public string GroupName { get; set; }
        public string EmailList { get; set; }
        public string MobileNoList { get; set; }
        public string AlarmInterval { get; set; }
        public string MinutesCount { get; set; }

        public string AlarmStatus { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string Active { get; set; }
    }
}

using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public class SMSConfiguration
    {

        public int EmailConfigId { get; set; }
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

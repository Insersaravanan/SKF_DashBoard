using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Models
{
    public class ApplicationConfiguration
    {
        public int AppConfigId { get; set; }
        public string AppConfigCode { get; set; }
        public string AppConfigName { get; set; }
        public string AppConfigValue { get; set; }
        public string Descriptions { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }

        public Users CreatedByNavigation { get; set; }
    }
}

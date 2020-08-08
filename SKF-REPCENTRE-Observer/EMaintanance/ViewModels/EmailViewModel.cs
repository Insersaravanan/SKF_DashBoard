using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class EmailViewModel
    {
        [JsonProperty(PropertyName = "FromEmail")]
        public EmailAttributesViewModel FromEmail { get; set; }
        [JsonProperty(PropertyName = "ToEmailList")]
        public List<EmailAttributesViewModel> ToEmailList { get; set; }
        [JsonProperty(PropertyName = "Location")]
        public string Location { set; get; }
        [JsonProperty(PropertyName = "StartDate")]
        public DateTime StartDate { set; get; }
        [JsonProperty(PropertyName = "EndDate")]
        public DateTime EndDate { set; get; }
        [JsonProperty(PropertyName = "Subject")]
        public string Subject { set; get; }
        [JsonProperty(PropertyName = "Body")]
        public string Body { set; get; }
        [JsonProperty(PropertyName = "IsCalendarInvite")]
        public Boolean IsCalendarInvite { set; get; } = false;
        [JsonProperty(PropertyName = "Attachments")]
        public List<FileInfo> Attachments { get; set; }

    }

    public class EmailAttributesViewModel
    {
        [JsonProperty(PropertyName = "EmailId")]
        public string EmailId { get; set; }
        [JsonProperty(PropertyName = "Name")]
        public string Name { get; set; }
    }
}

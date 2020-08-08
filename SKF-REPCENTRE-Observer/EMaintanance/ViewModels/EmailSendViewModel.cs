using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class EmailSendViewModel
    {
        [JsonProperty(PropertyName = "FromEmail")]
        public string FromEmail { get; set; }
        public string ToMail { get; set; }
        //[JsonProperty(PropertyName = "ToEmailList")]
        //public List<EmailsenderAttViewModel> ToEmailList { get; set; }
        [JsonProperty(PropertyName = "Subject")]
        public string Subject { set; get; }
        [JsonProperty(PropertyName = "Body")]
        public string Body { set; get; }
    }

    public class EmailsenderAttViewModel
    {
        [JsonProperty(PropertyName = "EmailId")]
        public string EmailId { get; set; }
        //[JsonProperty(PropertyName = "Name")]
        //public string Name { get; set; }
    }
}

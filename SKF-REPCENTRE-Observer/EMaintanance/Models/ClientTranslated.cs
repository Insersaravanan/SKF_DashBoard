using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class ClientTranslated
    {
        public int ClientTid { get; set; }
        public int ClientId { get; set; }
        public int LanguageId { get; set; }
        public string InternalRefId { get; set; }
        public string ClientName { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }

        public Client Client { get; set; }
        public Users CreatedByNavigation { get; set; }
        public Languages Language { get; set; }
    }
}

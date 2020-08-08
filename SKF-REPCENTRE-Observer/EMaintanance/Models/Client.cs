using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class Client
    {
        public Client()
        {
            ClientTranslated = new HashSet<ClientTranslated>();
        }

        public int ClientId { get; set; }
        public int CreatedLanguageId { get; set; }
        public int ClientStatus { get; set; }
        public int CreatedBy { get; set; }
        public DateTime Createdon { get; set; }

        public Lookups ClientStatusNavigation { get; set; }
        public Users CreatedByNavigation { get; set; }
        public Languages CreatedLanguage { get; set; }
        public ICollection<ClientTranslated> ClientTranslated { get; set; }
    }
}

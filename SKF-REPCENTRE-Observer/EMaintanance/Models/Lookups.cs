using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class Lookups
    {
        public Lookups()
        {
            Client = new HashSet<Client>();
            ClientSite = new HashSet<ClientSite>();
            LookupTranslated = new HashSet<LookupTranslated>();
            Programs = new HashSet<Programs>();
            Users = new HashSet<Users>();
        }

        public int LookupId { get; set; }
        public string Active { get; set; }
        public int CreatedLanguageId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string LookupCode { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Languages CreatedLanguage { get; set; }
        public ICollection<Client> Client { get; set; }
        public ICollection<ClientSite> ClientSite { get; set; }
        public ICollection<LookupTranslated> LookupTranslated { get; set; }
        public ICollection<Programs> Programs { get; set; }
        public ICollection<Users> Users { get; set; }
    }
}

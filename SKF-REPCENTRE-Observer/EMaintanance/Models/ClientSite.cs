using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class ClientSite
    {
        public ClientSite()
        {
            ClientSiteTranslated = new HashSet<ClientSiteTranslated>();
            UserClientSiteRelation = new HashSet<UserClientSiteRelation>();
        }

        public int ClientSiteId { get; set; }
        public int CreatedLanguageId { get; set; }
        public int ClientSiteStatus { get; set; }
        public int CreatedBy { get; set; }
        public DateTime Createdon { get; set; }

        public Lookups ClientSiteStatusNavigation { get; set; }
        public Users CreatedByNavigation { get; set; }
        public Languages CreatedLanguage { get; set; }
        public ICollection<ClientSiteTranslated> ClientSiteTranslated { get; set; }
        public ICollection<UserClientSiteRelation> UserClientSiteRelation { get; set; }
    }
}

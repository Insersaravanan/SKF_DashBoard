using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class ClientSiteTranslated
    {
        public int ClientSiteTid { get; set; }
        public int ClientSiteId { get; set; }
        public string InternalRefId { get; set; }
        public string SiteName { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string StateName { get; set; }
        public string Country { get; set; }
        public string Pobox { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }
        public int CostCentreId { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public int LanguageId { get; set; }

        public ClientSite ClientSite { get; set; }
        public Users CreatedByNavigation { get; set; }
        public Languages Language { get; set; }
    }
}

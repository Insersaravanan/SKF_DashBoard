using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ClientSiteViewModel
    {
        public int? ClientId { get; set; }
        public int ClientSiteId { get; set; }
        public string InternalRefId { get; set; }
        public int IndustryId { get; set; }
        public int CountryId { get; set; }
        public int CostCentreId { get; set; }
        public int LanguageId { get; set; }
        public string SiteName { get; set; }
        public string Address1 { get; set; }
        public string Address2 { get; set; }
        public string City { get; set; }
        public string Statename { get; set; }
        public string POBox { get; set; }
        public string Zip { get; set; }
        public string Phone { get; set; }
        public int ClientSiteStatus { get; set; }
        public string ClientSiteStatusName { get; set; }
        public int UserId { get; set; }
        public string Email { get; set; }
        public string Logo { get; set; }
        public string SiebelId { get; set; }
        public int ExcludeFromAnalytics { get; set; }
    }

    public class ClientSiteConfigurationViewModel
    {
        public int ClientSiteConfigId { get; set; }
        public int ClientSiteId { get; set; }
        public string ConfigName { get; set; }
        public string ClientSiteConfigValue { get; set; }
        public int ConfigId { get; set; }
        public int UserId { get; set; }
    }
}

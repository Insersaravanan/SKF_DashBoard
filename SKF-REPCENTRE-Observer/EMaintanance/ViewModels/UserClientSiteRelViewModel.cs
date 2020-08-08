using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class UserClientSiteRelViewModel
    {
        public int UserId { get; set; }
        public int LanguageId { get; set; }
        public int LoginUserId { get; set; }
        public List<CountryRelations> CountryRelations { get; set; }
        public List<CostCentreRelations> CostCentreRelations { get; set; }
        public List<ClientRelations> ClientRelations { get; set; }
        public List<ClientSiteRelations> ClientSiteRelations { get; set; }
    }

    public class CountryRelations
    {
        public int CountryId { get; set; }
        public string CountryName { get; set; }
        public string Active { get; set; }
    }

    public class CostCentreRelations
    {
        public int CountryId { get; set; }
        public string CountryName { get; set; }
        public int CostCentreId { get; set; }
        public string CostCentreName { get; set; }
        public string Active { get; set; }
    }

    public class ClientRelations
    {
        public int CountryId { get; set; }
        public string CountryName { get; set; }
        public int CostCentreId { get; set; }
        public string CostCentreName { get; set; }
        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public string Active { get; set; }
    }

    public class ClientSiteRelations
    {
        public int CountryId { get; set; }
        public string CountryName { get; set; }
        public int CostCentreId { get; set; }
        public string CostCentreName { get; set; }
        public int ClientId { get; set; }
        public string ClientName { get; set; }
        public int ClientSiteId { get; set; }
        public string ClientSiteName { get; set; }
        public string Active { get; set; }
    }
}

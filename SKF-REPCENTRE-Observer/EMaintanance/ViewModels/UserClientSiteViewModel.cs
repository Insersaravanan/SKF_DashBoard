using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class UserClientSiteViewModel
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
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

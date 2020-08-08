using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class Languages
    {
        public Languages()
        {
            Client = new HashSet<Client>();
            ClientSite = new HashSet<ClientSite>();
            ClientSiteTranslated = new HashSet<ClientSiteTranslated>();
            ClientTranslated = new HashSet<ClientTranslated>();
            CostCentre = new HashSet<CostCentre>();
            CostCentreTranslated = new HashSet<CostCentreTranslated>();
            Country = new HashSet<Country>();
            CountryTranslated = new HashSet<CountryTranslated>();
            Industry = new HashSet<Industry>();
            IndustryTranslated = new HashSet<IndustryTranslated>();
            LookupTranslated = new HashSet<LookupTranslated>();
            Lookups = new HashSet<Lookups>();
            ProgramTranslated = new HashSet<ProgramTranslated>();
            Programs = new HashSet<Programs>();
            RoleGroup = new HashSet<RoleGroup>();
            RoleGroupTranslated = new HashSet<RoleGroupTranslated>();
            Sector = new HashSet<Sector>();
            SectorTranslated = new HashSet<SectorTranslated>();
            SegmentTranslated = new HashSet<SegmentTranslated>();
        }

        public int LanguageId { get; set; }
        public string Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }
        public string CountryCode { get; set; }
        public string Lname { get; set; }

        public Users CreatedByNavigation { get; set; }
        public ICollection<Client> Client { get; set; }
        public ICollection<ClientSite> ClientSite { get; set; }
        public ICollection<ClientSiteTranslated> ClientSiteTranslated { get; set; }
        public ICollection<ClientTranslated> ClientTranslated { get; set; }
        public ICollection<CostCentre> CostCentre { get; set; }
        public ICollection<CostCentreTranslated> CostCentreTranslated { get; set; }
        public ICollection<Country> Country { get; set; }
        public ICollection<CountryTranslated> CountryTranslated { get; set; }
        public ICollection<Industry> Industry { get; set; }
        public ICollection<IndustryTranslated> IndustryTranslated { get; set; }
        public ICollection<LookupTranslated> LookupTranslated { get; set; }
        public ICollection<Lookups> Lookups { get; set; }
        public ICollection<ProgramTranslated> ProgramTranslated { get; set; }
        public ICollection<Programs> Programs { get; set; }
        public ICollection<RoleGroup> RoleGroup { get; set; }
        public ICollection<RoleGroupTranslated> RoleGroupTranslated { get; set; }
        public ICollection<Sector> Sector { get; set; }
        public ICollection<SectorTranslated> SectorTranslated { get; set; }
        public ICollection<SegmentTranslated> SegmentTranslated { get; set; }
    }
}

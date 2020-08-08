using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class Users
    {
        public Users()
        {
            Client = new HashSet<Client>();
            ClientSite = new HashSet<ClientSite>();
            ClientSiteTranslated = new HashSet<ClientSiteTranslated>();
            ClientTranslated = new HashSet<ClientTranslated>();
            Cmssetup = new HashSet<Cmssetup>();
            CostCentre = new HashSet<CostCentre>();
            CostCentreTranslated = new HashSet<CostCentreTranslated>();
            Country = new HashSet<Country>();
            CountryTranslated = new HashSet<CountryTranslated>();
            Industry = new HashSet<Industry>();
            IndustryTranslated = new HashSet<IndustryTranslated>();
            Languages = new HashSet<Languages>();
            LookupTranslated = new HashSet<LookupTranslated>();
            Lookups = new HashSet<Lookups>();
            ProgramRoleRelation = new HashSet<ProgramRoleRelation>();
            ProgramTranslated = new HashSet<ProgramTranslated>();
            Programs = new HashSet<Programs>();
            Role = new HashSet<Role>();
            RoleGroup = new HashSet<RoleGroup>();
            RoleGroupRoleRelation = new HashSet<RoleGroupRoleRelation>();
            RoleGroupTranslated = new HashSet<RoleGroupTranslated>();
            Sector = new HashSet<Sector>();
            SectorTranslated = new HashSet<SectorTranslated>();
            Segment = new HashSet<Segment>();
            SegmentTranslated = new HashSet<SegmentTranslated>();
            UserClientSiteRelationCreatedByNavigation = new HashSet<UserClientSiteRelation>();
            UserClientSiteRelationUser = new HashSet<UserClientSiteRelation>();
            UserRoleGroupRelationCreatedByNavigation = new HashSet<UserRoleGroupRelation>();
            UserRoleGroupRelationUser = new HashSet<UserRoleGroupRelation>();
        }

        public int UserId { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public int? UserType { get; set; }
        public string Mobile { get; set; }
        public string Phone { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }

        public Lookups UserTypeNavigation { get; set; }
        public ICollection<Client> Client { get; set; }
        public ICollection<ClientSite> ClientSite { get; set; }
        public ICollection<ClientSiteTranslated> ClientSiteTranslated { get; set; }
        public ICollection<ClientTranslated> ClientTranslated { get; set; }
        public ICollection<Cmssetup> Cmssetup { get; set; }
        public ICollection<CostCentre> CostCentre { get; set; }
        public ICollection<CostCentreTranslated> CostCentreTranslated { get; set; }
        public ICollection<Country> Country { get; set; }
        public ICollection<CountryTranslated> CountryTranslated { get; set; }
        public ICollection<Industry> Industry { get; set; }
        public ICollection<IndustryTranslated> IndustryTranslated { get; set; }
        public ICollection<Languages> Languages { get; set; }
        public ICollection<LookupTranslated> LookupTranslated { get; set; }
        public ICollection<Lookups> Lookups { get; set; }
        public ICollection<ProgramRoleRelation> ProgramRoleRelation { get; set; }
        public ICollection<ProgramTranslated> ProgramTranslated { get; set; }
        public ICollection<Programs> Programs { get; set; }
        public ICollection<Role> Role { get; set; }
        public ICollection<RoleGroup> RoleGroup { get; set; }
        public ICollection<RoleGroupRoleRelation> RoleGroupRoleRelation { get; set; }
        public ICollection<RoleGroupTranslated> RoleGroupTranslated { get; set; }
        public ICollection<Sector> Sector { get; set; }
        public ICollection<SectorTranslated> SectorTranslated { get; set; }
        public ICollection<Segment> Segment { get; set; }
        public ICollection<SegmentTranslated> SegmentTranslated { get; set; }
        public ICollection<UserClientSiteRelation> UserClientSiteRelationCreatedByNavigation { get; set; }
        public ICollection<UserClientSiteRelation> UserClientSiteRelationUser { get; set; }
        public ICollection<UserRoleGroupRelation> UserRoleGroupRelationCreatedByNavigation { get; set; }
        public ICollection<UserRoleGroupRelation> UserRoleGroupRelationUser { get; set; }
    }
}

using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class Country
    {
        public Country()
        {
            CostCentre = new HashSet<CostCentre>();
            CountryTranslated = new HashSet<CountryTranslated>();
            LookupTranslated = new HashSet<LookupTranslated>();
            Programs = new HashSet<Programs>();
            RoleGroup = new HashSet<RoleGroup>();
        }

        public int CountryId { get; set; }
        public int CreatedLanguageId { get; set; }
        public string Active { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string CountryCode { get; set; }

        public Users CreatedByNavigation { get; set; }
        public Languages CreatedLanguage { get; set; }
        public ICollection<CostCentre> CostCentre { get; set; }
        public ICollection<CountryTranslated> CountryTranslated { get; set; }
        public ICollection<LookupTranslated> LookupTranslated { get; set; }
        public ICollection<Programs> Programs { get; set; }
        public ICollection<RoleGroup> RoleGroup { get; set; }
    }
}

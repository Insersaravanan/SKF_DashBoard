using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class LookupTranslated
    {
        public int LookupTid { get; set; }
        public int LanguageId { get; set; }
        public int LookupId { get; set; }
        public string Lvalue { get; set; }
        public string Lname { get; set; }
        public int CountryId { get; set; }
        public int CreatedBy { get; set; }
        public DateTime CreatedOn { get; set; }
        public string Descriptions { get; set; }

        public Country Country { get; set; }
        public Users CreatedByNavigation { get; set; }
        public Languages Language { get; set; }
        public Lookups Lookup { get; set; }
    }
}

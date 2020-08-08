using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class CountryTranslated
    {
        public int CountryTid { get; set; }
        public int CountryId { get; set; }
        public int LanguageId { get; set; }
        public string CountryName { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }

        public Country Country { get; set; }
        public Users CreatedByNavigation { get; set; }
        public Languages Language { get; set; }
    }
}

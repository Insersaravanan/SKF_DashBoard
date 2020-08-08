using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class CountryViewModel
    {
        public int CountryId { get; set; }
        public int CreatedLanguageId { get; set; }
        public string CountryCode { get; set; }
        public int CountryTid { get; set; }
        public int LanguageId { get; set; }
        public string CountryName { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }
        public DateTime CreatedOn { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class LookupsViewModel
    {
        public int LookupId { get; set; }
        public int LanguageId { get; set; }
        public string LookupCode { get; set; }
        public string Lname { get; set; }
        public string Lvalue { get; set; }
        public int? ListOrder { get; set; }
        public string Descriptions { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }
    }
}

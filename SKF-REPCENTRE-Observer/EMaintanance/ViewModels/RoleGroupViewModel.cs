using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class RoleGroupViewModel
    {
        public int RoleGroupId { get; set; }
        public int LanguageId { get; set; }
        public int CountryId { get; set; }
        public string RoleGroupName { get; set; }
        public string Descriptions { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }
    }
}

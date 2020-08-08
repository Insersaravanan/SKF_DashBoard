using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class PrivilegeViewModel
    {
        public int PrivilegeId { get; set; }
        public String PrivilegeCode { get; set; }
        public String PrivilegeName { get; set; }
        public string Active { get; set; }
        public string Status { get; set; }
        public int UserId { get; set; }
    }
}

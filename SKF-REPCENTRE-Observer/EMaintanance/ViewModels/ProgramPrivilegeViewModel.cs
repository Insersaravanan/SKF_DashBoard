using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ProgramPrivilegeViewModel
    {
        public int ProgramId { get; set; }
        public List<ProgramPrivilageRelations> programPrivilageRelations { get; set; }
        public int UserId { get; internal set; }
    }

    public class ProgramPrivilageRelations
    {
        public int Privilegeid { get; set; }
        public string PrivilegeName { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }
    }
}

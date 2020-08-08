using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class RolePrgPrivViewModel
    {
        public int RoleId { get; set; }
        public int UserId { get; set; }
        public List<ProgramRelations> Programs { get; set; }
    }

    public class ProgramRelations
    {
        public int ProgramId { get; set; }
        public string ProgramName { get; set; }
        public string Active { get; set; }
        public string HideProgram { get; set; }
        public List<PrivilegeRelations> Privileges { get; set; }
    }

    public class PrivilegeRelations
    {
        public int PrivilegeId { get; set; }
        public string PrivilegeName { get; set; }
        public string Active { get; set; }
    }
}

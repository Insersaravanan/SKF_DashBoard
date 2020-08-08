using System;
using System.Collections.Generic;

namespace EMaintanance.ViewModels
{
    public partial class RoleViewModel
    {
        public int RoleId { get; set; }
        public string Internal { get; set; }
        public DateTime CreatedOn { get; set; }
        public int UserId { get; set; }
        public string RoleName { get; set; }
        public string Descriptions { get; set; }
        public string Active { get; set; }
    }
}

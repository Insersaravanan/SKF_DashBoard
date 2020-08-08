using System;
using System.Collections.Generic;

namespace EMaintanance.ViewModels
{
    public partial class ProgramViewModel
    {
        public int ProgramId { get; set; }
        public int LanguageId { get; set; }
        public string ProgramCode { get; set; }
        public int MenuOrder { get; set; }
        public string ControllerName { get; set; }
        public string ProgramName { get; set; }
        public string MenuName { get; set; }
        public string IconName { get; set; }
        public string GroupCode { get; set; }
        public string SubGroupCode { get; set; }
        public string Descriptions { get; set; }
        public int? MenuGroupid { get; set; }
        public string Active { get; set; }
        public string LinkUrl { get; set; }
        public string ActionName { get; set; }
        public string Internal { get; set; }
        public int UserId { get; set; }
    }
}

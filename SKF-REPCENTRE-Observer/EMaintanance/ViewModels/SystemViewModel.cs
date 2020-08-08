using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class SystemViewModel
    {
        public int SystemId { get; set; }
        public int PlantAreaId { get; set; }
        public int AreaId { get; set; }
        public int LanguageId { get; set; }
        public string SystemName { get; set; }
        public string Descriptions { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }
        public int? ReturnKey { get; set; }

    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class AssertTypeIndustryRelViewModel
    {
        public int AssetTypeId { get; set; }
        public int IndustryId { get; set; }
        public string Active { get; set; }
        public string OriginalActive { get; set; }
        public int UserId { get; set; }
    }
}

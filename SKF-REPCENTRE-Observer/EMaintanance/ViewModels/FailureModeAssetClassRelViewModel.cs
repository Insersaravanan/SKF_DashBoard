using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class FailureModeAssetClassRelViewModel
    {
        public int FailureModeId { get; set; }
        public int AssetClassId { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }
    }
}

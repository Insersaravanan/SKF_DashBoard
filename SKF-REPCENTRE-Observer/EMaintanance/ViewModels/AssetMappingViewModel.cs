using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class AssetMappingViewModel
    {
        public string AssetType { get; set; }
        public string ObserverNodeName { get; set; }
        public int? ObserverNodeId { get; set; }
        public string ObserverNodePath { get; set; }
        public int AssetId { get; set; }
    }
}

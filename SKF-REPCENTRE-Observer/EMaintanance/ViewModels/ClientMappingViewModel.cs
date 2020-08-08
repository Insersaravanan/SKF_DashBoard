using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ClientMappingViewModel
    {
        public int? ObserverDBId { get; set; }
        public string ObserverDBName { get; set; }
        public int? ObserverNodeId { get; set; }
        public string ObserverNodeName { get; set; }
        public int ClientSiteId { get; set; }
        public string ObserverNodePath { get; set; }
        public int SectorId { get; set; }
    }
}

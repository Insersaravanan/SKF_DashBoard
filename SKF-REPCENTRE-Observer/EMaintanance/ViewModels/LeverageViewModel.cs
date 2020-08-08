using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class LeverageViewModel
    {
        public int JobEquipmentId { get; set; }
        public string LSQuoteReference { get; set; }
        public string LSQuoteAmount { get; set; }
        public int LSQuoteStatusId { get; set; }
        public string LSQuoteComment { get; set; }
        public string LSFileName { get; set; }
        public string LSLogicalName { get; set; }
        public string LSPhysicalPath { get; set; }
        public int UserId { get; set; }
        public List<LeverageServices> LeverageServices { get; set; }
    }

    public class LeverageServices
    {
        public int LeverageServiceId { get; set; }
        public int OpportunityTypeId { get; set; }
        public string OpportunityType { get; set; }
        public string Descriptions { get; set; }
        public string Active { get; set; }
    }
}

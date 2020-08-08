using EMaintanance.Models;
using System.Collections.Generic;

namespace EMaintanance.Repository
{
    public class EngineeringUnitModel
    {
        public int EngineeringId { get; set; }
        public int LanguageId { get; set; }
        public string EngineeringCode { get; set; }
        public string EngineeringName { get; set; }
        public int MinimumRange { get; set; }
        public int MaximumRange { get; set; }
        public string Active { get; set; }

        public int UserId { get; set; }
        //  public ICollection<Segment> Segment { get; set; }
    }
}
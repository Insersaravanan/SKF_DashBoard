using EMaintanance.Models;
using System.Collections.Generic;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class FeedBackREPOnlineModel
    {
        public FeedBackREPOnlineModel()
        {
            //Segment = new HashSet<Segment>();
        }

        public int FeedBackREPOnlineId { get; set; }
        public string Subject { get; set; }
        public string EmailID { get; set; }
        public string MessageDetails { get; set; }
        public string Active { get; set; }

        public DateTime? FeedBackFromDate { get; set; }
        public DateTime? FeedBackToDate { get; set; }

        public int UserId { get; set; }
        //  public ICollection<Segment> Segment { get; set; }
    }
}
using System;
using System.Collections.Generic;

namespace EMaintanance.Models
{
    public partial class UserClientSiteRelation
    {
        public int UserClientSiteRelationId { get; set; }
        public int UserId { get; set; }
        public int ClientSiteId { get; set; }
        public string Active { get; set; }
        public DateTime CreatedOn { get; set; }
        public int CreatedBy { get; set; }

        public ClientSite ClientSite { get; set; }
        public Users CreatedByNavigation { get; set; }
        public Users User { get; set; }
    }
}

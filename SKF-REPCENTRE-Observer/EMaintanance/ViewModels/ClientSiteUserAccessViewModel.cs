using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ClientSiteUserAccessParsedViewModel
    {
        public int LoginUserId { get; set; }
        public int UserId { get; set; }
        public string Active { get; set; }
        public int ClientSiteId { get; set; }
    }

    public class ClientSiteUserAccessViewModel
    {
        public int ClientSiteId { get; set; }
        public List<UserInfoViewModel> AssignedUsers { get; set; }
    }

    public class UserInfoViewModel
    {
        public int UserId { get; set; }
        public string UserName { get; set; }
    }
}

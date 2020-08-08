using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class UsersViewModel
    {
        public string Id { get; set; }
        public int UserId { get; set; }
        public int LanguageId { get; set; }
        public string Password { get; set; }
        public string UserName { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string EmailId { get; set; }
        public int? UserTypeId { get; set; }
        public int? UserStatusId { get; set; }
        public string Mobile { get; set; }
        public string Phone { get; set; }
        public int CreatedUserId { get; set; }
        public DateTime CreatedOn { get; set; }
        public string ApplicationBaseURL { get; set; }
        public string Active { get; set; }
        public int ReturnKey { get; set; } = 0;
    }
}

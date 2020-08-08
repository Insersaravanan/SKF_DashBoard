using EMaintanance.Repository;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Services
{
    public class AuditLogService
    {
        private readonly HttpContext _httpContext;
        private IConfiguration _configuration;
        private readonly AuditLogRepo auditLogRepo;
        private readonly Utility util;

        public AuditLogService(HttpContext httpContext, IConfiguration configuration)
        {
            _httpContext = httpContext;
            _configuration = configuration;
            util = new Utility(configuration);
            auditLogRepo = new AuditLogRepo(configuration);
        }

        public async Task<dynamic> LogActivity(int UserId, string HostIP, string SessionId, string CurrentPage, string Activity)
        {
            try
            {
                AuditLogViewModel alvm = new AuditLogViewModel();
                alvm.CurrentPage = CurrentPage;
                alvm.UserId = UserId;
                alvm.HostIP = HostIP;
                alvm.SessionId = SessionId;
                alvm.IsForceLogout = "N";
                alvm.CurrentPage = CurrentPage;
                alvm.Activity = Activity;

                return await auditLogRepo.SaveOrUpdate(alvm);
            }
            catch (Exception)
            {
                // Catch and Log Here Something.
            }
            return null;
        }
    }
}

using Dapper;
using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using EMaintananceApi.Utils;
using Microsoft.AspNetCore.Identity.UI.Services;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Threading.Tasks;

namespace EMaintanance.Areas.Identity.Services
{
    public class EmailSender : IEmailSender
    {
        private IConfiguration _configuration;
        private readonly ApplicationConfigurationRepo appConfigRepo;
        private readonly Utility util;

        // Get our parameterized configuration
        public EmailSender(IConfiguration configuration)
        {
            _configuration = configuration;
            util = new Utility(configuration);
            appConfigRepo = new ApplicationConfigurationRepo(configuration);
        }

        public Task SendEmailAsync(string email, string subject, string htmlMessage)
        {
            ApplicationConfigurationViewModel appConfig = null;
            EmailConfiguration emailConfig = new EmailConfiguration();

            appConfig = appConfigRepo.GetAppConfigByNameNonAsync("SMTP_URL", "Y");
            emailConfig.Host = appConfig.AppConfigValue;
            appConfig = appConfigRepo.GetAppConfigByNameNonAsync("SMTP_UN", "Y");
            emailConfig.UserName = appConfig.AppConfigValue;
            appConfig = appConfigRepo.GetAppConfigByNameNonAsync("SMTP_PWD", "Y");
            emailConfig.Password = CustomUtils.DecodeFromBase64(appConfig.AppConfigValue);
            appConfig = appConfigRepo.GetAppConfigByNameNonAsync("SMTP_PORT", "Y");
            emailConfig.Port = Int32.Parse(appConfig.AppConfigValue);
            appConfig = appConfigRepo.GetAppConfigByNameNonAsync("SMTP_ENABLE_SSL", "Y");
            emailConfig.EnableSSL = bool.Parse(appConfig.AppConfigValue);

            var client = new SmtpClient(emailConfig.Host, emailConfig.Port)
            {
                Credentials = new NetworkCredential(emailConfig.UserName, emailConfig.Password),
                EnableSsl = emailConfig.EnableSSL
            };

            return client.SendMailAsync(
                new MailMessage(emailConfig.UserName, email, subject, htmlMessage) { IsBodyHtml = true }
            );
        }
    }

    public class EmailConfiguration
    {
        public string Host { get; set; }
        public int Port { get; set; }
        public bool EnableSSL { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
    }
}
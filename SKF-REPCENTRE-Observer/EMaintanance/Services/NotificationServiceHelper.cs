using EMaintanance.Models;
using EMaintanance.Repository;
using EMaintanance.ViewModels;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Services
{
    public class NotificationServiceHelper
    {
        private IConfiguration _configuration;
        private readonly EmailService emailService;
        private readonly CMSRepo cmsRepo;

        public NotificationServiceHelper(IConfiguration configuration)
        {
            _configuration = configuration;
            emailService = new EmailService(configuration);
            cmsRepo = new CMSRepo(configuration);
        }

        public async Task<dynamic> PrepareUserEmailNotification(string UserName, string UserEmail, string ActivationURL)
        {
            EmailViewModel emailViewModel = new EmailViewModel();
            List<EmailAttributesViewModel> eavms = new List<EmailAttributesViewModel>();
            EmailAttributesViewModel eavm = new EmailAttributesViewModel
            {
                Name = UserName,
                EmailId = UserEmail
            };
            eavms.Add(eavm);
            emailViewModel.ToEmailList = eavms;
            emailViewModel.Subject = "Account Activation";
            Cmssetup cmssetup = await cmsRepo.GetContentByTypeCode("O_UA");
            string EmailBody = cmssetup.TypeText.Replace("$@USER_NAME@$", UserName).Replace("$@USER_EMAIL@$", UserEmail).Replace("$@USER_MAIL_ACTIVATION_URL@$", ActivationURL);
            emailViewModel.Body = EmailBody;

            return await emailService.SendInvite(emailViewModel); ;
        }

        public async Task<dynamic> PrepareUserPasswordNotification(string UserName, string UserEmail, string Password, string BaseUrl)
        {
            EmailViewModel emailViewModel = new EmailViewModel();
            List<EmailAttributesViewModel> eavms = new List<EmailAttributesViewModel>();
            EmailAttributesViewModel eavm = new EmailAttributesViewModel
            {
                Name = UserName,
                EmailId = UserEmail
            };
            eavms.Add(eavm);
            emailViewModel.ToEmailList = eavms;
            emailViewModel.Subject = "Account Password";
            Cmssetup cmssetup = await cmsRepo.GetContentByTypeCode("O_UPN");
            string EmailBody = cmssetup.TypeText.Replace("$@USER_NAME@$", UserName).Replace("$@USER_EMAIL@$", UserEmail).Replace("$@USER_PASSWORD@$", Password).Replace("$@SIGN_IN_URL@$", BaseUrl);
            emailViewModel.Body = EmailBody;

            return await emailService.SendInvite(emailViewModel); ;
        }

        public async Task<dynamic> PrepareCalendarNotification(EmailViewModel emailViewModel)
        {
            //EmailViewModel emailViewModel = new EmailViewModel();
            //EmailAttributesViewModel eavm = new EmailAttributesViewModel();
            //List<EmailAttributesViewModel> eavms = new List<EmailAttributesViewModel>();
            //eavm.Name = "Prakash Anban";
            //eavm.EmailId = "prakash.a@insersolutions.com";
            //eavms.Add(eavm);
            //emailViewModel.ToEmailList = eavms;
            //emailViewModel.Location = "JobId - 1212, Plant XYZ";
            //emailViewModel.StartDate = new DateTime();
            //emailViewModel.EndDate = new DateTime();
            //emailViewModel.Subject = "JobId - 1212, Plant XYZ Assinged to Review";
            //emailViewModel.Body = "Review Job - 1212";

            emailViewModel.IsCalendarInvite = true;

            return await emailService.SendInvite(emailViewModel);
        }

        public async Task<dynamic> PrepareEmailNotification(string Type)
        {
            EmailViewModel emailViewModel = new EmailViewModel();
            EmailAttributesViewModel eavm = new EmailAttributesViewModel();
            List<EmailAttributesViewModel> eavms = new List<EmailAttributesViewModel>();
            eavm.Name = "Prakash Anban";
            eavm.EmailId = "prakash.a@insersolutions.com";
            eavms.Add(eavm);
            emailViewModel.ToEmailList = eavms;
            emailViewModel.Subject = "JobId - 1212, Plant XYZ Assinged to Review";
            emailViewModel.Body = "Review Job - 1212";
            emailViewModel.IsCalendarInvite = false;

            return await emailService.SendInvite(emailViewModel);
        }

    }
}

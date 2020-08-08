using Dapper;
using EMaintanance.Repository;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace EMaintanance.Services
{
    public class EmailService
    {

        private IConfiguration _configuration;
        private readonly ApplicationConfigurationRepo appConfigRepo;
        private readonly Utility util;

        public EmailService(IConfiguration configuration)
        {
            _configuration = configuration;
            util = new Utility(configuration);
            appConfigRepo = new ApplicationConfigurationRepo(configuration);
        }

        public async Task<dynamic> SendInvite(EmailViewModel emailViewModel)
        {
            ApplicationConfigurationViewModel appConfig = null;
            string SmtpUrl = null;
            string SmtpUN = null;
            string SmtpPwd = null;
            string SenderEmailId = null;
            int Port = 0;
            bool EnableSsl = false;
            try
            {
                appConfig = await appConfigRepo.GetAppConfigByName("O_SMTP_URL", "Y");
                SmtpUrl = appConfig.AppConfigValue;
                appConfig = await appConfigRepo.GetAppConfigByName("O_SMTP_UN", "Y");
                SmtpUN = appConfig.AppConfigValue;
                appConfig = await appConfigRepo.GetAppConfigByName("O_SMTP_PWD", "Y");
                SmtpPwd = CustomUtils.DecodeFromBase64(appConfig.AppConfigValue);
                appConfig = await appConfigRepo.GetAppConfigByName("O_SMTP_PORT", "Y");
                Port = Int32.Parse(appConfig.AppConfigValue);
                appConfig = await appConfigRepo.GetAppConfigByName("O_SENDER_EMAIL", "Y");
                SenderEmailId = appConfig.AppConfigValue;
                appConfig = await appConfigRepo.GetAppConfigByName("O_SMTP_ENABLE_SSL", "Y");
                EnableSsl = bool.Parse(appConfig.AppConfigValue);

                // Create SMTP Client.
                SmtpClient sc = new SmtpClient(SmtpUrl);
                NetworkCredential nc = new NetworkCredential(SmtpUN, SmtpPwd);
                sc.Port = Port;
                sc.EnableSsl = EnableSsl;
                sc.Credentials = nc;

                // Setup e-mail message
                System.Net.Mail.MailMessage msg = new System.Net.Mail.MailMessage();

                if (emailViewModel.FromEmail != null && emailViewModel.FromEmail.EmailId != null)
                {
                    msg.From = new MailAddress(emailViewModel.FromEmail.EmailId);
                }
                else
                {
                    EmailAttributesViewModel emailAttr = new EmailAttributesViewModel();
                    emailAttr.EmailId = SenderEmailId;
                    emailAttr.Name = SenderEmailId;
                    emailViewModel.FromEmail = emailAttr;
                    msg.From = new MailAddress(SenderEmailId);
                }

                AddToEmails(msg, emailViewModel.ToEmailList);
                ApplicationConfigurationViewModel sub = await appConfigRepo.GetAppConfigByName("O_APP_ENV", "Y");
                if (sub != null && sub.AppConfigValue != null && sub.AppConfigValue != "")
                {
                    emailViewModel.Subject = sub.AppConfigValue+" "+ emailViewModel.Subject;
                    msg.Subject = emailViewModel.Subject;
                    
                }
                else
                {
                    msg.Subject = emailViewModel.Subject;
                }
               
                msg.Body = emailViewModel.Body;
                msg.IsBodyHtml = true;

                if (emailViewModel.Attachments != null && emailViewModel.Attachments.Count > 0)
                {
                    // Need to write code for Attachments.
                }

                // The below method is used to send an Calendar Invite.
                if (emailViewModel.IsCalendarInvite)
                {
                    StringBuilder str = new StringBuilder();
                    str.AppendLine("BEGIN:VCALENDAR");
                    str.AppendLine("PRODID:-//" + emailViewModel.FromEmail.EmailId);
                    str.AppendLine("VERSION:2.0");
                    str.AppendLine("X-WR-TIMEZONE:Asia/Kolkata");
                    str.AppendLine("CALSCALE:GREGORIAN");
                    str.AppendLine("METHOD:REQUEST");
                    str.AppendLine("BEGIN:VEVENT");
                    str.AppendLine(string.Format("SUMMARY:{0}", emailViewModel.Subject));
                    str.AppendLine(string.Format("DESCRIPTION:{0}", emailViewModel.Body));
                    //str.AppendLine("BEGIN:VTIMEZONE");
                    str.AppendLine(string.Format("DTSTART:{0:yyyyMMddTHHmmssZ}", emailViewModel.StartDate.ToUniversalTime().ToString("yyyyMMdd\\THHmmss\\Z")));
                    str.AppendLine(string.Format("DTSTAMP:{0:yyyyMMddTHHmmssZ}", new DateTime().ToUniversalTime().ToString("yyyyMMdd\\THHmmss\\Z")));
                    str.AppendLine(string.Format("DTEND:{0:yyyyMMddTHHmmssZ}", emailViewModel.EndDate.ToUniversalTime().ToString("yyyyMMdd\\THHmmss\\Z")));
                    str.AppendLine("LOCATION:" + emailViewModel.Location);
                    //str.AppendLine("END:VTIMEZONE");
                    str.AppendLine("CLASS:PUBLIC");
                    str.AppendLine("IMPORTANT:0");
                    str.AppendLine("STATUS: CONFIRMED");
                    str.AppendLine("COMMENT:");
                    str.AppendLine(string.Format("UID:{0}", Guid.NewGuid()));
                    str.AppendLine(string.Format("X-ALT-DESC;FMTTYPE=text/html:{0}", emailViewModel.Body));
                    str.AppendLine(string.Format("ORGANIZER;CN=\"{0}\":MAILTO:{0}", emailViewModel.FromEmail.EmailId));

                    foreach (MailAddress emto in msg.To)
                        str.AppendLine(string.Format("ATTENDEE;CN=\"{0}\";CUTYPE=INDIVIDUAL;ROLE=REQ-PARTICIPANT;RSVP=TRUE;PARTSTAT=NEEDS-ACTION:mailto:{1}", emto.DisplayName, emto.Address));
                    //str.AppendLine(string.Format("ATTENDEE;CN=\"{0}\";RSVP=TRUE:mailto:{1}", emto.DisplayName, emto.Address));
                    //str.AppendLine(string.Format("ATTENDEE;CN=\"{0}\";RSVP=TRUE:mailto:{1}", msg.To[0].DisplayName, msg.To[0].Address));
                    str.AppendLine("BEGIN:VALARM");
                    str.AppendLine("TRIGGER:-PT15M");
                    //str.AppendLine("ACTION:DISPLAY");
                    str.AppendLine("ACTION:EMAIL");
                    str.AppendLine("DESCRIPTION:Reminder");
                    str.AppendLine("END:VALARM");
                    str.AppendLine("END:VEVENT");
                    str.AppendLine("END:VCALENDAR");
                    System.Net.Mime.ContentType ct = new System.Net.Mime.ContentType("text/calendar");
                    ct.Parameters.Add("method", "REQUEST");
                    AlternateView avCal = AlternateView.CreateAlternateViewFromString(str.ToString(), ct);
                    msg.AlternateViews.Add(avCal);
                }

                try
                {
                    sc.Send(msg);
                    return "Success";
                }
                catch (Exception ex)
                {
                    return "Fail Reason +++++++++ " + ex;
                }
            }
            catch (Exception e)
            {
                return "" + e;
            }
            return string.Empty;
        }

        public void AddToEmails(MailMessage msg, List<EmailAttributesViewModel> ToEmailList)
        {
            if (ToEmailList != null && ToEmailList.Count > 0)
            {
                foreach (EmailAttributesViewModel eavm in ToEmailList)
                {
                    msg.To.Add(new MailAddress(eavm.EmailId, eavm.Name));
                }

            }
        }

        public async Task<string> GetEmailNotificationTemplate(string Type, int ClientSiteId, int LanguageId, int Id, int UserId)
        {
            using (var conn = util.MasterCon())
            {
                return (String)await conn.QueryFirstAsync<String>("dbo.EAppGetNotification", new { Type, ClientSiteId, LanguageId, Id, UserId }, commandType: CommandType.StoredProcedure);
            }

        }
    }
}

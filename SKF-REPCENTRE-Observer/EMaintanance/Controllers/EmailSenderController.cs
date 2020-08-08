using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    public class EmailSenderController : Controller
    {

        private IConfiguration _configuration;
        private readonly EmailService emailService;

        public EmailSenderController(IConfiguration configuration)
        {
            _configuration = configuration;
            emailService = new EmailService(configuration);
        }

        [HttpPost]
        public async Task<IActionResult> SendEmailInvite([FromBody] EmailViewModel emailViewModel)
        {
            try
            {
                emailViewModel.IsCalendarInvite = true;
                await emailService.SendInvite(emailViewModel);
                return Ok();
            }
            catch (CustomException cex)
            {
                var responseObj = new EmaintenanceMessage(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, responseObj);
            }
            catch (Exception ex)
            {
                return Ok(new EmaintenanceMessage(ex.Message));
            }

        }

        [HttpPost]
        public string EncryptData([FromBody] EncodeNDecodeViewModel endvm)
        {
            if (endvm != null && endvm.Data != null)
            {
                return CustomUtils.EncodeToBase64(endvm.Data);
            }
            else
            {
                return null;
            }
        }

        [HttpPost]
        public string DecryptData([FromBody] EncodeNDecodeViewModel endvm)
        {
            if (endvm != null && endvm.Data != null)
            {
                return CustomUtils.DecodeFromBase64(endvm.Data);
            }
            else
            {
                return null;
            }
        }

        [HttpPost]
        public string SendEmailStandBy([FromBody] EmailViewModel emailViewModel)
        {
            string result = "Message Sent Successfully..!!";
            string senderID = "prakash.a@insersolutions.com";
            const string senderPassword = "Temp#123";
            try
            {
                SmtpClient smtp = new SmtpClient
                {
                    Host = "smtp.zoho.com",
                    Port = 587,
                    DeliveryMethod = SmtpDeliveryMethod.Network,
                    Credentials = new System.Net.NetworkCredential(senderID, senderPassword),
                    Timeout = 30000,
                    EnableSsl = true
                };

                string body = "<html><h1>Account activation</h1><body><p>Dear XXXX,</p><p> Your account xxx@yyy.com has been created by SKF Admin.</p><p> To complete registration, activate your account.</p><p> To activate your account, click the following link: <a>activate your account</a></p><p> Sincerely,</p><p>SKF eMaintenance Team</p></body></html>";
                MailMessage message = new MailMessage();
                message.From = new MailAddress(senderID);
                foreach (EmailAttributesViewModel eavm in emailViewModel.ToEmailList)
                {
                    message.To.Add(new MailAddress(eavm.EmailId, eavm.Name));
                }
                message.Subject = "Activate your Account - Test";
                message.Body = body;
                message.IsBodyHtml = true;
                smtp.Send(message);
            }
            catch (Exception ex)
            {
                result = "Error sending email.!!!";
            }
            return result;
        }

        [HttpPost]
        public String SendEmailInviteStandBy([FromBody] EmailViewModel emailViewModel)
        {
            try
            {
                //Configuration config = WebConfigurationManager.OpenWebConfiguration(HttpContext.Current.Request.ApplicationPath);
                //MailSettingsSectionGroup settings = (MailSettingsSectionGroup)config.GetSectionGroup("system.net/mailSettings");

                SmtpClient sc = new SmtpClient("smtp.zoho.com");

                System.Net.Mail.MailMessage msg = new System.Net.Mail.MailMessage();

                msg.From = new MailAddress("prakash.a@insersolutions.com");
                msg.To.Add(new MailAddress("prakash.a@insersolutions.com", "Prakash Anban"));
                msg.To.Add(new MailAddress("yuvaraj.s@insersolutions.com", "Yuvaraj Sathiyamoorthy"));
                msg.To.Add(new MailAddress("22degreedanger@gmail.com", "Prakash Gmail"));
                msg.Subject = emailViewModel.Subject;
                msg.Body = emailViewModel.Body;

                StringBuilder str = new StringBuilder();
                str.AppendLine("BEGIN:VCALENDAR");
                str.AppendLine("PRODID:-//" + "prakash.a@insersolutions.com");
                str.AppendLine("VERSION:2.0");
                str.AppendLine("METHOD:REQUEST");
                str.AppendLine("BEGIN:VEVENT");

                str.AppendLine(string.Format("DTSTART:{0:yyyyMMddTHHmmssZ}", emailViewModel.StartDate.ToUniversalTime().ToString("yyyyMMdd\\THHmmss\\Z")));
                str.AppendLine(string.Format("DTSTAMP:{0:yyyyMMddTHHmmssZ}", (emailViewModel.EndDate - emailViewModel.StartDate).Minutes.ToString()));
                str.AppendLine(string.Format("DTEND:{0:yyyyMMddTHHmmssZ}", emailViewModel.EndDate.ToUniversalTime().ToString("yyyyMMdd\\THHmmss\\Z")));
                //str.AppendLine(string.Format("DTSTART:{0:yyyyMMddTHHmmssZ}", objApptEmail.StartDate.ToString()));
                //str.AppendLine(string.Format("DTSTAMP:{0:yyyyMMddTHHmmssZ}", DateTime.UtcNow));
                //str.AppendLine(string.Format("DTEND:{0:yyyyMMddTHHmmssZ}", objApptEmail.EndDate.ToString()));
                str.AppendLine("LOCATION:" + emailViewModel.Location);
                str.AppendLine(string.Format("DESCRIPTION:{0}", emailViewModel.Body));
                str.AppendLine(string.Format("X-ALT-DESC;FMTTYPE=text/html:{0}", emailViewModel.Body));
                str.AppendLine(string.Format("SUMMARY:{0}", emailViewModel.Subject));
                str.AppendLine(string.Format("ORGANIZER:MAILTO:{0}", "prakash.a@insersolutions.com"));

                str.AppendLine(string.Format("ATTENDEE;CN=\"{0}\";RSVP=TRUE:mailto:{1}", msg.To[0].DisplayName, msg.To[0].Address));
                str.AppendLine(string.Format("ATTENDEE;CN=\"{0}\";RSVP=TRUE:mailto:{1}", msg.To[1].DisplayName, msg.To[1].Address));
                str.AppendLine(string.Format("ATTENDEE;CN=\"{0}\";RSVP=TRUE:mailto:{1}", msg.To[2].DisplayName, msg.To[2].Address));
                str.AppendLine("BEGIN:VALARM");
                str.AppendLine("TRIGGER:-PT15M");
                str.AppendLine("ACTION:DISPLAY");
                str.AppendLine("DESCRIPTION:Reminder");
                str.AppendLine("END:VALARM");
                str.AppendLine("END:VEVENT");
                str.AppendLine("END:VCALENDAR");
                System.Net.Mime.ContentType ct = new System.Net.Mime.ContentType("text/calendar");
                ct.Parameters.Add("method", "REQUEST");
                AlternateView avCal = AlternateView.CreateAlternateViewFromString(str.ToString(), ct);
                msg.AlternateViews.Add(avCal);
                NetworkCredential nc = new NetworkCredential("prakash.a@insersolutions.com", "Temp#123");
                sc.Port = 587;
                sc.EnableSsl = true;
                sc.Credentials = nc;
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

    }
}

using Dapper;
using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using System;
using System.Collections.Generic;
using System.IO;
using System.Net.Mail;
using System.Linq;
using System.Net;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using Newtonsoft.Json;



namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG61")]
    public class EmailConfigurationController : Controller
    {
        private Utility con;
        private readonly EmailConfigurationRepo emailConfigurationRepo;
        private readonly AlarmEmailNotificationRepo alarmEmailNotificationRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;

        public EmailConfigurationController(IConfiguration configuration)
        {
            _configuration = configuration;
            emailConfigurationRepo = new EmailConfigurationRepo(configuration);
        }

        [SKFAuthorize("PRG61:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetEmailList()
        {
            string sql = "SELECT * FROM EmailConfig";

            using (var conn = con.MasterCon())
            {
                return Ok(conn.Query<EmailConfigurationViewModel>(sql).ToList());
            }
        }

        /** The below method is used to Create Equipment along with DriveUnit (Individual API Service)*/
        [HttpPost]
        [SKFAuthorize("PRG61:P2")]
        public IActionResult Create([FromBody] EmailConfigurationViewModel emvm)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            emvm.CreatedBy = cUser.UserId;
            emvm.Active = "Y";
            string insertQuery = @"INSERT INTO [dbo].[EamilConfig]([GroupName]
                                      ,[EmailList]
                                      ,[MobileNoList]
                                      ,[AlarmInterval]
                                        ,[MinutesCount]
                                        ,[AlarmStatus],
                                        ,[Active]
                                        ,[CreatedBy]) 
                                        VALUES 
                                        (@GroupName, @EmailList, @MobileNoList, @AlarmInterval, @MinutesCount, @AlarmStatus, @Active, @CreatedBy)";

            using (var conn = con.MasterCon())
            {
                return Ok(conn.Execute(insertQuery, emvm));
            }
        }

        [HttpPost]
        [SKFAuthorize("PRG61:P2")]
        public async Task<IActionResult> GenerateJobs(int csId, int ssId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                var sems = (List<AlarmEmailNotificationEntityModel>)await alarmEmailNotificationRepo.GetAlarmEmailNotificationByStatus(csId, ssId, 0, 0, "GenerateJob");
                var equipments = (List<AlarmEmailNotificationEntityModel>)await alarmEmailNotificationRepo.GetEquipmentByAlarmEmailNotificationId(csId, ssId, 0, "GenerateJob");

                if (sems != null && sems.Count > 0)
                {
                    var sem = sems[0];
                    List<JobServicesViewModel> jsvms = null;
                    List<JobEquipmentsViewModel> jevms = null;

                     /** Deserializing the Schedule Equipement Object and Looping into Job Service Object */
                    List<AlarmEmailNotificationEquipmentsViewModel> sevms = JsonConvert.DeserializeObject<List<AlarmEmailNotificationEquipmentsViewModel>>(equipments[0].AlarmEmailNotificationEquipments);
                    if (sevms != null && sevms.Count > 0)
                    {
                        jevms = new List<JobEquipmentsViewModel>();
                        foreach (AlarmEmailNotificationEquipmentsViewModel sevm in sevms)
                        {
                            if (sevm.Active == "Y")
                            {
                                JobEquipmentsViewModel jsvm = new JobEquipmentsViewModel
                                {
                                    JobEquipmentId = 0,
                                    EquipmentId = sevm.EquipmentId,
                                };
                                jevms.Add(jsvm);
                            }
                        }
                    }

                    foreach (DateTime StartDate in DateUtils.GetDatesBetweenRange(sem.StartDate, sem.EndDate, sem.IntervalDays))
                    {
                        //AlarmEmailNotificationEquipmentsViewModel jvm = new AlarmEmailNotificationEquipmentsViewModel
                        //{
                        //    JobId = 0,
                        //    AlarmEmailNotificationSetupId = sem.AlarmEmailNotificationSetupId,
                        //    JobName = sem.AlarmEmailNotificationName,
                        //    ClientSiteId = csId,
                        //    EstStartDate = StartDate,
                        //    EstEndDate = StartDate.AddDays(sem.EstJobDays - 1),
                        //    JobServices = jsvms,
                        //    JobEquipments = jevms,
                        //    UserId = cUser.UserId
                        //};
                        //await EmailConfigurationRepo.SaveOrUpdate(jvm);
                    }
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Jobs", "Job Generated.");
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
        [SKFAuthorize("PRG61:P2")]
        public IActionResult sendMail([FromBody] EmailSendViewModel emvm)
        {
            string SmtpUrl = "smtp.office365.com";
            string SmtpUN = "SKFReliabilitySupport@skf.com";
            string SmtpPwd = "SKF@4321";
            string SenderEmailId = "SKFReliabilitySupport@skf.com";
            int Port = 25;
            bool EnableSsl = true;

            SmtpClient sc = new SmtpClient(SmtpUrl);
            NetworkCredential nc = new NetworkCredential(SmtpUN, SmtpPwd);
            sc.Port = Port;
            sc.EnableSsl = EnableSsl;
            sc.Credentials = nc;

            MailMessage msg = new MailMessage();
            msg.From = new MailAddress(SenderEmailId);
            msg.Subject = emvm.Subject;
            msg.Body = emvm.Body;
            msg.To.Add(new MailAddress(emvm.ToMail));
            //if (emvm.ToEmailList != null && emvm.ToEmailList.Count > 0)
            //{
            //    foreach (EmailsenderAttViewModel eavm in emvm.ToEmailList)
            //    {
            //        msg.To.Add(new MailAddress(eavm.EmailId));
            //    }

            //}
            //msg.to = emvm.ToEmailList
            sc.Send(msg);
            return Ok("Success");
        }
    }
}

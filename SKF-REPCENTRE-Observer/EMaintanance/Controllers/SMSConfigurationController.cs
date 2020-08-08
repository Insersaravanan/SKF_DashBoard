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
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Net.Mail;
using System.Net;
using Newtonsoft.Json;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG62")]
    public class SMSConfigurationController : Controller
    {
        private Utility con;
        private readonly SMSConfigurationRepo SMSConfigurationRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;

        public SMSConfigurationController(IConfiguration configuration)
        {
            _configuration = configuration;
            SMSConfigurationRepo = new SMSConfigurationRepo(configuration);
        }

        [SKFAuthorize("PRG62:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [AllowAnonymous]
        [HttpGet]
        public IActionResult GetSMSlList()
        {
            string sql = "SELECT * FROM EmailConfig";

            using (var conn = con.MasterCon())
            {
                return Ok(conn.Query<SMSConfigurationViewModel>(sql).ToList());
            }
        }

        /** The below method is used to Create Equipment along with DriveUnit (Individual API Service)*/
        //[HttpPost]
        //[SKFAuthorize("PRG62:P1")]
        //public IActionResult Create1([FromBody] SMSConfigurationViewModel emvm)
        //{
        //    CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
        //    emvm.CreatedBy = cUser.UserId;
        //    emvm.Active = "Y";
        //    string insertQuery = @"INSERT INTO [dbo].[EamilConfig]([GroupName]
        //                              ,[EmailList]
        //                              ,[MobileNoList]
        //                              ,[AlarmInterval]
        //                                ,[MinutesCount]
        //                                ,[AlarmStatus],
        //                                ,[Active]
        //                                ,[CreatedBy]) 
        //                                VALUES 
        //                                (@GroupName, @EmailList, @MobileNoList, @AlarmInterval, @MinutesCount, @AlarmStatus, @Active, @CreatedBy)";

        //    using (var conn = con.MasterCon())
        //    {
        //        return Ok(conn.Execute(insertQuery, emvm));
        //    }
        //}
        //[HttpPost]
        //[SKFAuthorize("PRG62:P1")]
        //public async Task<IActionResult> Update([FromBody] SMSConfigurationViewModel svm)
        //{
        //    try
        //    {
        //        return Ok(await SMSConfigurationRepo.SaveOrUpdate(svm));
        //    }
        //    catch (CustomException cex)
        //    {
        //        var returnObj = new EmaintenanceMessage(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
        //        return StatusCode(StatusCodes.Status500InternalServerError, returnObj);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, new EmaintenanceMessage(ex.Message));
        //    }

        //}

        //[HttpPost]
        //[SKFAuthorize("PRG62:P1")]
        //public async Task<IActionResult> Create([FromBody] SMSConfigurationViewModel avm)
        //{
        //    try
        //    {
        //        CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
        //       // avm.GroupName = cUser.UserId;
        //       // avm.AssetSequenceId = 0;
        //        avm.Active = "Y";
        //        return Ok(await SMSConfigurationRepo.SaveOrUpdate(avm));
        //    }
        //    catch (CustomException cex)
        //    {
        //        var returnObj = new EmaintenanceMessage(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
        //        return StatusCode(StatusCodes.Status500InternalServerError, returnObj);
        //    }
        //    catch (Exception ex)
        //    {
        //        return StatusCode(StatusCodes.Status500InternalServerError, new EmaintenanceMessage(ex.Message));
        //    }
        //}

        [HttpGet]
        [SKFAuthorize("PRG62:P1")]
        public async Task<IActionResult> GetAlarmSMSNotificationByStatus(int csId, int ssId, int lId, int statusId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                /* The last parameter is "Mode" which is used to return Dynamic or Specific object Result */
                var result = await SMSConfigurationRepo.GetAlarmSMSNotificationByStatus(csId, ssId, lId, statusId, null);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "SMSConfiguration", "SMSConfiguration list Loaded.");
                return Ok(result);
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

        [HttpGet]
        [SKFAuthorize("PRG62:P1")]
        public async Task<IActionResult> GetEquipmentByAlarmSMSNotificationId(int csId, int scId, int lId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var result = await SMSConfigurationRepo.GetEquipmentByAlarmSMSNotificationId(csId, scId, lId, string.Empty);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "SMSConfiguration", "Loaded Equipments based on selected SMSConfiguration.");
                return Ok(result);
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
        [SKFAuthorize("PRG62:P2")]
        public async Task<IActionResult> Create([FromBody] SMSConfigurationViewModel sscv)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                sscv.AlarmSMSNotificationSetupId = 0;
                sscv.StatusId = 0;
                sscv.UserId = cUser.UserId;
                var result = await SMSConfigurationRepo.SaveOrUpdate(sscv);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "SMSConfiguration", "SMSConfiguration Created.");
                return Ok(result);
            }
            catch (CustomException cex)
            {
                var returnObj = new EmaintenanceMessage(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, returnObj);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new EmaintenanceMessage(ex.Message));
            }
        }

        [HttpPost]
        [SKFAuthorize("PRG62:P3")]
        public async Task<IActionResult> Update([FromBody] SMSConfigurationViewModel sscv)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                sscv.UserId = cUser.UserId;
                var result = await SMSConfigurationRepo.SaveOrUpdate(sscv);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "SMSConfiguration", "SMSConfiguration Modified.");
                return Ok(result);
            }
            catch (CustomException cex)
            {
                var returnObj = new EmaintenanceMessage(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                return StatusCode(StatusCodes.Status500InternalServerError, returnObj);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new EmaintenanceMessage(ex.Message));
            }
        }

        [HttpPost]
        public IActionResult SendSMS([FromBody] SMSConfigurationViewModel emvm)
        {
            //string SmtpUrl = "smtp.office365.com";
            //string SmtpUN = "SKFReliabilitySupport@skf.com";
            //string SmtpPwd = "SKF@4321";
            //string SenderEmailId = "SKFReliabilitySupport@skf.com";
            //int Port = 25;
            //bool EnableSsl = true;

            string SMSMobileNo = emvm.AlarmSMSNotificationID;
            string strmessage  = emvm.AdditionalSMSID;
            //SmtpClient sc = new SmtpClient(SmtpUrl);
            //etworkCredential nc = new NetworkCredential(SmtpUN, SmtpPwd);
            string strUrl = "http://api.mVaayoo.com/mvaayooapi/MessageCompose?user=senthil@znodtech.com:Znod@12613&senderID=TEST SMS&receipientno=" + SMSMobileNo + "&msgtxt='" + strmessage + "'";
            WebRequest request = HttpWebRequest.Create(strUrl);
            HttpWebResponse response = (HttpWebResponse)request.GetResponse();
            Stream s = (Stream)response.GetResponseStream();
            StreamReader readStream = new StreamReader(s);
            string dataString = readStream.ReadToEnd();
            response.Close();
            s.Close();
            readStream.Close();
            return Ok("Success");
        }


    }
}

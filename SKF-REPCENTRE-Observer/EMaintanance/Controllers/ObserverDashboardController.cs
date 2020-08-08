using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Dapper;
using Microsoft.Extensions.Primitives;
using System.IO;
using System.Net.Mail;
using System.Net;
using System.Net.Http.Headers;



namespace EMaintanance.Controllers
{
    //[SKFAuthorize("PRG48")]
    public class ObserverDashboardController : Controller
    {
        private readonly ObserverDashboardRepo observerDashboardRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;
        public ObserverDashboardController(IConfiguration configuration)
        {
            observerDashboardRepo = new ObserverDashboardRepo(configuration);
            _configuration = configuration;
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        //[SKFAuthorize("PRG48:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetFilterListByType(string type, int id)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var userId = cUser.UserId;
                return Ok(await observerDashboardRepo.GetFilterListByType(userId ,type, id));
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
        //[SKFAuthorize("PRG12:P1")]
        public IActionResult GetUserInfo()
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var userId = cUser.UserId;
                return Ok(userId);
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
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetUserRoleID()
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var userId = cUser.UserId;
               // return Ok(userId);
                return Ok(await observerDashboardRepo.GetRoleIDByUserID(userId));
            }
            // }

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
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetSensorReading(string type, int id)
        {
            try
            {
                return Ok(await observerDashboardRepo.GetSensorReading(type, id));
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
        //[SKFAuthorize("PRG48:P1")]
        public async Task<IActionResult> GetDashboardDetails([FromBody] ObserverDashboardViewModel obdvm)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                obdvm.UserId = cUser.UserId;
                var result = await observerDashboardRepo.GetDashboardDetails(obdvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Area", "Area list Loaded.");
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
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetEquipmentConditionHistory(int EId)
        {
            try
            {
                return Ok(await observerDashboardRepo.GetEquipmentConditionHistory(EId));
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
      //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetAssetConditionHistory(string Type ,int Id)
        {
            try
            {
                return Ok(await observerDashboardRepo.GetAssetConditionHistory(Type,Id));
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
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> AssetClassSegmentWise(int Cid, int ClId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
           
            try
            {
                return Ok(await observerDashboardRepo.GetAssetClassBySegmentWise(Cid, ClId, cUser.UserId));
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
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetSegmentByCustomer(int Cid)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                return Ok(await observerDashboardRepo.GetSegmentByCustomer(Cid, cUser.UserId));
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
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetFailureCauseSegmentWise(int? Cid, int? ClId, int? PlId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                return Ok(await observerDashboardRepo.GetFailureCauseSegmentWise(Cid, ClId, cUser.UserId, PlId ));
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
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetEMaintEquipmentPriority([FromBody] ObserverEMaintEquipmentPriorityViewModel obepvm)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                obepvm.UserId = cUser.UserId;
                var result = await observerDashboardRepo.GetEMaintEquipmentPriority(obepvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Area", "Area list Loaded.");
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
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetEMaintJobReport(int cId)
        {
            try
            {
                return Ok(await observerDashboardRepo.GetEMaintJobReport(cId));
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
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetListEquipmentPriority([FromBody] ListEMaintEquipmentPriorityViewModel lepvm)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                lepvm.UserId = cUser.UserId;
                var result = await observerDashboardRepo.GetListEquipmentPriority(lepvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Area", "Area list Loaded.");
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
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetListEquipmentHealth([FromBody] ListEMaintEquipmentHealthViewModel lehvm)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                lehvm.UserId = cUser.UserId;
                //lehvm.ClientSiteId
                var result = await observerDashboardRepo.GetListEquipmentHealth(lehvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Area", "Area list Loaded.");
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
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetAssetClassByAssetDetail([FromBody] ListEMaintAssetClassByAssetIDViewModel lehvm)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                lehvm.AssetName = lehvm.AssetName;
                //lehvm.ClientSiteId
                var result = await observerDashboardRepo.GetAssetClassByAssetDetail(lehvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Area", "Area list Loaded.");
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
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetSegmentByCustomerDetail([FromBody] ListEMaintSectorByCustomerViewModel lehvm)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                lehvm.SectorId = lehvm.SectorId;
                //lehvm.ClientSiteId
                var result = await observerDashboardRepo.GetSegmentByCustomerDetail(lehvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Area", "Area list Loaded.");
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
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetSegmentIDByFailureCauseDetail([FromBody] ListEMaintSectorByCustomerViewModel lehvm)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                lehvm.SectorId = lehvm.SectorId;
                //lehvm.ClientSiteId
                var result = await observerDashboardRepo.GetSegmentiDByFailureCausesDetail(lehvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Area", "Area list Loaded.");
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
        //[SKFAuthorize("PRG12:P1")]
        public async Task<IActionResult> GetSegmentByFailureCauseDetail([FromBody] ListEMaintSectorByFailureCauseViewModel lefvm)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                lefvm.SectorId = lefvm.SectorId;
                //lehvm.ClientSiteId
                var result = await observerDashboardRepo.GetSegmentByFailureCausesDetail(lefvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Area", "Area list Loaded.");
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
        public IActionResult sendMail([FromBody] FeedBackEmailSendViewModel Femvm)
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
            msg.Subject = Femvm.Subject;
            msg.Body = Femvm.Body;
            msg.To.Add(new MailAddress(Femvm.ToMail));
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

        [HttpGet]
        [Route("[action]")]
        public async Task<IActionResult> GetODBs()
        {
            return Ok(await observerDashboardRepo.GetDBs());
        }

        [HttpGet]
        [Route("[action]/{accId}")]
        public async Task<IActionResult> GetOClientGroups(int accId)
        {
            return Ok(await observerDashboardRepo.GetClientGroups(accId));
        }

        [HttpGet]
        [Route("[action]/{accId}/{pId}")]
        public async Task<IActionResult> GetOClients(int accId, int pId)
        {
            return Ok(await observerDashboardRepo.GetClients(accId, pId));
        }

        [HttpGet]
        [Route("[action]/{accId}/{pId}")]
        public async Task<IActionResult> GetOAssets(int accId, int pId)
        {
            return Ok(await observerDashboardRepo.GetAssetsForClient(accId, pId));
        }

        [HttpGet]
        [Route("[action]/{accId}/{pId}")]
        public async Task<IActionResult> GetOSensors(int accId, int pId)
        {
            return Ok(await observerDashboardRepo.GetSensorNodeForAssets(accId, pId));
        }

        [HttpGet]
        [Route("[action]/{accId}/{pId}")]
        public async Task<IActionResult> GetTrendMOMMultiple(int accId, int pId)
        {
            return Ok(await observerDashboardRepo.GetTrendMOMMultiple(accId, pId));
        }

        [HttpGet]
        [Route("[action]/{accId}/{pId}")]
        public async Task<IActionResult> GetTrendMultiple(int accId, int pId)
        {
            return Ok(await observerDashboardRepo.GetTrendMultiple(accId, pId));
        }

    }


}

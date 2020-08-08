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
using Microsoft.Extensions.Primitives;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG44")]
    public class WorkNotificationController : Controller
    {
        private readonly WorkNotificationRepo worknotificationRepo;
        private IConfiguration _configuration;
        private readonly FileUploadService fileUploadService;
        private readonly LookupsRepo lookupRepo;

        public WorkNotificationController(IConfiguration configuration)
        {
            _configuration = configuration;
            worknotificationRepo = new WorkNotificationRepo(configuration);
            fileUploadService = new FileUploadService(configuration);
            lookupRepo = new LookupsRepo(configuration);
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpPost]
        [SKFAuthorize("PRG44:P1")]
        public async Task<IActionResult> GetWorkNotificationByStatus([FromBody] WnSearchViewModel wsvm)

        {
            try
            {
                return Ok(await worknotificationRepo.GetWorkNotificationByStatus(wsvm));
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
        [SKFAuthorize("PRG44:P1")]
        public async Task<IActionResult> GetWNEquipUnitAnalysisByEqId(int csId, int eId, int lId)
        {
            try
            {
                return Ok(await worknotificationRepo.GetWNEquipUnitAnalysisByEqId(csId, eId, lId));

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

        //[HttpGet]
        //public async Task<IActionResult> GetListWNEquipmentCommentById(int eqId, string wnNo, int lId)
        //{
        //    try
        //    {
        //        return Ok(await worknotificationRepo.GetListWNEquipmentCommentById(eqId, wnNo, lId));

        //    }
        //    catch (CustomException cex)
        //    {
        //        var responseObj = new EmaintenanceMessage(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
        //        return StatusCode(StatusCodes.Status500InternalServerError, responseObj);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Ok(new EmaintenanceMessage(ex.Message));
        //    }
        //}

        //[HttpGet]
        //public async Task<IActionResult> GetListWNAttachmentsById(int eqId, string status)
        //{
        //    try
        //    {
        //        return Ok(await worknotificationRepo.GetListWNAttachmentsById(eqId, status));

        //    }
        //    catch (CustomException cex)
        //    {
        //        var responseObj = new EmaintenanceMessage(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
        //        return StatusCode(StatusCodes.Status500InternalServerError, responseObj);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Ok(new EmaintenanceMessage(ex.Message));
        //    }
        //}

        [HttpGet]
        [SKFAuthorize("PRG44:P1")]
        public async Task<IActionResult> GetListWNEquipmentOpportunity(int eqId, int lId)
        {
            try
            {
                return Ok(await worknotificationRepo.GetListWNEquipmentOpportunity(eqId, lId));

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
        [SKFAuthorize("PRG44:P1")]
        public async Task<IActionResult> GetLoadWNListItem(string type,int lId, int sId, int csId)
        {
            try
            {
                return Ok(await worknotificationRepo.GetLoadWNListItem(type, lId, sId, csId));

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
        [SKFAuthorize("PRG49:P2")]
        public async Task<IActionResult> SaveWNUnitAnalysis([FromBody] List<WorkNotificationUnitViewModel> frvms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (WorkNotificationUnitViewModel frvm in frvms)
                {
                    frvm.UserId = cUser.UserId;
                    await worknotificationRepo.SaveWNUnitAnalysis(frvm);
                }
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
        [SKFAuthorize("PRG49:P3")]
        public async Task<IActionResult> CancelWNUnitAnalysis([FromBody] List<CancelWorkNotificationUnitViewModel> cwnvms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (CancelWorkNotificationUnitViewModel cwnvm in cwnvms)
                {
                    await worknotificationRepo.CancelWNUnitAnalysis(cwnvm);
                }
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
        [SKFAuthorize("PRG49:P2")]
        public async Task<IActionResult> SaveWNEquipmentOpportunity([FromBody] List<WnEqOpportunityViewModel> weovms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (WnEqOpportunityViewModel weovm in weovms)
                {
                    weovm.UserId = cUser.UserId;
                    await worknotificationRepo.SaveWNEquipmentOpportunity(weovm);
                }
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
        [SKFAuthorize("PRG49:P2")]
        public async Task<IActionResult> SaveWorkNoficationFeedBack([FromBody] WnFeedbackViewModel wfvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                wfvm.UserId = cUser.UserId;
                return Ok(await worknotificationRepo.SaveWorkNoficationFeedBack(wfvm));
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
        [SKFAuthorize("PRG49:P2")]
        public async Task<IActionResult> WorkNoficationOpenExcelDownload([FromBody] WnSearchViewModel scmvm)
        {
            try
            {
                return Ok(await worknotificationRepo.GetWorkNotificationOpenExportExcel(scmvm));
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

        

        //[HttpPost]
        //public async Task<IActionResult> SaveWNEquipmentAttachments([FromBody] List<WorkNotificationViewModel> frvms)
        //{
        //    try
        //    {
        //        CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
        //        foreach (WorkNotificationViewModel frvm in frvms)
        //        {
        //            frvm.UserId = cUser.UserId;
        //            await worknotificationRepo.SaveWNUnitAnalysis(frvm);
        //        }
        //        return Ok();
        //    }
        //    catch (CustomException cex)
        //    {
        //        var responseObj = new EmaintenanceMessage(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
        //        return StatusCode(StatusCodes.Status500InternalServerError, responseObj);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Ok(new EmaintenanceMessage(ex.Message));
        //    }
        //}

        //[HttpPost]
        //public async Task<IActionResult> UploadFiles()
        //{
        //    try
        //    {
        //        CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

        //        var customHeaders = Request.Headers;
        //        StringValues aId = "";
        //        StringValues Type = "";
        //        if (customHeaders.ContainsKey("aId") && customHeaders.ContainsKey("Type"))
        //        {
        //            customHeaders.TryGetValue("aId", out aId);
        //            customHeaders.TryGetValue("Type", out Type);
        //            List<FileUploadViewModel> fuvms = await fileUploadService.UploadFiles(Request, HttpContext);
        //            foreach (FileUploadViewModel fuvm in fuvms)
        //            {
        //                await worknotificationRepo.SaveWNEquipmentAttachments(Type, Int32.Parse(aId), 0, fuvm.OriginalFileName, fuvm.LogicalFileName, fuvm.PhysicalFilePath, "Y", cUser.UserId);
        //            }
        //        }

        //        return Json("Success");
        //    }
        //    catch (CustomException cex)
        //    {
        //        var responseObj = new EmaintenanceMessage(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
        //        return StatusCode(StatusCodes.Status500InternalServerError, responseObj);
        //    }
        //    catch (Exception ex)
        //    {
        //        return Ok(new EmaintenanceMessage(ex.Message));
        //    }
        //}

    }
}

using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Primitives;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG37")]
    public class ReportFeederController : Controller
    {

        private readonly JobRepo jobRepo;
        private readonly ReportFeederRepo reportFeederRepo;
        private IConfiguration _configuration;
        private readonly FileUploadService fileUploadService;
        private readonly AuditLogService auditLogService;

        public ReportFeederController(IConfiguration configuration)
        {
            _configuration = configuration;
            jobRepo = new JobRepo(configuration);
            reportFeederRepo = new ReportFeederRepo(configuration);
            fileUploadService = new FileUploadService(configuration);
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        [SKFAuthorize("PRG37:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG37:P1")]
        public async Task<IActionResult> GetAllAssignedJobs(int csId, int jId, int ssId, int lId, int statusId, DateTime esDate, DateTime? eeDate, int? jNo)

        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await jobRepo.GetAllAssignedJobs(csId, cUser.UserId, jId, ssId, lId, statusId, esDate, eeDate, jNo);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Create Report", "List of Job(s) loaded for the Assigned User.");
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
        [SKFAuthorize("PRG37:P1")]
        public async Task<IActionResult> GetJobEquipUnitUnselected(int jeId, int lId)

        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                return Ok(await reportFeederRepo.GetJobEquipUnitUnselected(jeId, lId));
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
        [SKFAuthorize("PRG37:P1")]
        public async Task<IActionResult> GetCommentsByType(string type, int jId, int lId)
        {
            try
            {
                if (type == null && type == "")
                {
                    throw new CustomException("Please select valid type for comments", "Error", true, "Type(s) are Job, Equipment and UnitAnalysis and it is mandatory to Save Comments.");
                }
                else
                {
                    if (type == "J")
                    {
                        return Ok(await reportFeederRepo.GetJobCommentsById(jId, lId));
                    }
                    else if (type == "E")
                    {
                        return Ok(await reportFeederRepo.GetEquipmentCommentsById(jId, lId));
                    }
                    else if (type == "U")
                    {
                        return Ok(await reportFeederRepo.GetEquipUnitCommentsById(jId, lId));
                    }
                    else
                    {
                        throw new CustomException("Please select valid type for comments", "Error", true, "Type(s) are Job, Equipment and UnitAnalysis and it is mandatory to Load Comments.");
                    }
                }
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
        [SKFAuthorize("PRG37:P1")]
        public async Task<IActionResult> GetStatusByRole(string type, int csId, int lId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await reportFeederRepo.GetStatusByRoleId(type, cUser.UserId, csId, lId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Create Report", "Loaded role based Status.");
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
        [SKFAuthorize("PRG37:P1")]
        public async Task<IActionResult> GetStatusEquipmentByRole(int csId, int lId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                return Ok(await reportFeederRepo.GetStatusEqByRoleId(cUser.UserId, csId, lId));
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
        [SKFAuthorize("PRG37:P2")]
        public async Task<IActionResult> CreateComments([FromBody] JobStatusCommentsViewModel jscvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                jscvm.CommentId = 0;
                jscvm.Active = "Y";
                jscvm.UserId = cUser.UserId;

                if (jscvm.Type == null && jscvm.Type == "")
                {
                    throw new CustomException("Please select valid type for comments", "Error", true, "Type(s) are Job, Equipment and UnitAnalysis and it is mandatory to Save Comments.");
                }
                else
                {
                    if (jscvm.Type == "J")
                    {
                        var result = await reportFeederRepo.SaveJobComments(jscvm);
                        await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Create Report", "Comments Created for Job.");
                        return Ok(result);
                    }
                    else if (jscvm.Type == "E")
                    {
                        var result = await reportFeederRepo.SaveEquipmentComments(jscvm);
                        await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Create Report", "Comments Created for Equipment.");
                        return Ok(result);
                    }
                    else if (jscvm.Type == "U")
                    {
                        var result = await reportFeederRepo.SaveUnitAnalysisComments(jscvm);
                        await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Create Report", "Comments Created for Unit.");
                        return Ok(result);
                    }
                    else
                    {
                        throw new CustomException("Please select valid type for comments", "Error", true, "Type(s) are Job, Equipment and UnitAnalysis and it is mandatory to Save Comments.");
                    }
                }

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

        [HttpGet]
        [SKFAuthorize("PRG37:P1")]
        public async Task<IActionResult> GetEquipmentsByJob(int jId, int lId, int statusId, int ServiceId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await reportFeederRepo.GetEquipmentsByJobId(jId, lId, statusId, ServiceId, cUser.UserId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Create Report", "Loaded Equipments by selected Job.");
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
        [SKFAuthorize("PRG37:P1")]
        public async Task<IActionResult> GetUnitsByEquipment(int jId, int lId, int statusId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await reportFeederRepo.GetUnitsByEquipmentId(jId, lId, statusId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Create Report", "Loaded Units by selected Equipment.");
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
        [SKFAuthorize("PRG37:P1")]
        public async Task<IActionResult> GetAnalysisByUnit(string type, string sType, int uaId, int lId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                JobUnitAnalysisViewModel juavm = (JobUnitAnalysisViewModel)await reportFeederRepo.GetUnitAnalysisById(uaId, type, sType, lId);
                if (juavm.JobUnitSymptomsListJson != null)
                {
                    juavm.JobUnitSymptomsList = JsonConvert.DeserializeObject<List<JobUnitSymptomsViewModel>>(juavm.JobUnitSymptomsListJson);
                }
                if (juavm.JobUnitAmplitudeListJson != null)
                {
                    juavm.JobUnitAmplitudeList = JsonConvert.DeserializeObject<List<JobUnitAmplitudeViewModel>>(juavm.JobUnitAmplitudeListJson);
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Create Report", "Loaded Analysis (Vibration / Oil) Report Data by selected Unit.");
                return Ok(juavm);
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
        [SKFAuthorize("PRG37:P1")]
        public async Task<IActionResult> GetSymptomsByUnitAnalysis(string type, string sType, int lId)
        {
            try
            {
                return Ok(await reportFeederRepo.GetSymptomsByUnitAnalysis(type, sType, lId));

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
        [SKFAuthorize("PRG37:P1")]
        public async Task<IActionResult> GetOilPropertiesByEquipment(int jeId, int lId)
        {
            try
            {
                return Ok(await reportFeederRepo.GetOilPropertiesByEquipmentId(jeId, lId));

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
        [SKFAuthorize("PRG37:P2")]
        public async Task<IActionResult> Create([FromBody] JobUnitAnalysisViewModel juavm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                juavm.UserId = cUser.UserId;
                //juavm.UnitAnalysisId = 0;
                var result = await reportFeederRepo.SaveOrUpdate(juavm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Create Report", "Report Created.");
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

        //[HttpPost]
        //[SKFAuthorize("PRG37:P3")]
        //public async Task<IActionResult> Update([FromBody] JobUnitAnalysisViewModel juavm)
        //{
        //    try
        //    {
        //        CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
        //        juavm.UserId = cUser.UserId;
        //        return Ok(await reportFeederRepo.SaveOrUpdate(juavm));
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

        [HttpPost]
        [SKFAuthorize("PRG37:P2")]
        public async Task<IActionResult> SaveJobEquipUnitSelected([FromBody] List<JobEquipUnitSelectedViewModel> jeusvms)
        {
            try
            {

                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (JobEquipUnitSelectedViewModel jeusvm in jeusvms)
                {

                    jeusvm.UserId = cUser.UserId;
                    await reportFeederRepo.SaveJobEquipUnitSelected(jeusvm);
                }
                return Ok();
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
        [SKFAuthorize("PRG37:P3")]
        public async Task<IActionResult> UploadFiles()
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                var customHeaders = Request.Headers;
                StringValues aId = "";
                StringValues Type = "";
                if (customHeaders.ContainsKey("aId") && customHeaders.ContainsKey("Type"))
                {
                    customHeaders.TryGetValue("aId", out aId);
                    customHeaders.TryGetValue("Type", out Type);
                    List<FileUploadViewModel> fuvms = await fileUploadService.UploadFiles(Request, HttpContext);
                    foreach (FileUploadViewModel fuvm in fuvms)
                    {
                        await reportFeederRepo.SaveOrUpdateAttachments(Type, Int32.Parse(aId), 0, fuvm.OriginalFileName, fuvm.LogicalFileName, fuvm.PhysicalFilePath, "Y", cUser.UserId);
                    }
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Create Report", "Image Uploaded.");
                return Json("Success");
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
        [SKFAuthorize("PRG37:P1")]
        public async Task<IActionResult> GetAttachmentByUnitAnalysis(int uaId, string status)
        {
            try
            {
                return Ok(await reportFeederRepo.GetAttachmentByUnitAnalysisId(uaId, status));

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

        /** The below method is used to Inactive Attachment by Id (Individual API Service) */
        [HttpPost]
        [SKFAuthorize("PRG37:P3")]
        public async Task<IActionResult> DeleteAttachment(string Type, int aId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var result = await reportFeederRepo.SaveOrUpdateAttachments(Type, 0, aId, null, null, null, "N", 0);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Create Report", "Image Deleted.");
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
        [SKFAuthorize("PRG37:P2")]
        public async Task<IActionResult> CreateOilProperties([FromBody] List<JobEquipOilPropertiesViewModel> jeopvms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (JobEquipOilPropertiesViewModel jeopvm in jeopvms)
                {
                    if (jeopvm.JobEquipOilPropertiesId == 0)
                    {
                        jeopvm.JobEquipOilPropertiesId = 0;
                        jeopvm.Active = "Y";
                    }
                    jeopvm.UserId = cUser.UserId;
                    await reportFeederRepo.SaveorUpdateOilProperties(jeopvm);
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Create Report", "Oil Properties Created.");
                return Ok();
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
        [SKFAuthorize("PRG37:P3")]
        public async Task<IActionResult> UpdateOilProperties([FromBody] List<JobEquipOilPropertiesViewModel> jeopvms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (JobEquipOilPropertiesViewModel jeopvm in jeopvms)
                {
                    if (jeopvm.JobEquipOilPropertiesId == 0)
                    {
                        jeopvm.JobEquipOilPropertiesId = 0;
                        jeopvm.Active = "Y";
                    }
                    jeopvm.UserId = cUser.UserId;
                    await reportFeederRepo.SaveorUpdateOilProperties(jeopvm);
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Create Report", "Oil Properties Modified.");
                return Ok();
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

    }
}

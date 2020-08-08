using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
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

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG32")]
    public class EquipmentController : Controller
    {
        private readonly EquipmentRepo equipmentRepo;
        private readonly LookupsRepo lookupRepo;
        private readonly ApplicationConfigurationRepo appConfigRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;
        private readonly FileUploadService fileUploadService;

        public EquipmentController(IConfiguration configuration)
        {
            equipmentRepo = new EquipmentRepo(configuration);
            _configuration = configuration;
            lookupRepo = new LookupsRepo(configuration);
            appConfigRepo = new ApplicationConfigurationRepo(configuration);
            fileUploadService = new FileUploadService(configuration);
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        [SKFAuthorize("PRG32:P1")]
        public IActionResult Index()
        {
            return View();
        }

        /** The below method is used to Load Data based on Type (Individual API Service)*/
        public async Task<IActionResult> GetEquipmentByStatus(int lId, int eId, int csId, int rId, string type, string at, string status)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {

                var result = await equipmentRepo.GetEquipmentByStatus(lId, eId, csId, rId, type, at, status);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Equipment", "Equipment List Loaded");
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

        public async Task<IActionResult> GetListBearingByDesignation(int lId, int uId, string unitType, string type, string queryString)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {

                var result = await equipmentRepo.GetListBearingByDesignation(lId, uId, unitType, type, queryString);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Equipment", "Equipment List Loaded");
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

        public async Task<IActionResult> GetAssetByClientSiteId(int lId, int csId)
        {
            try
            {
                return Ok(await equipmentRepo.GetAssetByClientSiteId(lId, csId));
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
        public async Task<IActionResult> GetEquipmentsByClientSite(int csId, int lId, string status)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await equipmentRepo.GetEquipmentByClientSiteId(csId, lId, status);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Equipment", "Equipment List Loaded");
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
        public async Task<IActionResult> loadEqbyPlantAreaSystem (int PlId, int ArId, int SyId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await equipmentRepo.loadEqbyPlantAreaSystem(PlId, ArId, SyId);
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
        public async Task<IActionResult> GetFailureReportDetail(int eqId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await equipmentRepo.GetFrDetailByEq(eqId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Equipment", "Failure Report Detail Loaded");
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

        /** The below method is used to Create Equipment along with DriveUnit (Individual API Service)*/
        [HttpPost]
        [SKFAuthorize("PRG32:P2")]
        public async Task<IActionResult> Create([FromBody] EquipmentViewModel evm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                evm.UserId = cUser.UserId;
                evm.EquipmentId = 0;
                evm.Active = "Y";
                return Ok(await equipmentRepo.SaveEquipmentWithDrive(evm));
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

        /** The below method is used to Update Equipment (Individual API Service) */
        [HttpPost]
        [SKFAuthorize("PRG32:P3")]
        public async Task<IActionResult> Update([FromBody] EquipmentViewModel evm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await equipmentRepo.SaveOrUpdate(evm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Equipment", "Update Details Loaded");
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

        /** The below method is used to Create DriveUnit (Individual API Service) */
        [HttpPost]
        [SKFAuthorize("PRG32:P2")]
        public async Task<IActionResult> DriveCreate([FromBody] DriveUnitViewModel dvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                dvm.UserId = cUser.UserId;
                dvm.DriveUnitId = 0;
                dvm.Active = "Y";
                return Ok(await equipmentRepo.SaveOrUpdate(dvm));
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

        /** The below method is used to Update DriveUnit (Individual API Service) */
        [HttpPost]
        [SKFAuthorize("PRG32:P3")]
        public async Task<IActionResult> DriveUpdate([FromBody] DriveUnitViewModel dvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                dvm.UserId = cUser.UserId;
                return Ok(await equipmentRepo.SaveOrUpdate(dvm));
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

        /** The below method is used to Create IntermediateUnit (Individual API Service) */
        [HttpPost]
        [SKFAuthorize("PRG32:P2")]
        public async Task<IActionResult> IntermediateCreate([FromBody] IntermediateUnitViewModel ivm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                ivm.UserId = cUser.UserId;
                ivm.IntermediateUnitId = 0;
                ivm.Active = "Y";
                return Ok(await equipmentRepo.SaveOrUpdate(ivm));
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

        /** The below method is used to Update IntermediateUnit (Individual API Service) */
        [HttpPost]
        [SKFAuthorize("PRG32:P3")]
        public async Task<IActionResult> IntermediateUpdate([FromBody] IntermediateUnitViewModel ivm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                ivm.UserId = cUser.UserId;
                return Ok(await equipmentRepo.SaveOrUpdate(ivm));
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

        /** The below method is used to Create DrivenUnit (Individual API Service) */
        [HttpPost]
        [SKFAuthorize("PRG32:P2")]
        public async Task<IActionResult> DrivenCreate([FromBody] DrivenUnitViewModel dvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                dvm.UserId = cUser.UserId;
                dvm.DrivenUnitId = 0;
                dvm.Active = "Y";
                return Ok(await equipmentRepo.SaveOrUpdate(dvm));
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

        /** The below method is used to Update DrivenUnit (Individual API Service) */
        [HttpPost]
        [SKFAuthorize("PRG32:P3")]
        public async Task<IActionResult> DrivenUpdate([FromBody] DrivenUnitViewModel dvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                dvm.UserId = cUser.UserId;
                return Ok(await equipmentRepo.SaveOrUpdate(dvm));
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

        /** The below method is used to Clone or Copy the Units based on their Type (Individual API Service) **/
        [HttpGet]
        [SKFAuthorize("PRG32:P2")]
        public async Task<IActionResult> Clone(string type, int typeId, int plId, int cc, int lId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                return Ok(await equipmentRepo.Clone(type, typeId, plId, cc, cUser.UserId, lId));
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

        /** The below method is used to save the Cloned names **/
        [HttpPost]
        [SKFAuthorize("PRG32:P2")]
        public async Task<IActionResult> SaveCloneIdentifier([FromBody] List<CloneIdentifierViewModel> civms )
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                foreach (CloneIdentifierViewModel civm in civms)
                {
                    await equipmentRepo.SaveCloneIdentifier(civm);
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

        /** The below method is used to Inactive Attachment by Id (Individual API Service) */
        [HttpPost]
        [SKFAuthorize("PRG32:P3")]
        public async Task<IActionResult> DeleteAttachmentById(string Type, int AttachmentId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                var result = await equipmentRepo.SaveOrUpdateAttachments(Type, 0, AttachmentId, null, null, null, "N", 0);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Equipment", "Equipment List Loaded");
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
        [SKFAuthorize("PRG32:P2")]
        public async Task<IActionResult> UploadFilesAjax()
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
                        fuvm.PhysicalFilePath = fuvm.PhysicalFilePath.Replace(@"\", @"/");
                        await equipmentRepo.SaveOrUpdateAttachments(Type, Int32.Parse(aId), 0, fuvm.OriginalFileName, fuvm.LogicalFileName, fuvm.PhysicalFilePath, "Y", cUser.UserId);
                    }
                }

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

    }
}

using EMaintanance.Repository;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG34")]
    public class JobController : Controller
    {

        private readonly ScheduleRepo scheduleRepo;
        private readonly JobRepo jobRepo;
        private IConfiguration _configuration;
        private readonly AuditLogService auditLogService;

        public JobController(IConfiguration configuration)
        {
            _configuration = configuration;
            scheduleRepo = new ScheduleRepo(configuration);
            jobRepo = new JobRepo(configuration);
            auditLogService = new AuditLogService(HttpContext, configuration);
        }

        [SKFAuthorize("PRG34:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG34:P1")]
        public async Task<IActionResult> GetJobByStatus(int csId, int jId, int ssId, int lId, int statusId, DateTime esDate, DateTime? eeDate, int? jNo)

        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var result = await jobRepo.GetJobByStatus(csId, jId, ssId, lId, statusId, esDate, eeDate, jNo);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Jobs", "Job list Loaded.");
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
        [SKFAuthorize("PRG34:P1")]
        public async Task<IActionResult> GetUserJobStatusColour(int jId)

        {
            try
            {
                return Ok(await jobRepo.GetUserJobStatusColour(jId));
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
        [SKFAuthorize("PRG34:P1")]
        public async Task<IActionResult> GetEquipmentByJobId(int csId, int jId, int lId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var result = await jobRepo.GetEquipmentByJobId(csId, jId, lId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Jobs", "Loaded Equipments based on selected Job.");
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
        [SKFAuthorize("PRG34:P1")]
        public async Task<IActionResult> GetJobEquipmentAssignUser(int jId, int lId)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            try
            {
                var result = await jobRepo.GetJobEquipmentAssignUser(jId, lId);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Jobs", "Loaded Equipments based on Assigned User.");
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
        [SKFAuthorize("PRG34:P2")]
        public async Task<IActionResult> Create([FromBody] JobViewModel jvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                jvm.JobId = 0;
                jvm.UserId = cUser.UserId;
                var result = await jobRepo.SaveOrUpdate(jvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Jobs", "Job Created.");
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
        [SKFAuthorize("PRG34:P3")]
        public async Task<IActionResult> Update([FromBody] JobViewModel jvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                jvm.UserId = cUser.UserId;
                var result = await jobRepo.SaveOrUpdate(jvm);
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Jobs", "Job Created.");
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
        [SKFAuthorize("PRG34:P7")]
        public async Task<IActionResult> GenerateJobs(int csId, int ssId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                var sems = (List<ScheduleEntityModel>)await scheduleRepo.GetScheduleByStatus(csId, ssId, 0, 0, "GenerateJob");
                var equipments = (List<ScheduleEntityModel>)await scheduleRepo.GetEquipmentByScheduleId(csId, ssId, 0, "GenerateJob");

                if (sems != null && sems.Count > 0)
                {
                    var sem = sems[0];
                    List<JobServicesViewModel> jsvms = null;
                    List<JobEquipmentsViewModel> jevms = null;

                    /** Deserializing the Schedule Service Object and Looping into Job Service Object */
                    List<ScheduleServicesViewModel> ssvms = JsonConvert.DeserializeObject<List<ScheduleServicesViewModel>>(sem.ScheduleServices);
                    if (ssvms != null && ssvms.Count > 0)
                    {
                        jsvms = new List<JobServicesViewModel>();
                        foreach (ScheduleServicesViewModel ssvm in ssvms)
                        {
                            JobServicesViewModel jsvm = new JobServicesViewModel
                            {
                                JobServiceId = 0,
                                ServiceId = ssvm.ServiceId,
                                ServiceName = ssvm.ServiceName,
                                Active = ssvm.Active,
                                UserId = cUser.UserId
                            };
                            jsvms.Add(jsvm);
                        }
                    }

                    /** Deserializing the Schedule Equipement Object and Looping into Job Service Object */
                    List<ScheduleEquipmentsViewModel> sevms = JsonConvert.DeserializeObject<List<ScheduleEquipmentsViewModel>>(equipments[0].ScheduleEquipments);
                    if (sevms != null && sevms.Count > 0)
                    {
                        jevms = new List<JobEquipmentsViewModel>();
                        foreach (ScheduleEquipmentsViewModel sevm in sevms)
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
                        JobViewModel jvm = new JobViewModel
                        {
                            JobId = 0,
                            ScheduleSetupId = sem.ScheduleSetupId,
                            JobName = sem.ScheduleName,
                            ClientSiteId = csId,
                            EstStartDate = StartDate,
                            EstEndDate = StartDate.AddDays(sem.EstJobDays-1),
                            JobServices = jsvms,
                            JobEquipments = jevms,
                            UserId = cUser.UserId
                        };
                        await jobRepo.SaveOrUpdate(jvm);
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
        [SKFAuthorize("PRG34:P3")]
        public async Task<IActionResult> SaveAssignUser(int aId, int dcId, int dcm, int rId, string tp, [FromBody] List<AssignUsersViewModel> auvms)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                if (auvms != null && auvms.Count > 0 && (aId > 0 || dcId > 0 || rId > 0 || dcm > 0))
                {
                    foreach (AssignUsersViewModel auvm in auvms)
                    {

                        if (tp == "Job")
                        {
                            auvm.Id = auvm.JobId;

                        }
                        else if (tp == "Equipment")
                        {
                            auvm.Id = auvm.JobEquipmentId;
                        }
                        auvm.AnalystId = aId;
                        auvm.Type = tp;
                        auvm.ReviewerId = rId;
                        auvm.DataCollectorId = dcId;
                        auvm.DataCollectionMode = dcm;
                        auvm.UserId = cUser.UserId;

                        await jobRepo.SaveAssignUser(auvm);
                    }
                }
                else
                {
                    throw new CustomException("Unable to Assign Job, Please check whether Valid Job(s) or Assignee Selected.", "Error", true, "Unable to Assign Job, Please check whether Valid Job(s) or Assignee Selected.");
                }
                await auditLogService.LogActivity(cUser.UserId, cUser.HostIP, cUser.SessionId, "Jobs", "User assigned for the Job.");
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

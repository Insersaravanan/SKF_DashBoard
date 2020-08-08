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
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG38")]
    public class LeverageController : Controller
    {
        private readonly LeverageRepo leverageRepo;
        private readonly IConfiguration _configuration;
        private readonly FileUploadService fileUploadService;

        public LeverageController(IConfiguration configuration)
        {
            leverageRepo = new LeverageRepo(configuration);
            _configuration = configuration;
            fileUploadService = new FileUploadService(configuration);
        }

        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public async Task<IActionResult> GetLeverage(DateTime? fromdate, DateTime? todate, int lId)
        {
            try
            {
                return Ok(await leverageRepo.GetLeverage(fromdate, todate, lId));
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
        public async Task<IActionResult> GetLeverageServiceList(int jeId, int lId)
        {
            try
            {
                return Ok(await leverageRepo.GetLeverageServiceList(jeId, lId));
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
        public async Task<IActionResult> Create([FromBody] LeverageViewModel levm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                levm.UserId = cUser.UserId;
                return Ok(await leverageRepo.SaveOrUpdate(levm));
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
                        await leverageRepo.SaveLeverageImage(fuvm.OriginalFileName, fuvm.LogicalFileName, fuvm.PhysicalFilePath, Int32.Parse(aId));
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

        //public async Task<IActionResult> UploadFiles()
        //{
        //    try
        //    {
        //        CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

        //        var customHeaders = Request.Headers;
        //        StringValues aId = "";
        //        StringValues Type = "";
        //        StringValues FileDescription = "";
        //        if (customHeaders.ContainsKey("aId") && customHeaders.ContainsKey("Type"))
        //        {
        //            customHeaders.TryGetValue("aId", out aId);
        //            customHeaders.TryGetValue("Type", out Type);
        //            customHeaders.TryGetValue("fileDescription", out FileDescription);
        //            List<FileUploadViewModel> fuvms = await fileUploadService.UploadFiles(Request, HttpContext);
        //            foreach (FileUploadViewModel fuvm in fuvms)
        //            {
        //                LeverageViewModel lvm = new LeverageViewModel();
        //                lvm.LSFileName = fuvm.OriginalFileName;
        //                lvm.LSLogicalName = fuvm.LogicalFileName;
        //                lvm.LSPhysicalPath = fuvm.PhysicalFilePath.Replace(@"\", @"/");
        //                lvm.UserId = cUser.UserId;
        //                await leverageRepo.SaveOrUpdate(lvm);
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

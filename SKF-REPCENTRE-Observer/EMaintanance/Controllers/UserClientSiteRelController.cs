using EMaintanance.Repository;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace EMaintanance.Controllers
{
    [SKFAuthorize("PRG26")]
    public class UserClientSiteRelController : Controller
    {
        private readonly UserClientSiteRelRepo ucsrRepo;
        private IConfiguration _configuration;
        public UserClientSiteRelController(IConfiguration configuration)
        {
            _configuration = configuration;
            ucsrRepo = new UserClientSiteRelRepo(configuration);
        }

        [SKFAuthorize("PRG26:P1")]
        public IActionResult Index()
        {
            return View();
        }

        [HttpGet]
        [SKFAuthorize("PRG26:P1")]
        public async Task<IActionResult> GetUserClientSites(int lId, string type, int cId, int ccId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                return Ok(await ucsrRepo.GetUserClientSites(lId, type, cUser.UserId, cId, ccId));
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
        [SKFAuthorize("PRG26:P1")]
        public async Task<IActionResult> GetUserSiteAccess(int lId, int uId)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
                return Ok(await ucsrRepo.GetUserSiteAccess(lId, uId, cUser.UserId));
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
        [SKFAuthorize("PRG26:P2")]
        public async Task<IActionResult> Create([FromBody] UserClientSiteRelViewModel ucsrvm)
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                if (ucsrvm.UserId == cUser.UserId)
                {
                    throw new CustomException("You are not Authorized to update your own Access!!!", "Warning", true, "Custom Message: You are not Authorized to update your own Access!!!");
                }
                else
                {
                    if (ucsrvm.CountryRelations != null && ucsrvm.CountryRelations.Count > 0)
                    {
                        string Type = "Country";
                        foreach (CountryRelations crs in ucsrvm.CountryRelations)
                        {
                            await ucsrRepo.SaveOrUpdate(cUser.UserId, ucsrvm.UserId, Type, crs.CountryId, crs.Active);
                        }
                    }
                    if (ucsrvm.CostCentreRelations != null && ucsrvm.CostCentreRelations.Count > 0)
                    {
                        string Type = "CostCentre";
                        foreach (CostCentreRelations ccrs in ucsrvm.CostCentreRelations)
                        {
                            await ucsrRepo.SaveOrUpdate(cUser.UserId, ucsrvm.UserId, Type, ccrs.CostCentreId, ccrs.Active);
                        }
                    }
                    if (ucsrvm.ClientRelations != null && ucsrvm.ClientRelations.Count > 0)
                    {
                        string Type = "Client";
                        foreach (ClientRelations clrs in ucsrvm.ClientRelations)
                        {
                            await ucsrRepo.SaveOrUpdate(cUser.UserId, ucsrvm.UserId, Type, clrs.ClientId, clrs.Active);
                        }
                    }
                    if (ucsrvm.ClientSiteRelations != null && ucsrvm.ClientSiteRelations.Count > 0)
                    {
                        string Type = "ClientSite";
                        foreach (ClientSiteRelations csrs in ucsrvm.ClientSiteRelations)
                        {
                            await ucsrRepo.SaveOrUpdate(cUser.UserId, ucsrvm.UserId, Type, csrs.ClientSiteId, csrs.Active);
                        }
                    }
                }
                return Ok("Success");
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

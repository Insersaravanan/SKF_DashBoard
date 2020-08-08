using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace EMaintanance.Controllers
{
    public class EncryptRDecryptController : Controller
    {

        public IActionResult Index()
        {
            return View();
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
    }

}
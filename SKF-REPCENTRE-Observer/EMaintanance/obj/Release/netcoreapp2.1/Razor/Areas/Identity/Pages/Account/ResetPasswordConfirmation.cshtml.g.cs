#pragma checksum "C:\SSK\SKF\Source Backup\REP-Online-Dashboard-30-04-2020\Observer-Dashboard-30-04-2020\EMaintanance\Areas\Identity\Pages\Account\ResetPasswordConfirmation.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "e775a4ce0fe572323993d0cac2727d1f37132a98"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(EMaintanance.Areas.Identity.Pages.Account.Areas_Identity_Pages_Account_ResetPasswordConfirmation), @"mvc.1.0.razor-page", @"/Areas/Identity/Pages/Account/ResetPasswordConfirmation.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.RazorPages.Infrastructure.RazorPageAttribute(@"/Areas/Identity/Pages/Account/ResetPasswordConfirmation.cshtml", typeof(EMaintanance.Areas.Identity.Pages.Account.Areas_Identity_Pages_Account_ResetPasswordConfirmation), null)]
namespace EMaintanance.Areas.Identity.Pages.Account
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#line 1 "C:\SSK\SKF\Source Backup\REP-Online-Dashboard-30-04-2020\Observer-Dashboard-30-04-2020\EMaintanance\Areas\Identity\Pages\_ViewImports.cshtml"
using Microsoft.AspNetCore.Identity;

#line default
#line hidden
#line 2 "C:\SSK\SKF\Source Backup\REP-Online-Dashboard-30-04-2020\Observer-Dashboard-30-04-2020\EMaintanance\Areas\Identity\Pages\_ViewImports.cshtml"
using EMaintanance.Areas.Identity;

#line default
#line hidden
#line 1 "C:\SSK\SKF\Source Backup\REP-Online-Dashboard-30-04-2020\Observer-Dashboard-30-04-2020\EMaintanance\Areas\Identity\Pages\Account\_ViewImports.cshtml"
using EMaintanance.Areas.Identity.Pages.Account;

#line default
#line hidden
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"e775a4ce0fe572323993d0cac2727d1f37132a98", @"/Areas/Identity/Pages/Account/ResetPasswordConfirmation.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"6879ca5c9df988f55b626756faa3cca6b29c7f9f", @"/Areas/Identity/Pages/_ViewImports.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"b04ec060273dc867686bcb739410a0873531a3fd", @"/Areas/Identity/Pages/Account/_ViewImports.cshtml")]
    public class Areas_Identity_Pages_Account_ResetPasswordConfirmation : global::Microsoft.AspNetCore.Mvc.RazorPages.Page
    {
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
#line 3 "C:\SSK\SKF\Source Backup\REP-Online-Dashboard-30-04-2020\Observer-Dashboard-30-04-2020\EMaintanance\Areas\Identity\Pages\Account\ResetPasswordConfirmation.cshtml"
  
    ViewData["Title"] = "Reset password confirmation";
    Layout = "~/Views/Shared/_PublicLayout.cshtml";

#line default
#line hidden
            BeginContext(162, 39, true);
            WriteLiteral("<div class=\"container-fluid\">\r\n    <h2>");
            EndContext();
            BeginContext(202, 17, false);
#line 8 "C:\SSK\SKF\Source Backup\REP-Online-Dashboard-30-04-2020\Observer-Dashboard-30-04-2020\EMaintanance\Areas\Identity\Pages\Account\ResetPasswordConfirmation.cshtml"
   Write(ViewData["Title"]);

#line default
#line hidden
            EndContext();
            BeginContext(219, 164, true);
            WriteLiteral("</h2>\r\n    <p>\r\n        Your password has been reset. Please <a href=\"/Identity/Account/Login\" class=\"btn btn-primary\">Click here to log in</a>.\r\n    </p>\r\n</div>\r\n");
            EndContext();
        }
        #pragma warning restore 1998
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.IModelExpressionProvider ModelExpressionProvider { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IUrlHelper Url { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.IViewComponentHelper Component { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IJsonHelper Json { get; private set; }
        [global::Microsoft.AspNetCore.Mvc.Razor.Internal.RazorInjectAttribute]
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<ResetPasswordConfirmationModel> Html { get; private set; }
        public global::Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary<ResetPasswordConfirmationModel> ViewData => (global::Microsoft.AspNetCore.Mvc.ViewFeatures.ViewDataDictionary<ResetPasswordConfirmationModel>)PageContext?.ViewData;
        public ResetPasswordConfirmationModel Model => ViewData.Model;
    }
}
#pragma warning restore 1591

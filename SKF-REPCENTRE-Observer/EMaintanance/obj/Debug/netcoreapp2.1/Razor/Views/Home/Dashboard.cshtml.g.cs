#pragma checksum "C:\SSK\SKF\Source Backup\REP-Online-Dashboard-18-07-2020\REP-Online-Dashboard-30-04-2020\Observer-Dashboard-30-04-2020\EMaintanance\Views\Home\Dashboard.cshtml" "{ff1816ec-aa5e-4d10-87f7-6f4963833460}" "efaeb2feb5d30a4ac39b087a50f73a0d25e839e3"
// <auto-generated/>
#pragma warning disable 1591
[assembly: global::Microsoft.AspNetCore.Razor.Hosting.RazorCompiledItemAttribute(typeof(AspNetCore.Views_Home_Dashboard), @"mvc.1.0.view", @"/Views/Home/Dashboard.cshtml")]
[assembly:global::Microsoft.AspNetCore.Mvc.Razor.Compilation.RazorViewAttribute(@"/Views/Home/Dashboard.cshtml", typeof(AspNetCore.Views_Home_Dashboard))]
namespace AspNetCore
{
    #line hidden
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Threading.Tasks;
    using Microsoft.AspNetCore.Mvc;
    using Microsoft.AspNetCore.Mvc.Rendering;
    using Microsoft.AspNetCore.Mvc.ViewFeatures;
#line 1 "C:\SSK\SKF\Source Backup\REP-Online-Dashboard-18-07-2020\REP-Online-Dashboard-30-04-2020\Observer-Dashboard-30-04-2020\EMaintanance\Views\_ViewImports.cshtml"
using EMaintanance;

#line default
#line hidden
#line 2 "C:\SSK\SKF\Source Backup\REP-Online-Dashboard-18-07-2020\REP-Online-Dashboard-30-04-2020\Observer-Dashboard-30-04-2020\EMaintanance\Views\_ViewImports.cshtml"
using EMaintanance.Models;

#line default
#line hidden
#line 1 "C:\SSK\SKF\Source Backup\REP-Online-Dashboard-18-07-2020\REP-Online-Dashboard-30-04-2020\Observer-Dashboard-30-04-2020\EMaintanance\Views\Home\Dashboard.cshtml"
using Stimulsoft.Report.Web;

#line default
#line hidden
#line 2 "C:\SSK\SKF\Source Backup\REP-Online-Dashboard-18-07-2020\REP-Online-Dashboard-30-04-2020\Observer-Dashboard-30-04-2020\EMaintanance\Views\Home\Dashboard.cshtml"
using Stimulsoft.Report.Mvc;

#line default
#line hidden
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"efaeb2feb5d30a4ac39b087a50f73a0d25e839e3", @"/Views/Home/Dashboard.cshtml")]
    [global::Microsoft.AspNetCore.Razor.Hosting.RazorSourceChecksumAttribute(@"SHA1", @"0d99d051589a223aabf24b8387c074a6009fff84", @"/Views/_ViewImports.cshtml")]
    public class Views_Home_Dashboard : global::Microsoft.AspNetCore.Mvc.Razor.RazorPage<dynamic>
    {
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_0 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("src", new global::Microsoft.AspNetCore.Html.HtmlString("~/js/Home/index.js"), global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_1 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("include", "Development", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_2 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("src", "~/js/Home/index.min.js", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        private static readonly global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute __tagHelperAttribute_3 = new global::Microsoft.AspNetCore.Razor.TagHelpers.TagHelperAttribute("exclude", "Development", global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
        #line hidden
        #pragma warning disable 0169
        private string __tagHelperStringValueBuffer;
        #pragma warning restore 0169
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperExecutionContext __tagHelperExecutionContext;
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner __tagHelperRunner = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperRunner();
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __backed__tagHelperScopeManager = null;
        private global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager __tagHelperScopeManager
        {
            get
            {
                if (__backed__tagHelperScopeManager == null)
                {
                    __backed__tagHelperScopeManager = new global::Microsoft.AspNetCore.Razor.Runtime.TagHelpers.TagHelperScopeManager(StartTagHelperWritingScope, EndTagHelperWritingScope);
                }
                return __backed__tagHelperScopeManager;
            }
        }
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_EnvironmentTagHelper;
        private global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper;
        private global::Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper __Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper;
        #pragma warning disable 1998
        public async override global::System.Threading.Tasks.Task ExecuteAsync()
        {
            BeginContext(62, 2, true);
            WriteLiteral("\r\n");
            EndContext();
#line 4 "C:\SSK\SKF\Source Backup\REP-Online-Dashboard-18-07-2020\REP-Online-Dashboard-30-04-2020\Observer-Dashboard-30-04-2020\EMaintanance\Views\Home\Dashboard.cshtml"
  
    ViewData["Title"] = "Dashboard - Viewer";
    Layout = "~/Views/Shared/_Layout.cshtml";

#line default
#line hidden
            BeginContext(165, 2, true);
            WriteLiteral("\r\n");
            EndContext();
            BeginContext(168, 399, false);
#line 9 "C:\SSK\SKF\Source Backup\REP-Online-Dashboard-18-07-2020\REP-Online-Dashboard-30-04-2020\Observer-Dashboard-30-04-2020\EMaintanance\Views\Home\Dashboard.cshtml"
Write(Html.StiNetCoreViewer(new StiNetCoreViewerOptions()
{
    Actions =
    {
        GetReport = "GetReport",
        ViewerEvent = "ViewerEvent"
    },
    Toolbar =
    {
        ShowAboutButton = false,
        ShowOpenButton = false,
    },
    Exports = {

         ShowExportToDocument = false,
         //ShowExportToPdf = false,
         ShowExportToImageBmp = false,
    }
}));

#line default
#line hidden
            EndContext();
            BeginContext(567, 6, true);
            WriteLiteral("\r\n\r\n\r\n");
            EndContext();
            DefineSection("Scripts", async() => {
                BeginContext(591, 6, true);
                WriteLiteral("\r\n    ");
                EndContext();
                BeginContext(597, 107, false);
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("environment", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "269ccf647ea94b32a7720eda524bb985", async() => {
                    BeginContext(632, 10, true);
                    WriteLiteral("\r\n        ");
                    EndContext();
                    BeginContext(642, 42, false);
                    __tagHelperExecutionContext = __tagHelperScopeManager.Begin("script", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "c21e0d3c0fc644699215add6e815490d", async() => {
                    }
                    );
                    __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper>();
                    __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper);
                    __tagHelperExecutionContext.AddHtmlAttribute(__tagHelperAttribute_0);
                    await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                    if (!__tagHelperExecutionContext.Output.IsContentModified)
                    {
                        await __tagHelperExecutionContext.SetOutputContentAsync();
                    }
                    Write(__tagHelperExecutionContext.Output);
                    __tagHelperExecutionContext = __tagHelperScopeManager.End();
                    EndContext();
                    BeginContext(684, 6, true);
                    WriteLiteral("\r\n    ");
                    EndContext();
                }
                );
                __Microsoft_AspNetCore_Mvc_TagHelpers_EnvironmentTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_EnvironmentTagHelper);
                __Microsoft_AspNetCore_Mvc_TagHelpers_EnvironmentTagHelper.Include = (string)__tagHelperAttribute_1.Value;
                __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_1);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                EndContext();
                BeginContext(704, 6, true);
                WriteLiteral("\r\n    ");
                EndContext();
                BeginContext(710, 137, false);
                __tagHelperExecutionContext = __tagHelperScopeManager.Begin("environment", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "da214a5e5b1946099d7c00a8c264887b", async() => {
                    BeginContext(745, 10, true);
                    WriteLiteral("\r\n        ");
                    EndContext();
                    BeginContext(755, 72, false);
                    __tagHelperExecutionContext = __tagHelperScopeManager.Begin("script", global::Microsoft.AspNetCore.Razor.TagHelpers.TagMode.StartTagAndEndTag, "fe13ddb77ed14574842d76a2ef7bfcc7", async() => {
                    }
                    );
                    __Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.Razor.TagHelpers.UrlResolutionTagHelper>();
                    __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_Razor_TagHelpers_UrlResolutionTagHelper);
                    __Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.ScriptTagHelper>();
                    __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper);
                    __Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper.Src = (string)__tagHelperAttribute_2.Value;
                    __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_2);
#line 35 "C:\SSK\SKF\Source Backup\REP-Online-Dashboard-18-07-2020\REP-Online-Dashboard-30-04-2020\Observer-Dashboard-30-04-2020\EMaintanance\Views\Home\Dashboard.cshtml"
__Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper.AppendVersion = true;

#line default
#line hidden
                    __tagHelperExecutionContext.AddTagHelperAttribute("asp-append-version", __Microsoft_AspNetCore_Mvc_TagHelpers_ScriptTagHelper.AppendVersion, global::Microsoft.AspNetCore.Razor.TagHelpers.HtmlAttributeValueStyle.DoubleQuotes);
                    await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                    if (!__tagHelperExecutionContext.Output.IsContentModified)
                    {
                        await __tagHelperExecutionContext.SetOutputContentAsync();
                    }
                    Write(__tagHelperExecutionContext.Output);
                    __tagHelperExecutionContext = __tagHelperScopeManager.End();
                    EndContext();
                    BeginContext(827, 6, true);
                    WriteLiteral("\r\n    ");
                    EndContext();
                }
                );
                __Microsoft_AspNetCore_Mvc_TagHelpers_EnvironmentTagHelper = CreateTagHelper<global::Microsoft.AspNetCore.Mvc.TagHelpers.EnvironmentTagHelper>();
                __tagHelperExecutionContext.Add(__Microsoft_AspNetCore_Mvc_TagHelpers_EnvironmentTagHelper);
                __Microsoft_AspNetCore_Mvc_TagHelpers_EnvironmentTagHelper.Exclude = (string)__tagHelperAttribute_3.Value;
                __tagHelperExecutionContext.AddTagHelperAttribute(__tagHelperAttribute_3);
                await __tagHelperRunner.RunAsync(__tagHelperExecutionContext);
                if (!__tagHelperExecutionContext.Output.IsContentModified)
                {
                    await __tagHelperExecutionContext.SetOutputContentAsync();
                }
                Write(__tagHelperExecutionContext.Output);
                __tagHelperExecutionContext = __tagHelperScopeManager.End();
                EndContext();
                BeginContext(847, 2, true);
                WriteLiteral("\r\n");
                EndContext();
            }
            );
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
        public global::Microsoft.AspNetCore.Mvc.Rendering.IHtmlHelper<dynamic> Html { get; private set; }
    }
}
#pragma warning restore 1591

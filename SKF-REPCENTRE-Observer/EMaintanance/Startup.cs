using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using EMaintanance.Data;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Authorization;
using EMaintanance.Utils;
using Microsoft.AspNetCore.Identity.UI.Services;
using EMaintanance.Areas.Identity.Services;
using EMaintanance.Areas.Identity;

namespace EMaintanance
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        public static string MasterConnectionString
        {
            get;
            private set;
        }

        public static string UserConnectionString
        {
            get;
            private set;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            Stimulsoft.Base.StiLicense.Key = "6vJhGtLLLz2GNviWmUTrhSqnOItdDwjBylQzQcAOiHlB6kBYkBh1qJQdhsIaMEFo2z0MR4CCqEqN4lLpY/Jii3dZiT" +
"WTo1OQrvgZc291ak7JU3jHoKBEqyE/YgXO2jbSAXgifT45OeQFYBJMgBGBM7/bokIsZiQSi0sbuErPfVVztCTIOBF8" +
"53gt47f/HybWSJREaK7uWz8NPouzin4HN3GLavzISBfhbQZXVIwoiyV0U/qbiLUDAZ4EZk33VBBmO1sFoNtVTRNzQr" +
"gs4AHk3R2R0YZ5bqekHnWU1LAujKLeKgPIifBXjqQ87SbVSh0KTS/mHj3B6Ea8OCS3Qbxw/tcwZMIGYZ3pGIWVx9Wo" +
"fMeNWaEYphFfYC8GeHdgxhynuc7EnD8O6uZXAHEH7gCLpL/xXYne01yFWu9+NGdHINMKSeNvAhjy86OmWAcRbOOJt4" +
"nynupnzOrGc1MQqPH6OMiDmoXQhjP71WOv2bpzVlYycQUt83yEoTxOtZ+GHJ5zz81V6T9oJBziYJ3f9k8tMwrfY1s3" +
"9JjWvydfdE9JiQeBB0MgtdqUbk8nrIwbMB/u18IW0MhrKm9Fdho+hqrpmg==";

            services.Configure<CookiePolicyOptions>(options =>
            {
                // This lambda determines whether user consent for non-essential cookies is needed for a given request.
                options.CheckConsentNeeded = context => true;
                options.MinimumSameSitePolicy = SameSiteMode.None;
            });

            //SKF Customized autorization
            services.AddSingleton<IAuthorizationPolicyProvider, SKFPolicyProvider>();
            services.AddTransient<IAuthorizationHandler, SKFAuthorizationHandler>();
            services.AddHttpContextAccessor();

            services.AddDbContext<ApplicationDbContext>(options =>
                options.UseSqlServer(
                    Configuration.GetConnectionString("SKF.User")));

            services.AddDefaultIdentity<IdentityUser>()
               .AddEntityFrameworkStores<ApplicationDbContext>();

            //services.AddScoped<ApplicationSignInManager>();

            services.AddTransient<IEmailSender, EmailSender>();

            services.AddMvc(options =>
                options.AllowCombiningAuthorizeFilters = false //For SKF Customized autorization
            ).SetCompatibilityVersion(CompatibilityVersion.Version_2_1);

            services.AddSession(options =>
            {
                // Set a short timeout for easy testing.
                options.IdleTimeout = TimeSpan.FromHours(1);
                //options.IdleTimeout = TimeSpan.FromSeconds(10);
                //options.Cookie.HttpOnly = true;
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IHostingEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
                app.UseDatabaseErrorPage();
            }
            else
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            //app.UseHttpsRedirection();
            app.UseStaticFiles();
            //app.UseCookiePolicy();

            app.UseAuthentication();
            app.UseSession();
            app.UseMvc(routes =>
            {
                routes.MapRoute(
                    name: "default",
                    template: "{controller=Home}/{action=Index}/{id?}");
            });
        }
    }
}

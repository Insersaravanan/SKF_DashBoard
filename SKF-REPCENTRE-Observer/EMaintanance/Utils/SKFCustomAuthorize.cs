using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Utils
{
    internal class SKFAuthorizeAttribute : AuthorizeAttribute
    {
        const string POLICY_PREFIX = "SKFRoles";

        public SKFAuthorizeAttribute(string roles) => SKFRoles = roles;

        public string SKFRoles
        {
            get
            {
                return Policy.Substring(POLICY_PREFIX.Length);
            }
            set
            {
                Policy = $"{POLICY_PREFIX}{value}";
            }
        }
    }

    internal class SKFRequirement : IAuthorizationRequirement
    {
        public string SKFRoles { get; private set; }

        public SKFRequirement(string roles) { SKFRoles = roles; }
    }

    internal class SKFPolicyProvider : IAuthorizationPolicyProvider
    {
        const string POLICY_PREFIX = "SKFRoles";
        public DefaultAuthorizationPolicyProvider FallbackPolicyProvider { get; }

        public SKFPolicyProvider(IOptions<AuthorizationOptions> options)
        {
            FallbackPolicyProvider = new DefaultAuthorizationPolicyProvider(options);
        }

        public Task<AuthorizationPolicy> GetDefaultPolicyAsync() => FallbackPolicyProvider.GetDefaultPolicyAsync();

        public Task<AuthorizationPolicy> GetPolicyAsync(string policyName)
        {
            if (policyName.StartsWith(POLICY_PREFIX, StringComparison.OrdinalIgnoreCase) &&
                policyName.Substring(POLICY_PREFIX.Length).Length > 0)
            {
                var _roles = policyName.Substring(POLICY_PREFIX.Length);
                var policy = new AuthorizationPolicyBuilder();
                policy.AddRequirements(new SKFRequirement(_roles));
                return Task.FromResult(policy.Build());
            }

            // If the policy name doesn't match the format expected by this policy provider,
            // try the fallback provider. If no fallback provider is used, this would return 
            // Task.FromResult<AuthorizationPolicy>(null) instead.
            return FallbackPolicyProvider.GetPolicyAsync(policyName);
        }
    }

    internal class SKFAuthorizationHandler : AuthorizationHandler<SKFRequirement>
    {
        private readonly ILogger<SKFAuthorizationHandler> _logger;
        private readonly IHttpContextAccessor _httpContextAccessor;

        public SKFAuthorizationHandler(IHttpContextAccessor httpContextAccessor, ILogger<SKFAuthorizationHandler> logger)
        {
            _logger = logger;
            _httpContextAccessor = httpContextAccessor;
        }

        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, SKFRequirement requirement)
        {
            try
            {
                var iName = _httpContextAccessor.HttpContext.User.Identity.Name;
                var data = JToken.Parse(_httpContextAccessor.HttpContext.Session.GetString(iName + "_GlobalInformation"));

                var roleList = requirement.SKFRoles.Split(","); //Split the roles from controller for evaluate it.

                if (data["userRoles"] != null && data["userRoles"].Count() > 0)
                {
                    bool validated = false;
                    foreach (var _role in roleList)
                    {
                        //Validate the branchinfo to check the user has specific role
                        if (!validated)
                        {
                            var _roleSplit = _role.Split(":");
                            var _roleName = _roleSplit[0];
                            var _privilegeCode = _roleSplit.Length > 1 ? _roleSplit[1] : null;

                            JArray jRoles = (JArray)data["userRoles"];

                            if (_privilegeCode != null)
                            {
                                if (jRoles.FirstOrDefault(x => x.Value<string>("programCode") == _roleName && x.Value<string>("privilegeCode") == _privilegeCode) != null)
                                {
                                    context.Succeed(requirement);
                                    validated = true;
                                }
                            }
                            else
                            {
                                if (jRoles.FirstOrDefault(x => x.Value<string>("programCode") == _roleName) != null)
                                {
                                    context.Succeed(requirement);
                                    validated = true;
                                }
                            }
                        }
                    }
                }
                else
                {
                    return Task.CompletedTask;
                }
            }
            catch (Exception)
            {
            }

            return Task.CompletedTask;
        }
    }

}

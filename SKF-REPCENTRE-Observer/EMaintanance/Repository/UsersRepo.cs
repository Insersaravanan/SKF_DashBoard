using EMaintanance.Utils;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using EMaintanance.Models;
using Dapper;
using EMaintanance.UserModels;
using Microsoft.AspNetCore.Identity;
using EMaintanance.ViewModels;
using EMaintanance.Services;
using Microsoft.Extensions.Configuration;
using System.Data;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;

namespace EMaintanance.Repository
{
    public class UsersRepo
    {
        Utility util;
        private readonly ApplicationConfigurationRepo appConfigRepo;
        private readonly NotificationServiceHelper notificationServiceHelper;
        public UsersRepo(IConfiguration iconfiguration)
        {
            util = new Utility(iconfiguration);
            appConfigRepo = new ApplicationConfigurationRepo(iconfiguration);
            notificationServiceHelper = new NotificationServiceHelper(iconfiguration);
        }

        public async Task<IEnumerable<dynamic>> GetUserByName(string UserName)
        {
            string sql = "Select UserName,UserId from dbo.Users where UserName like '%" + UserName + "%' order by UserName";

            using (var conn = util.MasterCon())
            {
                return await (conn.QueryAsync<dynamic>(sql));
            }
        }

        public async Task<IEnumerable<dynamic>> GetUsersByParams(UsersViewModel u)
        {
            string sql = "dbo.EAppListUsers";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { u.UserTypeId, u.UserStatusId, u.LanguageId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetAssignToList(string Type, int UserId, int LanguageId, int ClientSiteId)
        {
            string sql = "dbo.EAppGetAssignToList";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { Type, UserId, LanguageId, ClientSiteId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> UpdateLastSession(int UserId, int ClientSiteId, string SessionId)
        {
            string sql = "dbo.EAppSaveLastSession";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { UserId, ClientSiteId, SessionId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<dynamic> GetLastSession(int UserId)
        {
            string sql = "dbo.EAppGetLastSession";
            using (var conn = util.MasterCon())
            {
                try
                {
                    var result = await conn.QueryAsync<dynamic>(sql, new { UserId }, commandType: CommandType.StoredProcedure);
                    return result.FirstOrDefault();
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate(UsersViewModel u, UserManager<IdentityUser> identityManager)
        {
            ApplicationConfigurationViewModel appConfig = null;
            Boolean IsUserActivationEnable = true;
            var appUser = await identityManager.FindByEmailAsync(u.UserName.ToUpper());
            //u.EmailId = u.UserName;
            if (appUser == null)
            {
                var user = new ApplicationUser { UserName = u.UserName, Email = u.UserName };
                u.EmailId = u.UserName;

                if (u.Password == null)
                {
                    //appConfig = await appConfigRepo.GetAppConfigByName("DEFAULT_APP_PWD", "Y");
                    //u.Password = CustomUtils.DecodeFromBase64(appConfig.AppConfigValue);

                    u.Password = CustomUtils.RandomString(10);
                }
                // Create Identity User.
                var result = await identityManager.CreateAsync(user, u.Password);

                // Query to get the Identity UserId.
                appUser = await identityManager.FindByEmailAsync(u.UserName.ToUpper());
                u.Id = appUser.Id;

                appConfig = await appConfigRepo.GetAppConfigByName("O_USER_ACTIVATION_ENABLED", "Y");
                IsUserActivationEnable = Boolean.Parse(appConfig.AppConfigValue);

                if (IsUserActivationEnable)
                {
                    appConfig = await appConfigRepo.GetAppConfigByName("O_USER_CONTROLLER_ACTION", "Y");
                    u.ApplicationBaseURL += appConfig.AppConfigValue;
                    string ActivationUrl = u.ApplicationBaseURL.Replace("$@USER_ID@$", u.Id);

                    /** Notify eMail to User Activation */
                    try
                    {
                        await Task.Factory.StartNew(async () =>
                        {
                            await notificationServiceHelper.PrepareUserEmailNotification(u.FirstName + " " + u.LastName, u.UserName, ActivationUrl);
                        });
                    }
                    catch (Exception ex)
                    {
                        // Notification exception.
                    }
                }
                else
                {
                    u.Active = "Y";
                }

                if (!result.Succeeded)
                {
                    var msg = "Unable to create User. Please contact Support.";
                    if (result.Errors.Count() > 0)
                    {
                        foreach (var er in result.Errors)
                        {
                            msg += "  " + er.Code + ":" + er.Description;
                        }
                    }
                    throw new Exception(msg);
                }
            }

            string sql = "dbo.EAppSaveUsers";
            using (var conn = util.MasterCon())
            {
                try
                {
                    string Password = u.Password != null ? CustomUtils.EncodeToBase64(u.Password) : null;
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        u.UserId,
                        u.UserName,
                        u.FirstName,
                        u.MiddleName,
                        u.LastName,
                        u.EmailId,
                        u.UserTypeId,
                        u.UserStatusId,
                        u.Mobile,
                        u.Phone,
                        u.CreatedUserId,
                        u.Id,
                        Password,
                        u.ReturnKey
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    if (sqlException.Number == 515 ||sqlException.Number == 2601 || sqlException.Number == 2627)
                    {
                        throw new CustomException("Duplicate", "Username already Exists.", "Error", true, sqlException);
                    }
                    else
                    {
                        throw new CustomException("Due to some Technical Reason, Unable to Save or Update", "Error", true, sqlException);
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<dynamic> Activate(string Id, string BaseUrl)
        {
            try
            {
                string getSql = "Select * from dbo.Users where Id = '" + Id + "'";
                string sql = "Update dbo.Users set Active= 'Y' where Id = '" + Id + "'";

                using (var conn = util.MasterCon())
                {
                    var user = await conn.QueryFirstOrDefaultAsync<UsersViewModel>(getSql);

                    if (user.Active == "N")
                    {
                        await conn.QueryAsync<dynamic>(sql);
                        /** Notify eMail to share Password */
                        try
                        {
                            await Task.Factory.StartNew(async () =>
                            {
                                await notificationServiceHelper.PrepareUserPasswordNotification(user.FirstName + " " + user.LastName, user.UserName, CustomUtils.DecodeFromBase64(user.Password), BaseUrl);
                            });
                        }
                        catch (Exception ex)
                        {
                            // Notification exception.
                        }
                    }
                }
                return null;
            }
            catch (Exception ex)
            {
                throw new CustomException("Unable to Activate, Please Contact Support!!!", "Error", true, ex);
            }
        }

        public async Task<dynamic> GetUser(int id)
        {
            string sql = "SELECT * from dbo.Users where UserId=" + id;
            using (var conn = util.MasterCon())
            {
                return await conn.QueryFirstOrDefaultAsync<dynamic>(sql);
            }
        }

        public async Task<UsersViewModel> GetUserObject(int? id)
        {
            string sql = "SELECT * from dbo.Users where UserId=" + id;
            using (var conn = util.MasterCon())
            {
                return await conn.QueryFirstOrDefaultAsync<UsersViewModel>(sql);
            }
        }

        public async Task<IEnumerable<dynamic>> GetAllUsers()
        {
            string sql = "SELECT UserId as id,* from dbo.Users";
            using (var conn = util.MasterCon())
            {
                return await conn.QueryAsync<dynamic>(sql);
            }
        }
    }
}

//using EMaintanance.Data;
//using EMaintanance.Models;
//using EMaintanance.Providers;
//using EMaintanance.Repository;
//using EMaintanance.UserModels;
//using Microsoft.IdentityModel.Tokens;
//using System;
//using System.Collections.Generic;
//using System.IdentityModel.Tokens.Jwt;
//using System.Linq;
//using System.Security.Claims;
//using System.Text;
//using System.Threading.Tasks;

//namespace EMaintanance.Utils
//{
//    public class GetLoginToken
//    {
//        public static TokenProviderOptions GetOptions()
//        {
//            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(Configuration.Config.GetSection("TokenAuthentication:SecretKey").Value));

//            return new TokenProviderOptions
//            {
//                Path = Configuration.Config.GetSection("TokenAuthentication:TokenPath").Value,
//                Audience = Configuration.Config.GetSection("TokenAuthentication:Audience").Value,
//                Issuer = Configuration.Config.GetSection("TokenAuthentication:Issuer").Value,
//                Expiration = TimeSpan.FromMinutes(Convert.ToInt32(Configuration.Config.GetSection("TokenAuthentication:ExpirationMinutes").Value)),
//                SigningCredentials = new SigningCredentials(signingKey, SecurityAlgorithms.HmacSha256)
//            };
//        }

//        public static LoginResponseData Execute(ApplicationUser user, ApplicationDbContext db, RefreshToken refreshToken = null)
//        {
//            var options = GetOptions();
//            var now = DateTime.UtcNow;

//            var claims = new List<Claim>()
//            {
//               // new Claim(JwtRegisteredClaimNames.Sub, user.UserName), // TODO - Check to use it.
//                new Claim(JwtRegisteredClaimNames.Email,user.Email),
//                new Claim(JwtRegisteredClaimNames.NameId, user.Id),
//                new Claim(JwtRegisteredClaimNames.Jti, user.Id.ToString()),
//                new Claim(JwtRegisteredClaimNames.Iat, new DateTimeOffset(now).ToUniversalTime().ToUnixTimeSeconds().ToString(), ClaimValueTypes.Integer64)
//            };

//            //Load the current loggedin userid to jwt //TODO check for security on this.
//            UsersRepo ur = new UsersRepo();
//            Users _user = ur.GetUserByEmailId(user.Email);
//            if (_user != null)
//            {
//                claims.Add(new Claim("UserId", _user.UserId.ToString()));
//            };

//            var userClaims = db.UserClaims.Where(i => i.UserId == user.Id);
//            foreach (var userClaim in userClaims)
//            {
//                claims.Add(new Claim(userClaim.ClaimType, userClaim.ClaimValue));
//            }

//            //var userRoles = db.UserRoles.Where(i => i.UserId == user.Id); // TODO - This should load from Application DB
//            //foreach (var userRole in userRoles)
//            //{
//            //    var role = db.Roles.Single(i => i.Id == userRole.RoleId);
//            //    claims.Add(new Claim(ClaimTypes.Role, role.Name));
//            //}

//            if (refreshToken == null)
//            {
//                refreshToken = new RefreshToken()
//                {
//                    UserId = user.Id,
//                    Token = Guid.NewGuid().ToString("N"),
//                };
//                db.InsertNew(refreshToken);
//            }

//            refreshToken.IssuedUtc = now;
//            refreshToken.ExpiresUtc = now.Add(options.Expiration);
//            db.SaveChanges();

//            var jwt = new JwtSecurityToken(
//                issuer: options.Issuer,
//                audience: options.Audience,
//                claims: claims.ToArray(),
//                notBefore: now,
//                expires: now.Add(options.Expiration),
//                signingCredentials: options.SigningCredentials);
//            var encodedJwt = new JwtSecurityTokenHandler().WriteToken(jwt);

//            var response = new LoginResponseData
//            {
//                access_token = encodedJwt,
//                refresh_token = refreshToken.Token,
//                expires_in = (int)options.Expiration.TotalSeconds,
//                userName = user.UserName
//            };
//            return response;
//        }
//    }
//}

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
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;

namespace EMaintanance.Services
{
    public class FileUploadService
    {
        private IConfiguration _configuration;
        private readonly ApplicationConfigurationRepo appConfigRepo;

        public FileUploadService(IConfiguration configuration)
        {
            _configuration = configuration;
            appConfigRepo = new ApplicationConfigurationRepo(configuration);
        }

        public async Task<List<FileUploadViewModel>> UploadFiles(HttpRequest Request, HttpContext HttpContext)
        {
            try
            {
                var files = Request.Form.Files;
                var customHeaders = Request.Headers;
                StringValues aId = "";
                StringValues Type = "";
                StringValues PlotType = ""; // Local variable to handle.
                string FilePath = "";
                string ImageUrl = "";
                Boolean isExternalPath = true;
                string SubPath = "";
                string TypeFormat = "";
                string Delimiter = "";
                var dir = "";
                List<FileUploadViewModel> fuvms = new List<FileUploadViewModel>();
                ApplicationConfigurationViewModel appConfig = null;
                if (customHeaders.ContainsKey("aId") && customHeaders.ContainsKey("Type"))
                {
                    customHeaders.TryGetValue("aId", out aId);
                    customHeaders.TryGetValue("Type", out Type);
                    appConfig = await appConfigRepo.GetAppConfigByName("BaseFilePath", "Y");
                    FilePath = appConfig.AppConfigValue;
                    appConfig = await appConfigRepo.GetAppConfigByName("ImageUrl", "Y");
                    ImageUrl = appConfig.AppConfigValue;
                    appConfig = await appConfigRepo.GetAppConfigByName("IsExternalPath", "Y");
                    if (appConfig.AppConfigValue != null)
                    {
                        isExternalPath = bool.Parse(appConfig.AppConfigValue); // This will used to store the files inside the application.
                        if (!isExternalPath)
                        {
                            dir = Directory.GetCurrentDirectory() + $@"\wwwroot\" + FilePath;
                            //FilePath = _dir + FilePath;
                        }
                        else
                        {
                            dir = FilePath;
                        }
                    }
                    if (Type == "Equipment")
                    {
                        appConfig = await appConfigRepo.GetAppConfigByName("EquipmentPrefixFormat", "Y");
                        TypeFormat = appConfig.AppConfigValue;
                        appConfig = await appConfigRepo.GetAppConfigByName("EquipmentSubPath", "Y");
                        SubPath = appConfig.AppConfigValue;
                    }
                    if (Type == "Drive")
                    {
                        appConfig = await appConfigRepo.GetAppConfigByName("DrivePrefixFormat", "Y");
                        TypeFormat = appConfig.AppConfigValue; //TypeFormat = "DR";
                        appConfig = await appConfigRepo.GetAppConfigByName("DriveSubPath", "Y");
                        SubPath = appConfig.AppConfigValue; //SubPath = "Attachments//Equipment//";
                    }
                    if (Type == "Intermediate")
                    {
                        appConfig = await appConfigRepo.GetAppConfigByName("IntermediatePrefixFormat", "Y");
                        TypeFormat = appConfig.AppConfigValue;
                        appConfig = await appConfigRepo.GetAppConfigByName("IntermediateSubPath", "Y");
                        SubPath = appConfig.AppConfigValue;
                    }
                    if (Type == "Driven")
                    {
                        appConfig = await appConfigRepo.GetAppConfigByName("DrivenPrefixFormat", "Y");
                        TypeFormat = appConfig.AppConfigValue;
                        appConfig = await appConfigRepo.GetAppConfigByName("DrivenSubPath", "Y");
                        SubPath = appConfig.AppConfigValue;
                    }
                    if (Type == "UnitAnalysis")
                    {
                        appConfig = await appConfigRepo.GetAppConfigByName("UnitAnalysisPrefixFormat", "Y");
                        TypeFormat = appConfig.AppConfigValue;
                        appConfig = await appConfigRepo.GetAppConfigByName("UnitAnalysisSubPath", "Y");
                        SubPath = appConfig.AppConfigValue;
                    }
                    if (Type == "ClientDoc")
                    {
                        appConfig = await appConfigRepo.GetAppConfigByName("ClientDocPrefixFormat", "Y");
                        TypeFormat = appConfig.AppConfigValue;
                        appConfig = await appConfigRepo.GetAppConfigByName("ClientDocSubPath", "Y");
                        SubPath = appConfig.AppConfigValue;
                        SubPath = SubPath + aId + "\\";
                    }
                    if (Type == "OtherReports")
                    {
                        appConfig = await appConfigRepo.GetAppConfigByName("OtherReportsPrefixFormat", "Y");
                        TypeFormat = appConfig.AppConfigValue;
                        appConfig = await appConfigRepo.GetAppConfigByName("OtherReportsSubPath", "Y");
                        SubPath = appConfig.AppConfigValue;
                        SubPath = SubPath + aId + "\\";
                    }
                    if (Type == "TechUpgrade")
                    {
                        appConfig = await appConfigRepo.GetAppConfigByName("TechUpgradePrefixFormat", "Y");
                        TypeFormat = appConfig.AppConfigValue;
                        appConfig = await appConfigRepo.GetAppConfigByName("TechUpgradeSubPath", "Y");
                        SubPath = appConfig.AppConfigValue;
                        SubPath = SubPath + aId + "\\";
                    }
                    if (Type == "FailureReport")
                    {
                        appConfig = await appConfigRepo.GetAppConfigByName("FailureReportPrefixFormat", "Y");
                        TypeFormat = appConfig.AppConfigValue;
                        appConfig = await appConfigRepo.GetAppConfigByName("FailureReportSubPath", "Y");
                        SubPath = appConfig.AppConfigValue;
                    }
                    if (Type == "AvoidedPlannedMaintenence")
                    {
                        appConfig = await appConfigRepo.GetAppConfigByName("AvoidedPlannedMaintenancePrefixFormat", "Y");
                        TypeFormat = appConfig.AppConfigValue;
                        appConfig = await appConfigRepo.GetAppConfigByName("AvoidedPlannedMaintenenceSubPath", "Y");
                        SubPath = appConfig.AppConfigValue;
                    }
                    if (Type == "ClientSite")
                    {
                        appConfig = await appConfigRepo.GetAppConfigByName("ClientSitePrefixFormat", "Y");
                        TypeFormat = appConfig.AppConfigValue;
                        appConfig = await appConfigRepo.GetAppConfigByName("ClientSiteSubPath", "Y");
                        SubPath = appConfig.AppConfigValue;
                        SubPath = SubPath + aId + "\\";
                    }
                    if (Type == "Leverage")
                    {
                        appConfig = await appConfigRepo.GetAppConfigByName("LeveragePrefixFormat", "Y");
                        TypeFormat = appConfig.AppConfigValue;
                        appConfig = await appConfigRepo.GetAppConfigByName("LeverageSubPath", "Y");
                        SubPath = appConfig.AppConfigValue;
                        SubPath = SubPath + aId + "\\";
                    }
                    if (Type == "ImagePlot")
                    {
                        if (customHeaders.ContainsKey("plotType"))
                        {
                            customHeaders.TryGetValue("plotType", out PlotType);
                            appConfig = PlotType == "PL" ? await appConfigRepo.GetAppConfigByName("PlantImagePlotFormat", "Y") :
                                PlotType == "EQ" ? await appConfigRepo.GetAppConfigByName("EquipmentImagePlotFormat", "Y") :
                                PlotType == "AS" ? await appConfigRepo.GetAppConfigByName("AssetImagePlotFormat", "Y") :
                                await appConfigRepo.GetAppConfigByName("ImagePlotFormat", "Y");
                        }
                        TypeFormat = appConfig.AppConfigValue;
                        appConfig = await appConfigRepo.GetAppConfigByName("ImagePlotSubPath", "Y");
                        SubPath = appConfig.AppConfigValue;
                    }
                }

                var dateFormat = "yyyyMMddHHmmssFFF"; // Returns 20190118183526247
                appConfig = await appConfigRepo.GetAppConfigByName("FileNameDateFormat", "Y");
                if (appConfig.AppConfigValue != null)
                {
                    dateFormat = appConfig.AppConfigValue;
                }
                string LogicalFilePattern = TypeFormat + Delimiter + aId + Delimiter;

                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                foreach (IFormFile file in files)
                {
                    string _LogicalFilePattern = null;
                    _LogicalFilePattern = LogicalFilePattern + DateTime.Now.ToString(dateFormat);

                    // The below method call is used to write the Files in a specified Location and return the Save Parameters.
                    fuvms.Add(CopyFilesToLocation(file, _LogicalFilePattern, dir + SubPath, ImageUrl + SubPath));

                    // The below code will save the return parameters in DataBase based on Type (Equipment | Drive | Intermediate | Driven).
                    //await equipmentRepo.SaveOrUpdateAttachments(Type, Int32.Parse(aId), 0, fuvm.OriginalFileName, fuvm.LogicalFileName, fuvm.PhysicalFilePath, "Y", cUser.UserId);

                }
                return fuvms;
            }

            catch (Exception ex)
            {
                throw new CustomException(ex.Message, "Error", true, ex?.ToString());
            }
        }

        public FileUploadViewModel CopyFilesToLocation(IFormFile _File, string LogicalFileName, string dir, String FilePath)
        {
            try
            {
                ContentDispositionHeaderValue.TryParse(_File.ContentDisposition, out ContentDispositionHeaderValue parsedContentDisposition);
                //parsedContentDisposition.FileName = parsedContentDisposition.FileName.TrimStart('\"').TrimEnd('\"');
                //parsedContentDisposition.Name = parsedContentDisposition.Name.TrimStart('\"').TrimEnd('\"');
                //String OrginalName = parsedContentDisposition.Name;
                //string extension = parsedContentDisposition.Name.Substring(OrginalName.LastIndexOf(".") + 1, (parsedContentDisposition.Name.Length - parsedContentDisposition.Name.LastIndexOf(".") - 1));
                //extension = extension.Trim('\"');

                string tempFileName = parsedContentDisposition.FileName.TrimStart('\"').TrimEnd('\"');
                string tempName = parsedContentDisposition.Name.TrimStart('\"').TrimEnd('\"');

                String OrginalName = tempFileName;
                string extension = tempName.Substring(OrginalName.LastIndexOf(".") + 1, (tempName.Length - tempName.LastIndexOf(".") - 1));
                var ImagePath = FilePath.Replace(@"\", @"/");
                if (!(Directory.Exists(dir)))
                {
                    Directory.CreateDirectory(dir);
                }

                var FileName = dir + LogicalFileName + "." + extension;
                using (FileStream fs = System.IO.File.Create(FileName))
                {
                    _File.CopyTo(fs);
                    fs.Flush();
                }
                FileUploadViewModel fuvm = new FileUploadViewModel
                {
                    OriginalFileName = OrginalName,
                    LogicalFileName = LogicalFileName + "." + extension,
                    PhysicalFilePath = ImagePath + LogicalFileName + "." + extension,
                    FileFormat = extension
                };

                return fuvm;
            }
            catch (Exception ex)
            {
                throw new CustomException("Unable to upload file in specific location, Please Contact Support!!!", "Error", true, ex);
            }
        }
    }
}

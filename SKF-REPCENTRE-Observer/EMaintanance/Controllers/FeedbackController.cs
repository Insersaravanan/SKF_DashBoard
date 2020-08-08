using System;
using Microsoft.AspNetCore.Mvc;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi.Models;
using Microsoft.VisualStudio.Services.Common;
using Microsoft.VisualStudio.Services.WebApi.Patch.Json;
using Microsoft.VisualStudio.Services.WebApi.Patch;
using Microsoft.VisualStudio.Services.WebApi;
using System.Collections.Generic;
using System.IO;
using System.Net.Http;
using System.Threading.Tasks;
using Microsoft.Extensions.Primitives;
using System.Net.Http.Headers;
using EMaintanance.Utils;
using Microsoft.Extensions.Configuration;
using EMaintanance.Repository;
using EMaintanance.Models;
using Microsoft.AspNetCore.Authorization;

namespace EMaintanance.Controllers
{
    [Authorize]
    public class FeedbackController : Controller
    {
        private IConfiguration _configuration;
        private readonly LookupsRepo lookupRepo;
        public FeedbackController(IConfiguration configuration)
        {
            _configuration = configuration;
            lookupRepo = new LookupsRepo(configuration);
        }

        public IActionResult Index()
        {
            return View();
        }

        public async Task<IActionResult> GetWorkItem(int id)
        {
            var uriLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_Uri");
            Uri accountUri = new Uri(uriLookup.Lvalue); //new Uri("https://dev.azure.com/inser13");

            var tokenLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_AccessToken");
            String personalAccessToken = tokenLookup.Lvalue; //"4b6dsojsubb7bzkowrm6krz5f7gjubfirckbvu5kn5nzmwdljkyq";  // See https://www.visualstudio.com/docs/integrate/get-started/authentication/pats                

            // Create a connection to the account
            VssConnection connection = new VssConnection(accountUri, new VssBasicCredential(string.Empty, personalAccessToken));

            // Get an instance of the work item tracking client
            WorkItemTrackingHttpClient witClient = connection.GetClient<WorkItemTrackingHttpClient>();

            try
            {
                // Get the specified work item
                WorkItem workitem = witClient.GetWorkItemAsync(id).Result;

                return Ok(workitem);
            }
            catch (AggregateException aex)
            {
                VssServiceException vssex = aex.InnerException as VssServiceException;
                if (vssex != null)
                {
                    throw vssex;
                }
                throw aex;
            }
        }

        public async Task<IActionResult> GetWorkItemComments(int id)
        {
            var uriLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_Uri");
            Uri accountUri = new Uri(uriLookup.Lvalue);

            var tokenLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_AccessToken");
            String personalAccessToken = tokenLookup.Lvalue;

            // Create a connection to the account
            VssConnection connection = new VssConnection(accountUri, new VssBasicCredential(string.Empty, personalAccessToken));

            // Get an instance of the work item tracking client
            WorkItemTrackingHttpClient witClient = connection.GetClient<WorkItemTrackingHttpClient>();

            try
            {
                // Get the specified work item
                WorkItemComments comments = witClient.GetCommentsAsync(id).Result;
                return Ok(comments);
            }
            catch (AggregateException aex)
            {
                VssServiceException vssex = aex.InnerException as VssServiceException;
                if (vssex != null)
                {
                    throw vssex;
                }
                throw aex;
            }
        }

        [HttpPost]
        public async Task<IActionResult> UploadFilesAjax()
        {
            try
            {
                CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

                var uriLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_Uri");
                Uri accountUri = new Uri(uriLookup.Lvalue);

                var tokenLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_AccessToken");
                String personalAccessToken = tokenLookup.Lvalue;

                var projectLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_Project");
                string Project = projectLookup.Lvalue;

                // Create a connection to the account
                VssConnection connection = new VssConnection(accountUri, new VssBasicCredential(string.Empty, personalAccessToken));

                // Get an instance of the work item tracking client
                WorkItemTrackingHttpClient witClient = connection.GetClient<WorkItemTrackingHttpClient>();

                JsonPatchDocument patchDocument = new JsonPatchDocument();

                var files = Request.Form.Files;
                var customHeaders = Request.Headers;
                StringValues taskId = "";
                if (customHeaders.ContainsKey("taskId"))
                {
                    customHeaders.TryGetValue("taskId", out taskId);
                }

                foreach (var file in files)
                {
                    ContentDispositionHeaderValue.TryParse(file.ContentDisposition, out ContentDispositionHeaderValue parsedContentDisposition);
                    var fileName = parsedContentDisposition.Name.TrimStart('\"').TrimEnd('\"');
                    Stream ms = file.OpenReadStream();

                    AttachmentReference attachment = witClient.CreateAttachmentAsync(ms, Project, fileName, null, null, null).Result;

                    patchDocument.Add(new JsonPatchOperation()
                    {
                        Operation = Operation.Add,
                        Path = "/relations/-",
                        Value = new
                        {
                            rel = "AttachedFile",
                            url = attachment.Url,
                            attributes = new { comment = "Emaintenance Attachment by " + cUser.Email }
                        }
                    });
                }
                WorkItem result = witClient.UpdateWorkItemAsync(patchDocument, Int32.Parse(taskId)).Result;
                return Ok(result);
            }
            catch (Exception ex)
            {
                throw ex;
            }
        }

        public async Task<IActionResult> GetWorkItemsByTag(string tag)
        {
            var uriLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_Uri");
            Uri accountUri = new Uri(uriLookup.Lvalue);

            var tokenLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_AccessToken");
            String personalAccessToken = tokenLookup.Lvalue;

            // Create a connection to the account
            VssConnection connection = new VssConnection(accountUri, new VssBasicCredential(string.Empty, personalAccessToken));

            // Get an instance of the work item tracking client
            WorkItemTrackingHttpClient witClient = connection.GetClient<WorkItemTrackingHttpClient>();

            //create a wiql object and build our query
            Wiql wiql = new Wiql()
            {
                Query = "Select [System.Id], [System.Title], [System.State] From WorkItems " +
                "Where [State] <> 'Closed' AND [State] <> 'Removed' AND [System.Tags] Contains '" + tag + "' " +
                        "order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc"
            };

            try
            {
                //execute the query to get the list of work items in the results
                WorkItemQueryResult workItemQueryResult = witClient.QueryByWiqlAsync(wiql).Result;
                List<WorkItem> workItemList = new List<WorkItem>();
                foreach (WorkItemReference wi in workItemQueryResult.WorkItems)
                {
                    workItemList.Add(witClient.GetWorkItemAsync(wi.Id).Result);
                }

                return Ok(workItemList);
            }
            catch (AggregateException aex)
            {
                VssServiceException vssex = aex.InnerException as VssServiceException;
                if (vssex != null)
                {
                    throw vssex;
                }
                throw aex;
            }
        }

        public async Task<IActionResult> GetWorkItems()
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);
            var uriLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_Uri");
            Uri accountUri = new Uri(uriLookup.Lvalue);

            var tokenLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_AccessToken");
            String personalAccessToken = tokenLookup.Lvalue;

            //var iterationLookup = await lookupRepo.GetLookupConfigByName("DevOps_IterationPath");
            //string IterationPath = iterationLookup.Lvalue;

            var areaLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_AreaPath");
            string AreaPath = null;
            if (areaLookup != null)
            {
                AreaPath = areaLookup.Lvalue;
            }

            // Create a connection to the account
            VssConnection connection = new VssConnection(accountUri, new VssBasicCredential(string.Empty, personalAccessToken));

            // Get an instance of the work item tracking client
            WorkItemTrackingHttpClient witClient = connection.GetClient<WorkItemTrackingHttpClient>();

            //create a wiql object and build our query
            Wiql wiql = new Wiql()
            {
                Query = "Select [System.Id], [System.Title], [System.State] From WorkItems " +
                "Where [System.Tags] contains '" + cUser.Email + "' " +
                "and [System.AreaPath] = '" + AreaPath + "' " +
                        "order by [Microsoft.VSTS.Common.Priority] asc, [System.CreatedDate] desc"
            };

            try
            {
                //execute the query to get the list of work items in the results
                WorkItemQueryResult workItemQueryResult = witClient.QueryByWiqlAsync(wiql).Result;
                List<WorkItem> workItemList = new List<WorkItem>();
                foreach (WorkItemReference wi in workItemQueryResult.WorkItems)
                {
                    workItemList.Add(witClient.GetWorkItemAsync(wi.Id, null, null, WorkItemExpand.Relations).Result);
                    //string[] splitString = wi.Url.ToString().Split('/');
                    //Guid attachmentId = new Guid(splitString[7].ToString());
                    //Stream attachmentStream = witClient.GetAttachmentContentAsync(attachmentId).Result;
                    //using (FileStream writeStream = new FileStream(fileFullPath, FileMode.Create, FileAccess.ReadWrite))
                    //{
                    //    attachmentStream.CopyTo(writeStream);
                    //}
                }

                return Ok(workItemList);
            }
            catch (AggregateException aex)
            {
                VssServiceException vssex = aex.InnerException as VssServiceException;
                if (vssex != null)
                {
                    throw vssex;
                }
                throw aex;
            }
        }

        public async Task<IActionResult> CreateWorkItem([FromBody]WorkTask wt)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

            var uriLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_Uri");
            Uri accountUri = new Uri(uriLookup.Lvalue);

            var tokenLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_AccessToken");
            String personalAccessToken = tokenLookup.Lvalue;

            var projectLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_Project");
            wt.Project = projectLookup.Lvalue;

            // Create a connection to the account
            VssConnection connection = new VssConnection(accountUri, new VssBasicCredential(string.Empty, personalAccessToken));

            // Get an instance of the work item tracking client
            WorkItemTrackingHttpClient witClient = connection.GetClient<WorkItemTrackingHttpClient>();

            JsonPatchDocument patchDocument = new JsonPatchDocument
            {
                //add fields and their values to your patch document
                new JsonPatchOperation()
                {
                    Operation = Operation.Add,
                    Path = "/fields/System.Title",
                    Value = wt.Title
                },
                new JsonPatchOperation()
                {
                    Operation = Operation.Add,
                    Path = (wt.Type == "Bug" ? "/fields/Microsoft.VSTS.TCM.ReproSteps" : "/fields/System.Description"),
                    Value = wt.Description
                }
            };

            var iterationLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_IterationPath");
            if (iterationLookup != null)
            {
                patchDocument.Add(new JsonPatchOperation()
                {
                    Operation = Operation.Add,
                    Path = "/fields/System.IterationPath",
                    Value = iterationLookup.Lvalue
                });
            }

            var parentRelationLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_ParentRelation");
            if (parentRelationLookup != null)
            {
                int id = Int32.Parse(parentRelationLookup.Lvalue);
                WorkItem workitem = witClient.GetWorkItemAsync(id).Result;

                patchDocument.Add(new JsonPatchOperation()
                {
                    Operation = Operation.Add,
                    Path = "/relations/-",
                    Value = new
                    {
                        rel = "System.LinkTypes.Hierarchy-Reverse",
                        url = workitem.Url
                        //url = "https://dev.azure.com/inser13/SKF-Emaintenance/_apis/wit/workItems/2308"
                    }
                });
            }

            var areaPathLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_AreaPath");
            if (areaPathLookup != null)
            {
                patchDocument.Add(new JsonPatchOperation()
                {
                    Operation = Operation.Add,
                    Path = "/fields/System.AreaPath",
                    Value = areaPathLookup.Lvalue
                });
            }

            if (wt.Priority != string.Empty && wt.Priority != null)
            {
                patchDocument.Add(new JsonPatchOperation()
                {
                    Operation = Operation.Add,
                    Path = "/fields/Microsoft.VSTS.Common.Priority",
                    Value = wt.Priority
                });
            }

            patchDocument.Add(new JsonPatchOperation()
            {
                Operation = Operation.Add,
                Path = "/fields/System.Tags",
                Value = wt.Tags + "," + cUser.Email
            });

            //if (wt.Comment != string.Empty && wt.Comment != null)
            //{
            //    patchDocument.Add(new JsonPatchOperation()
            //    {
            //        Operation = Operation.Add,
            //        Path = "/fields/System.History",
            //        Value = wt.Comment + "<p>By :" + cUser.Email + "</p>"
            //    });
            //}

            if (wt.DeviceInfo != string.Empty && wt.DeviceInfo != null)
            {
                string Comment = null;
                if (wt.Comment != string.Empty && wt.Comment != null)
                {
                    Comment = wt.Comment + "<p>By :" + cUser.Email + "</p>";
                }
                Comment = Comment + "</p>" + wt.DeviceInfo;
                patchDocument.Add(new JsonPatchOperation()
                {
                    Operation = Operation.Add,
                    Path = "/fields/System.History",
                    Value = Comment
                });
            }

            try
            {
                if (wt.ScreenShot != string.Empty && wt.ScreenShot != null)
                {
                    string convert = wt.ScreenShot.Replace("data:image/png;base64,", String.Empty);
                    var stream = new MemoryStream(Convert.FromBase64String(convert));
                    AttachmentReference attachment = witClient.CreateAttachmentAsync(stream, wt.Project, "ScreenShot.jpg", null, null, null).Result;

                    patchDocument.Add(new JsonPatchOperation()
                    {
                        Operation = Operation.Add,
                        Path = "/relations/-",
                        Value = new
                        {
                            rel = "AttachedFile",
                            url = attachment.Url,
                            attributes = new { comment = "Emaintenance Attachment by " + cUser.Email }
                        }
                    });
                }
                WorkItem result = witClient.CreateWorkItemAsync(patchDocument, wt.Project, wt.Type).Result;
                return Ok(result);
            }
            catch (AggregateException ex)
            {
                throw ex;
            }
        }

        public async Task<IActionResult> UpdateWorkItem([FromBody]WorkTask wt)
        {
            CurrentUser cUser = new CurrentUser(HttpContext, _configuration);

            var uriLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_Uri");
            Uri accountUri = new Uri(uriLookup.Lvalue);

            var tokenLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_AccessToken");
            String personalAccessToken = tokenLookup.Lvalue;

            var projectLookup = await lookupRepo.GetLookupConfigByName(0, "Y", "DevOps_Project");
            wt.Project = projectLookup.Lvalue;

            // Create a connection to the account
            VssConnection connection = new VssConnection(accountUri, new VssBasicCredential(string.Empty, personalAccessToken));

            // Get an instance of the work item tracking client
            WorkItemTrackingHttpClient witClient = connection.GetClient<WorkItemTrackingHttpClient>();

            JsonPatchDocument patchDocument = new JsonPatchDocument
            {
                new JsonPatchOperation()
                {
                    Operation = Operation.Add,
                    Path = "/fields/System.History",
                    Value = wt.Comment + "<p>By : " + cUser.Email + "</p>"
                }
            };

            if (wt.Priority != string.Empty && wt.Priority != null)
            {
                patchDocument.Add(new JsonPatchOperation()
                {
                    Operation = Operation.Replace,
                    Path = "/fields/Microsoft.VSTS.Common.Priority",
                    Value = wt.Priority
                });
            }

            try
            {
                if (wt.ScreenShot != string.Empty && wt.ScreenShot != null)
                {
                    string convert = wt.ScreenShot.Replace("data:image/png;base64,", String.Empty);
                    var stream = new MemoryStream(Convert.FromBase64String(convert));
                    AttachmentReference attachment = witClient.CreateAttachmentAsync(stream, wt.Project, "ScreenShot.jpg", null, null, null).Result;

                    patchDocument.Add(new JsonPatchOperation()
                    {
                        Operation = Operation.Add,
                        Path = "/relations/-",
                        Value = new
                        {
                            rel = "AttachedFile",
                            url = attachment.Url,
                            attributes = new { comment = "Emaintenance Attachment by " + cUser.Email }
                        }
                    });
                }
                WorkItem result = witClient.UpdateWorkItemAsync(patchDocument, Int32.Parse(wt.Id)).Result;
                return Ok(result);
            }
            catch (AggregateException ex)
            {
                throw ex;
            }
        }
    }

    public class WorkTask
    {
        public string Id { get; set; }
        public string Project { get; set; }
        public string Tags { get; set; }
        public string Type { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Comment { get; set; }
        public string Priority { get; set; }
        public string ScreenShot { get; set; }
        public string DeviceInfo { get; set; }
    }
}
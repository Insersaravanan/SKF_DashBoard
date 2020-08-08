using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class JobViewModel
    {
        [JsonProperty(PropertyName = "JobId")]
        public long JobId { get; set; }
        [JsonProperty(PropertyName = "ScheduleSetupId")]
        public int? ScheduleSetupId { get; set; }
        [JsonProperty(PropertyName = "StatusId")]
        public int StatusId { get; set; }
        [JsonProperty(PropertyName = "JobNumber")]
        public string JobNumber { get; set; }
        [JsonProperty(PropertyName = "JobName")]
        public string JobName { get; set; }
        [JsonProperty(PropertyName = "ClientSiteId")]
        public int ClientSiteId { get; set; }
        [JsonProperty(PropertyName = "EstStartDate")]
        public DateTime EstStartDate { get; set; }
        [JsonProperty(PropertyName = "EstEndDate")]
        public DateTime EstEndDate { get; set; }
        [JsonProperty(PropertyName = "AnalystId")]
        public int? AnalystId { get; set; }
        [JsonProperty(PropertyName = "DataCollectionDate")]
        public DateTime? DataCollectionDate { get; set; }
        [JsonProperty(PropertyName = "ProgramTypeId")]
        public int ProgramTypeId { get; set; }
        [JsonProperty(PropertyName = "ReportDate")]
        public DateTime? ReportDate { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
        [JsonProperty(PropertyName = "JobServices")]
        public List<JobServicesViewModel> JobServices { get; set; }
        [JsonProperty(PropertyName = "JobEquipments")]
        public List<JobEquipmentsViewModel> JobEquipments { get; set; }
    }

    public class JobEquipmentsViewModel
    {
        [JsonProperty(PropertyName = "JobEquipmentId")]
        public long JobEquipmentId { get; set; }
        [JsonProperty(PropertyName = "JobId")]
        public long JobId { get; set; }
        [JsonProperty(PropertyName = "EquipmentId")]
        public int EquipmentId { get; set; }
        [JsonProperty(PropertyName = "StatusId")]
        public int StatusId { get; set; }
        [JsonProperty(PropertyName = "ConditionId")]
        public int ConditionId { get; set; }
        [JsonProperty(PropertyName = "EquipmentComments")]
        public string EquipmentComments { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; } = "Y";
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
    }

    public class JobServicesViewModel
    {
        [JsonProperty(PropertyName = "JobServiceId")]
        public long JobServiceId { get; set; }
        [JsonProperty(PropertyName = "JobId")]
        public long JobId { get; set; }
        [JsonProperty(PropertyName = "ServiceId")]
        public int ServiceId { get; set; }
        [JsonProperty(PropertyName = "ServiceName")]
        public string ServiceName { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; } = "Y";
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
    }

    public class JobEquipOilPropertiesViewModel
    {
        [JsonProperty(PropertyName = "JobEquipOilPropertiesId")]
        public int JobEquipOilPropertiesId { get; set; }
        [JsonProperty(PropertyName = "JobEquipmentId")]
        public int JobEquipmentId { get; set; }
        [JsonProperty(PropertyName = "OilPropertiesId")]
        public int? OilPropertiesId { get; set; }
        [JsonProperty(PropertyName = "OilLevel")]
        public string OilLevel { get; set; }
        [JsonProperty(PropertyName = "SeverityId")]
        public int? SeverityId { get; set; }
        [JsonProperty(PropertyName = "OAVibChangePercentageId")]
        public int? OAVibChangePercentageId { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
    }

    public class AssignUsersViewModel
    {
        [JsonProperty(PropertyName = "Type")]
        public string Type { get; set; }
        [JsonProperty(PropertyName = "Id")]
        public long Id { get; set; }
        [JsonProperty(PropertyName = "JobId")]
        public long JobId { get; set; }
        [JsonProperty(PropertyName = "JobEquipmentId")]
        public long JobEquipmentId { get; set; }
        [JsonProperty(PropertyName = "DataCollectionMode")]
        public int? DataCollectionMode { get; set; }
        [JsonProperty(PropertyName = "AnalystId")]
        public int? AnalystId { get; set; }
        [JsonProperty(PropertyName = "DataCollectorId")]
        public int? DataCollectorId { get; set; }
        [JsonProperty(PropertyName = "ReviewerId")]
        public int? ReviewerId { get; set; }
        public int UserId { get; set; }
    }
}

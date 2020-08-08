using Newtonsoft.Json;
using System;

namespace EMaintanance.ViewModels
{
    public class ScheduleEntityModel
    {

        [JsonProperty(PropertyName = "ScheduleSetupId")]
        public int ScheduleSetupId { get; set; }
        [JsonProperty(PropertyName = "ClientSiteId")]
        public int ClientSiteId { get; set; }
        [JsonProperty(PropertyName = "ScheduleName")]
        public string ScheduleName { get; set; }
        [JsonProperty(PropertyName = "StartDate")]
        public DateTime StartDate { get; set; }
        [JsonProperty(PropertyName = "EndDate")]
        public DateTime EndDate { get; set; }
        [JsonProperty(PropertyName = "IntervalDays")]
        public int IntervalDays { get; set; }
        [JsonProperty(PropertyName = "EstJobDays")]
        public int EstJobDays { get; set; }
        [JsonProperty(PropertyName = "StatusId")]
        public int StatusId { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
        [JsonProperty(PropertyName = "ScheduleServices")]
        public string ScheduleServices { get; set; }
        [JsonProperty(PropertyName = "ScheduleEquipments")]
        public string ScheduleEquipments { get; set; }
    }

    public class ScheduleEquipmentsEntityModel
    {
        [JsonProperty(PropertyName = "ScheduleEquipmentId")]
        public int ScheduleEquipmentId { get; set; }
        [JsonProperty(PropertyName = "ScheduleSetupId")]
        public int ScheduleSetupId { get; set; }
        [JsonProperty(PropertyName = "PlantAreaId")]
        public int PlantAreaId { get; set; }
        [JsonProperty(PropertyName = "PlantAreaName")]
        public string PlantAreaName { get; set; }
        [JsonProperty(PropertyName = "EquipmentId")]
        public int EquipmentId { get; set; }
        [JsonProperty(PropertyName = "EquipmentName")]
        public string EquipmentName { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; } = "Y";

    }

    public class ScheduleServicesEntityModel
    {
        [JsonProperty(PropertyName = "ScheduleServiceId")]
        public int ScheduleServiceId { get; set; }
        [JsonProperty(PropertyName = "ServiceId")]
        public int ServiceId { get; set; }
        [JsonProperty(PropertyName = "ServiceName")]
        public string ServiceName { get; set; }
        [JsonProperty(PropertyName = "TargetDays")]
        public int TargetDays { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; } = "Y";

    }

}

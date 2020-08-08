using Newtonsoft.Json;
using System;

namespace EMaintanance.ViewModels
{
    public class AlarmEmailNotificationEntityModel
    {

        [JsonProperty(PropertyName = "AlarmEmailNotificationSetupId")]
        public int AlarmEmailNotificationSetupId { get; set; }
        [JsonProperty(PropertyName = "ClientSiteId")]
        public int ClientSiteId { get; set; }
        [JsonProperty(PropertyName = "AlarmEmailNotificationName")]
        public string AlarmEmailNotificationName { get; set; }
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
        [JsonProperty(PropertyName = "AlarmEmailNotificationServices")]
        public string AlarmEmailNotificationServices { get; set; }
        [JsonProperty(PropertyName = "AlarmEmailNotificationEquipments")]
        public string AlarmEmailNotificationEquipments { get; set; }
    }

    public class AlarmEmailNotificationEquipmentsEntityModel
    {
        [JsonProperty(PropertyName = "AlarmEmailNotificationEquipmentId")]
        public int AlarmEmailNotificationEquipmentId { get; set; }
        [JsonProperty(PropertyName = "AlarmEmailNotificationSetupId")]
        public int AlarmEmailNotificationSetupId { get; set; }
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

    public class AlarmEmailNotificationServicesEntityModel
    {
        [JsonProperty(PropertyName = "AlarmEmailNotificationServiceId")]
        public int AlarmEmailNotificationServiceId { get; set; }
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

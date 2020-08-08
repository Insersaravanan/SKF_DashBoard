using Newtonsoft.Json;
using System;

namespace EMaintanance.ViewModels
{
    public class AlarmSMSNotificationEntityModel
    {

        [JsonProperty(PropertyName = "AlarmSMSNotificationSetupId")]
        public int AlarmSMSNotificationSetupId { get; set; }
        [JsonProperty(PropertyName = "ClientSiteId")]
        public int ClientSiteId { get; set; }
        [JsonProperty(PropertyName = "AlarmSMSNotificationName")]
        public string AlarmSMSNotificationName { get; set; }
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
        [JsonProperty(PropertyName = "AlarmSMSNotificationServices")]
        public string AlarmSMSNotificationServices { get; set; }
        [JsonProperty(PropertyName = "AlarmSMSNotificationEquipments")]
        public string AlarmSMSNotificationEquipments { get; set; }
    }

    public class AlarmSMSNotificationEquipmentsEntityModel
    {
        [JsonProperty(PropertyName = "AlarmSMSNotificationEquipmentId")]
        public int AlarmSMSNotificationEquipmentId { get; set; }
        [JsonProperty(PropertyName = "AlarmSMSNotificationSetupId")]
        public int AlarmSMSNotificationSetupId { get; set; }
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

    public class AlarmSMSNotificationServicesEntityModel
    {
        [JsonProperty(PropertyName = "AlarmSMSNotificationServiceId")]
        public int AlarmSMSNotificationServiceId { get; set; }
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

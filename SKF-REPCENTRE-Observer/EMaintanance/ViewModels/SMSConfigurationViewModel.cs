using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace EMaintanance.ViewModels
{
    public class SMSConfigurationViewModel
    {
        [JsonProperty(PropertyName = "AlarmSMSNotificationSetupId")]
        public int AlarmSMSNotificationSetupId { get; set; }
        [JsonProperty(PropertyName = "ClientSiteId")]
        public int ClientSiteId { get; set; }
        [JsonProperty(PropertyName = "AlarmSMSNotificationID")]
        public string AlarmSMSNotificationID { get; set; }
        [JsonProperty(PropertyName = "IntervalDays")]
        public int IntervalDays { get; set; }
        [JsonProperty(PropertyName = "AdditionalSMSID")]
        public string AdditionalSMSID { get; set; }
        [JsonProperty(PropertyName = "StatusId")]
        public int? StatusId { get; set; }
      
        [JsonProperty(PropertyName = "UserId")]
        public int? UserId { get; set; }

        [JsonProperty(PropertyName = "AlarmSMSNotificationEquipments")]
        public List<AlarmSMSNotificationEquipmentsViewModel> AlarmSMSNotificationEquipments { get; set; }
    }

    public class AlarmSMSNotificationEquipmentsViewModel
    {
        [JsonProperty(PropertyName = "AlarmSMSNotificationEquipmentId")]
        public int AlarmSMSNotificationEquipmentId { get; set; }
        [JsonProperty(PropertyName = "AlarmSMSNotificationId")]
        public int AlarmSMSNotificationId { get; set; }
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

}

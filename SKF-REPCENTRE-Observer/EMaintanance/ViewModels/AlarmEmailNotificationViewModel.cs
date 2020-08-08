using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace EMaintanance.ViewModels
{
    public class AlarmEmailNotificationViewModel
    {
        [JsonProperty(PropertyName = "AlarmEmailNotificationSetupId")]
        public int AlarmEmailNotificationSetupId { get; set; }
        [JsonProperty(PropertyName = "ClientSiteId")]
        public int ClientSiteId { get; set; }
        [JsonProperty(PropertyName = "AlarmEmailNotificationID")]
        public string AlarmEmailNotificationID { get; set; }
        [JsonProperty(PropertyName = "AlarmSMSNotificationNo")]
        public string AlarmSMSNotificationNo { get; set; }

        [JsonProperty(PropertyName = "IntervalDays")]
        public int IntervalDays { get; set; }
        [JsonProperty(PropertyName = "AdditionalEmailID")]
        public string AdditionalEmailID { get; set; }
        [JsonProperty(PropertyName = "AdditionalMobileNo")]
        public string AdditionalMobileNo { get; set; }
        [JsonProperty(PropertyName = "StatusId")]
        public int? StatusId { get; set; }
        
        [JsonProperty(PropertyName = "UserId")]
        public int? UserId { get; set; }
        
        [JsonProperty(PropertyName = "AlarmEmailNotificationEquipments")]
        public List<AlarmEmailNotificationEquipmentsViewModel> AlarmEmailNotificationEquipments { get; set; }

    }

    public class AlarmEmailNotificationEquipmentsViewModel
    {
        [JsonProperty(PropertyName = "AlarmEmailNotificationEquipmentId")]
        public int AlarmEmailNotificationEquipmentId { get; set; }
        [JsonProperty(PropertyName = "AlarmEmailNotificationId")]
        public int AlarmEmailNotificationId { get; set; }
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

    public class AlarmEmailNotificationServicesViewModel
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

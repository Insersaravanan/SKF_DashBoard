using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;
using System.IO;



namespace EMaintanance.ViewModels
{
    public class ObserverDashboardViewModel
    {
        public int? EquipmentId { get; set; }
        public int? PlantAreaId { get; set; }

        public int? AreaId { get; set; }
        public int? ClientSiteId { get; set; }
        public int? CountryId { get; set; }
        public string Type { get; set; }
        public string UnitType { get; set; }
        public int UserId { get; set; }
        public int? UnitId { get; set; }
    }
    public class ObserverEMaintEquipmentPriorityViewModel
    {
        public int UserId { get; set; }
        public int? CountryId { get; set; }
        public int? ClientSiteId { get; set; }
        public int? PlantAreaId { get; set; }
        public int? EquipmentId { get; set; }
        public string UnitType { get; set; }
        public int? UnitId { get; set; }
    }
    public class ListEMaintEquipmentPriorityViewModel
    {
        public int UserId { get; set; }
        public int? CountryId { get; set; }
        public int? ClientSiteId { get; set; }
        public int? PlantAreaId { get; set; }
        public int? EquipmentId { get; set; }
        public string UnitType { get; set; }
        public int? UnitId { get; set; }
        public int PriorityId { get; set; }
    }
    public class ListEMaintEquipmentHealthViewModel
    {
        public int UserId { get; set; }
        public int? CountryId { get; set; }
        public int? ClientSiteId { get; set; }
        public int? PlantAreaId { get; set; }
        public int ConditionId { get; set; }
        public int SectorId { get; set; }
    }
    public class ListEMaintAssetClassByAssetIDViewModel
    {
        public int UserId { get; set; }
        public int? CountryId { get; set; }
        public int? ClientSiteId { get; set; }
        public int? PlantAreaId { get; set; }
        public int ConditionId { get; set; }
        public int AssetId { get; set; }
        public string  AssetName { get; set; }
    }
    public class ListEMaintSectorByCustomerViewModel
    {
        public int UserId { get; set; }
        public int? CountryId { get; set; }
        public int? ClientSiteId { get; set; }
        public int? PlantAreaId { get; set; }
        public int ConditionId { get; set; }
        public int SectorId { get; set; }
    }

    public class ListEMaintSectorByFailureCauseViewModel
    {
        public int UserId { get; set; }
        public int? CountryId { get; set; }
        public int? ClientSiteId { get; set; }
        public int? PlantAreaId { get; set; }
        public int ConditionId { get; set; }
        public int SectorId { get; set; }
    }

    public class FeedBackEmailSendViewModel
    {
        [JsonProperty(PropertyName = "FromEmail")]
        public string FromEmail { get; set; }
        public string ToMail { get; set; }
        //[JsonProperty(PropertyName = "ToEmailList")]
        //public List<EmailsenderAttViewModel> ToEmailList { get; set; }
        [JsonProperty(PropertyName = "Subject")]
        public string Subject { set; get; }
        [JsonProperty(PropertyName = "Body")]
        public string Body { set; get; }
    }

}

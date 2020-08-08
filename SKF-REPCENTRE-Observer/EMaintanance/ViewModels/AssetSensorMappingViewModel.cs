using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class AssetSensorMappingViewModel
    {
        public int ClientSiteId { get; set; }
        public int PlantAreaId { get; set; }
        public string UnitType { get; set; }
        public int? EquipmentId { get; set; }
        public int? UnitID { get; set; }
        [JsonProperty(PropertyName = "Shaft")]
        public List<AssetShaft> Shaft { get; set; }
        public int? UserId { get; set; }
    }

    public class AssetShaft
    {
        public int? ShaftId { get; set; }
        public int? UnitId { get; set; }
        public string ShaftOrder { get; set; }
        public string ShaftName { get; set; }
        [JsonProperty(PropertyName = "DriveEnd")]
        public List<AssetShaftSide> DriveEnd { get; set; }
        [JsonProperty(PropertyName = "NonDriveEnd")]
        public List<AssetShaftSide> NonDriveEnd { get; set; }
    }

    public class AssetShaftSide
    {
        public int? ShaftSideId { get; set; }
        public int? ShaftId { get; set; }
        [JsonProperty(PropertyName = "ShaftSide")]
        public string ShaftSideVar { get; set; }
        public List<Sensors> Sensors { get; set; }
    }

    public class Sensors
    {
        public int? UnitSensorId { get; set; }
        public string NodePath { get; set; }
        public string Active { get; set; }
        public string NodeName { get; set; }
        public int? IDNode { get; set; }
        public int? SensorOrientationid { get; set; }
        public decimal Warning { get; set; }
        public decimal Alarm { get; set; }
        public int EUnitId { get; set; }
        public string SensorTitle { get; set; }
    }
}

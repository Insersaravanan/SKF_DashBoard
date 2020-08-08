using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class EquipmentViewModel
    {
        [JsonProperty(PropertyName = "EquipmentId")]
        public int EquipmentId { get; set; }
        [JsonProperty(PropertyName = "Type")]
        public string Type { get; set; } // This parameter will Used to hold whether it is 'Equipment | Drive | Intermediate | Driven'
        [JsonProperty(PropertyName = "PlantAreaId")]
        public int PlantAreaId { get; set; }
        [JsonProperty(PropertyName = "EquipmentCode")]
        public string EquipmentCode { get; set; }
        [JsonProperty(PropertyName = "EquipmentName")]
        public string EquipmentName { get; set; }
        [JsonProperty(PropertyName = "Descriptions")]
        public string Descriptions { get; set; }
        [JsonProperty(PropertyName = "ListOrder")]
        public int? ListOrder { get; set; }
        [JsonProperty(PropertyName = "OrientationId")]
        public int? OrientationId { get; set; }
        [JsonProperty(PropertyName = "Orientation")]
        public string Orientation { get; set; }
        [JsonProperty(PropertyName = "MountingId")]
        public int? MountingId { get; set; }
        [JsonProperty(PropertyName = "Mounting")]
        public string Mounting { get; set; }
        [JsonProperty(PropertyName = "StandByEquipId")]
        public int? StandByEquipId { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        public int UserId { get; set; }
        [JsonProperty(PropertyName = "DriveUnits")]
        public List<DriveUnitViewModel> DriveUnits { get; set; }
        [JsonProperty(PropertyName = "IntermediateUnits")]
        public List<IntermediateUnitViewModel> IntermediateUnits { get; set; }
        [JsonProperty(PropertyName = "DrivenUnits")]
        public List<DrivenUnitViewModel> DrivenUnits { get; set; }
        public int? AreaId { get; set; }
        public int? SystemId { get; set; }
    }

    public class DriveUnitViewModel
    {
        [JsonProperty(PropertyName = "DriveUnitId")]
        public int DriveUnitId { get; set; }
        [JsonProperty(PropertyName = "EquipmentId")]
        public int EquipmentId { get; set; }
        [JsonProperty(PropertyName = "IdentificationName")]
        public string IdentificationName { get; set; }
        [JsonProperty(PropertyName = "AssetId")]
        public int AssetId { get; set; }
        [JsonProperty(PropertyName = "ListOrder")]
        public int? ListOrder { get; set; }
        [JsonProperty(PropertyName = "ManufacturerId")]
        public int? ManufacturerId { get; set; }
        [JsonProperty(PropertyName = "Manufacturer")]
        public string Manufacturer { get; set; }
        [JsonProperty(PropertyName = "RPM")]
        public string RPM { get; set; }
        [JsonProperty(PropertyName = "Frame")]
        public string Frame { get; set; }
        [JsonProperty(PropertyName = "Voltage")]
        public string Voltage { get; set; }
        [JsonProperty(PropertyName = "PowerFactor")]
        public string PowerFactor { get; set; }
        [JsonProperty(PropertyName = "UnitRate")]
        public string UnitRate { get; set; }
        [JsonProperty(PropertyName = "Model")]
        public string Model { get; set; }
        [JsonProperty(PropertyName = "HP")]
        public string HP { get; set; }
        [JsonProperty(PropertyName = "MType")]
        public string Type { get; set; }
        [JsonProperty(PropertyName = "MotorFanBlades")]
        public string MotorFanBlades { get; set; }
        [JsonProperty(PropertyName = "SerialNumber")]
        public string SerialNumber { get; set; }
        [JsonProperty(PropertyName = "RotorBars")]
        public string RotorBars { get; set; }
        [JsonProperty(PropertyName = "Poles")]
        public string Poles { get; set; }
        [JsonProperty(PropertyName = "Slots")]
        public string Slots { get; set; }
        //[JsonProperty(PropertyName = "BearingDriveEndId")]
        //public int? BearingDriveEndId { get; set; }
        //[JsonProperty(PropertyName = "BearingNonDriveEndId")]
        //public int? BearingNonDriveEndId { get; set; }
        [JsonProperty(PropertyName = "PulleyDiaDrive")]
        public string PulleyDiaDrive { get; set; }
        [JsonProperty(PropertyName = "PulleyDiaDriven")]
        public string PulleyDiaDriven { get; set; }
        [JsonProperty(PropertyName = "BeltLength")]
        public string BeltLength { get; set; }
        [JsonProperty(PropertyName = "CouplingId")]
        public int? CouplingId { get; set; }
        [JsonProperty(PropertyName = "MeanRepairManHours")]
        public string MeanRepairManHours { get; set; }
        [JsonProperty(PropertyName = "DownTimeCostPerHour")]
        public string DownTimeCostPerHour { get; set; }
        [JsonProperty(PropertyName = "CostToRepair")]
        public string CostToRepair { get; set; }
        [JsonProperty(PropertyName = "MeanFailureRate")]
        public string MeanFailureRate { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
        [JsonProperty(PropertyName = "BearingDriveEnd")]
        public List<DriveBearingViewModel> BearingDriveEnd { get; set; }
        [JsonProperty(PropertyName = "BearingNonDriveEnd")]
        public List<NonDriveBearingViewModel> BearingNonDriveEnd { get; set; }
        [JsonProperty(PropertyName = "Shaft")]
        public List<Shaft> Shaft { get; set; }
        [JsonProperty(PropertyName = "ReportingServices")]
        public List<UnitServiceViewModel> ReportingServices { get; set; }
        [JsonProperty(PropertyName = "ManufactureYear")]
        public int? ManufactureYear { get; set; }
        [JsonProperty(PropertyName = "FirstInstallationDate")]
        public DateTime? FirstInstallationDate { get; set; }
        [JsonProperty(PropertyName = "OperationModeId")]
        public int? OperationModeId { get; set; }
        [JsonProperty(PropertyName = "SensorProviderId")]
        public int? SensorProviderId { get; set; }
        [JsonProperty(PropertyName = "SpeedTypeId")]
        public int SpeedTypeId { get; set; }
        [JsonProperty(PropertyName = "LineFrequencyId")]
        public int? LineFrequencyId { get; set; }
        [JsonProperty(PropertyName = "MinRPM")]
        public decimal? MinRPM { get; set; }
        [JsonProperty(PropertyName = "MaxRPM")]
        public decimal? MaxRPM { get; set; }
    }

    public class IntermediateUnitViewModel
    {
        [JsonProperty(PropertyName = "IntermediateUnitId")]
        public int IntermediateUnitId { get; set; }
        [JsonProperty(PropertyName = "EquipmentId")]
        public int EquipmentId { get; set; }
        [JsonProperty(PropertyName = "IdentificationName")]
        public string IdentificationName { get; set; }
        [JsonProperty(PropertyName = "AssetId")]
        public int AssetId { get; set; }
        [JsonProperty(PropertyName = "ListOrder")]
        public int? ListOrder { get; set; }
        [JsonProperty(PropertyName = "ManufacturerId")]
        public int? ManufacturerId { get; set; }
        [JsonProperty(PropertyName = "Manufacturer")]
        public string Manufacturer { get; set; }
        [JsonProperty(PropertyName = "Ratio")]
        public string Ratio { get; set; }
        [JsonProperty(PropertyName = "Size")]
        public string Size { get; set; }
        [JsonProperty(PropertyName = "BeltLength")]
        public string BeltLength { get; set; }
        [JsonProperty(PropertyName = "PulleyDiaDrive")]
        public string PulleyDiaDrive { get; set; }
        [JsonProperty(PropertyName = "PulleyDiaDriven")]
        public string PulleyDiaDriven { get; set; }
        [JsonProperty(PropertyName = "RatedRPMInput")]
        public string RatedRPMInput { get; set; }
        [JsonProperty(PropertyName = "RatedRPMOutput")]
        public string RatedRPMOutput { get; set; }
        [JsonProperty(PropertyName = "PinionInputGearTeeth")]
        public string PinionInputGearTeeth { get; set; }
        [JsonProperty(PropertyName = "PinionOutputGearTeeth")]
        public string PinionOutputGearTeeth { get; set; }
        [JsonProperty(PropertyName = "IdlerInputGearTeeth")]
        public string IdlerInputGearTeeth { get; set; }
        [JsonProperty(PropertyName = "IdlerOutputGearTeeth")]
        public string IdlerOutputGearTeeth { get; set; }
        [JsonProperty(PropertyName = "BullGearTeeth")]
        public string BullGearTeeth { get; set; }
        [JsonProperty(PropertyName = "Model")]
        public string Model { get; set; }
        [JsonProperty(PropertyName = "Serial")]
        public string Serial { get; set; }
        //[JsonProperty(PropertyName = "BearingInputId")]
        //public int? BearingInputId { get; set; }
        //[JsonProperty(PropertyName = "BearingOutputId")]
        //public int? BearingOutputId { get; set; }
        [JsonProperty(PropertyName = "MeanRepairManHours")]
        public string MeanRepairManHours { get; set; }
        [JsonProperty(PropertyName = "DownTimeCostPerHour")]
        public string DownTimeCostPerHour { get; set; }
        [JsonProperty(PropertyName = "CostToRepair")]
        public string CostToRepair { get; set; }
        [JsonProperty(PropertyName = "MeanFailureRate")]
        public string MeanFailureRate { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
        [JsonProperty(PropertyName = "BearingDriveEnd")]
        public List<DriveBearingViewModel> BearingDriveEnd { get; set; }
        [JsonProperty(PropertyName = "BearingNonDriveEnd")]
        public List<NonDriveBearingViewModel> BearingNonDriveEnd { get; set; }
        [JsonProperty(PropertyName = "Shaft")]
        public List<Shaft> Shaft { get; set; }
        [JsonProperty(PropertyName = "ReportingServices")]
        public List<UnitServiceViewModel> ReportingServices { get; set; }
        [JsonProperty(PropertyName = "ManufactureYear")]
        public int? ManufactureYear { get; set; }
        [JsonProperty(PropertyName = "FirstInstallationDate")]
        public DateTime? FirstInstallationDate { get; set; }
        [JsonProperty(PropertyName = "OperationModeId")]
        public int? OperationModeId { get; set; }
        [JsonProperty(PropertyName = "SensorProviderId")]
        public int? SensorProviderId { get; set; }
    }

    public class DrivenUnitViewModel
    {
        [JsonProperty(PropertyName = "DrivenUnitId")]
        public int DrivenUnitId { get; set; }
        [JsonProperty(PropertyName = "EquipmentId")]
        public int EquipmentId { get; set; }
        [JsonProperty(PropertyName = "IdentificationName")]
        public string IdentificationName { get; set; }
        [JsonProperty(PropertyName = "AssetId")]
        public int AssetId { get; set; }
        [JsonProperty(PropertyName = "ListOrder")]
        public int? ListOrder { get; set; }
        [JsonProperty(PropertyName = "ManufacturerId")]
        public int? ManufacturerId { get; set; }
        [JsonProperty(PropertyName = "Manufacturer")]
        public string Manufacturer { get; set; }
        [JsonProperty(PropertyName = "MaxRPM")]
        public string MaxRPM { get; set; }
        [JsonProperty(PropertyName = "Capacity")]
        public string Capacity { get; set; }
        [JsonProperty(PropertyName = "Model")]
        public string Model { get; set; }
        [JsonProperty(PropertyName = "Lubrication")]
        public string Lubrication { get; set; }
        [JsonProperty(PropertyName = "SerialNumber")]
        public string SerialNumber { get; set; }
        [JsonProperty(PropertyName = "RatedFlowGPM")]
        public string RatedFlowGPM { get; set; }
        [JsonProperty(PropertyName = "PumpEfficiency")]
        public string PumpEfficiency { get; set; }
        [JsonProperty(PropertyName = "RatedSuctionPressure")]
        public string RatedSuctionPressure { get; set; }
        [JsonProperty(PropertyName = "Efficiency")]
        public string Efficiency { get; set; }
        [JsonProperty(PropertyName = "RatedDischargePressure")]
        public string RatedDischargePressure { get; set; }
        [JsonProperty(PropertyName = "CostPerUnit")]
        public string CostPerUnit { get; set; }
        //[JsonProperty(PropertyName = "BearingDriveEndId")]
        //public int? BearingDriveEndId { get; set; }
        //[JsonProperty(PropertyName = "BearingNonDriveEndId")]
        //public int? BearingNonDriveEndId { get; set; }
        [JsonProperty(PropertyName = "ImpellerVanes")]
        public string ImpellerVanes { get; set; }
        [JsonProperty(PropertyName = "ImpellerVanesKW")]
        public string ImpellerVanesKW { get; set; }
        [JsonProperty(PropertyName = "Stages")]
        public string Stages { get; set; }
        [JsonProperty(PropertyName = "NumberOfPistons")]
        public string NumberOfPistons { get; set; }
        [JsonProperty(PropertyName = "PumpType")]
        public string PumpType { get; set; }
        [JsonProperty(PropertyName = "MeanRepairManHours")]
        public string MeanRepairManHours { get; set; }
        [JsonProperty(PropertyName = "DownTimeCostPerHour")]
        public string DownTimeCostPerHour { get; set; }
        [JsonProperty(PropertyName = "CostToRepair")]
        public string CostToRepair { get; set; }
        [JsonProperty(PropertyName = "MeanFailureRate")]
        public string MeanFailureRate { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
        [JsonProperty(PropertyName = "BearingDriveEnd")]
        public List<DriveBearingViewModel> BearingDriveEnd { get; set; }
        [JsonProperty(PropertyName = "BearingNonDriveEnd")]
        public List<NonDriveBearingViewModel> BearingNonDriveEnd { get; set; }
        [JsonProperty(PropertyName = "Shaft")]
        public List<Shaft> Shaft { get; set; }
        [JsonProperty(PropertyName = "ReportingServices")]
        public List<UnitServiceViewModel> ReportingServices { get; set; }
        [JsonProperty(PropertyName = "ManufactureYear")]
        public int? ManufactureYear { get; set; }
        [JsonProperty(PropertyName = "FirstInstallationDate")]
        public DateTime? FirstInstallationDate { get; set; }
        [JsonProperty(PropertyName = "OperationModeId")]
        public int? OperationModeId { get; set; }
        [JsonProperty(PropertyName = "SensorProviderId")]
        public int? SensorProviderId { get; set; }
    }

    public class UnitServiceViewModel
    {
        //[JsonProperty(PropertyName = "Type")]
        //public string Type { get; set; } // This parameter will Used to hold whether it is 'Equipment | Drive | Intermediate | Driven'
        //[JsonProperty(PropertyName = "UnitId")]
        //public int UnitId { get; set; }
        [JsonProperty(PropertyName = "UnitServiceId")]
        public int DriveServiceId { get; set; }
        [JsonProperty(PropertyName = "ServiceId")]
        public int ServiceId { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        //[JsonProperty(PropertyName = "UserId")]
        //public int UserId { get; set; }
    }

    public class Shaft
    {
        public int ShaftId { get; set; }
        public int UnitId { get; set; }
        public string ShaftOrder { get; set; }
        public string ShaftName { get; set; }
        public string RPM { get; set; }
        [JsonProperty(PropertyName = "DriveEnd")]
        public List<ShaftSide> DriveEnd { get; set; }
        [JsonProperty(PropertyName = "NonDriveEnd")]
        public List<ShaftSide> NonDriveEnd { get; set; }
        public string Active { get; set; }
    }

    public class ShaftSide
    {
        [JsonProperty(PropertyName = "ShaftSideId")]
        public int ShaftSideId { get; set; }
        [JsonProperty(PropertyName = "ShaftSide")]
        public string ShaftSideVar { get; set; }
        [JsonProperty(PropertyName = "Bearings")]
        public List<Bearings> Bearings { get; set; }
    }

    public class Bearings
    {

        [JsonProperty(PropertyName = "ManufacturerId")]
        public int? ManufacturerId { get; set; }
        [JsonProperty(PropertyName = "BearingId")]
        public int? BearingId { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        [JsonProperty(PropertyName = "ManufacturerName")]
        public string ManufacturerName { get; set; }
        [JsonProperty(PropertyName = "BearingName")]
        public string BearingName { get; set; }
    }

    public class DriveBearingViewModel
    {

        [JsonProperty(PropertyName = "ManufacturerId")]
        public int? ManufacturerId { get; set; }
        [JsonProperty(PropertyName = "BearingId")]
        public int? BearingId { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        [JsonProperty(PropertyName = "ManufacturerName")]
        public string ManufacturerName { get; set; }
        [JsonProperty(PropertyName = "BearingName")]
        public string BearingName { get; set; }
    }


    public class NonDriveBearingViewModel
    {

        [JsonProperty(PropertyName = "ManufacturerId")]
        public int? ManufacturerId { get; set; }
        [JsonProperty(PropertyName = "BearingId")]
        public int? BearingId { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
        [JsonProperty(PropertyName = "ManufacturerName")]
        public string ManufacturerName { get; set; }
        [JsonProperty(PropertyName = "BearingName")]
        public string BearingName { get; set; }
    }

    public class AttachmentViewModel
    {
        [JsonProperty(PropertyName = "Type")]
        public string Type { get; set; } // This parameter will Used to hold whether it is 'Equipment | Drive | Intermediate | Driven'
        [JsonProperty(PropertyName = "ReferenceId")]
        public int ReferenceId { get; set; }
        [JsonProperty(PropertyName = "FileName")]
        public string FileName { get; set; }
        [JsonProperty(PropertyName = "LogicalName")]
        public string LogicalName { get; set; }
        [JsonProperty(PropertyName = "PhysicalPath")]
        public string PhysicalPath { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
        [JsonProperty(PropertyName = "Status")]
        public string Active { get; set; }
    }

    public class CloneIdentifierViewModel
    {
        public string Type { get; set; }
        public int TId { get; set; }
        public int LanguageId { get; set; }
        public string TName { get; set; }
    }
}

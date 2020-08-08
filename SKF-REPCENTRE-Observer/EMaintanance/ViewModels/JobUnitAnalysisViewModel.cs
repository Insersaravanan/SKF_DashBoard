using Newtonsoft.Json;
using System.Collections.Generic;

namespace EMaintanance.ViewModels
{
    public class JobUnitAnalysisViewModel
    {
        [JsonProperty(PropertyName = "UnitAnalysisId")]
        public int UnitAnalysisId { get; set; }
        [JsonProperty(PropertyName = "JobEquipmentId")]
        public int JobEquipmentId { get; set; }
        [JsonProperty(PropertyName = "IsEC")]
        public string IsEC { get; set; } = "N";
        [JsonProperty(PropertyName = "ServiceId")]
        public int ServiceId { get; set; }
        [JsonProperty(PropertyName = "UnitType")]
        public string UnitType { get; set; }
        [JsonProperty(PropertyName = "UnitId")]
        public int UnitId { get; set; }
        [JsonProperty(PropertyName = "ConditionId")]
        public int? ConditionId { get; set; }
        [JsonProperty(PropertyName = "ConfidentFactorId")]
        public int? ConfidentFactorId { get; set; }
        [JsonProperty(PropertyName = "FailureProbFactorId")]
        public int? FailureProbFactorId { get; set; }
        [JsonProperty(PropertyName = "PriorityId")]
        public int? PriorityId { get; set; }
        [JsonProperty(PropertyName = "IsWorkNotification")]
        public string IsWorkNotification { get; set; }
        [JsonProperty(PropertyName = "NoOfDays")]
        public int NoOfDays { get; set; }
        [JsonProperty(PropertyName = "Recommendation")]
        public string Recommendation { get; set; }
        [JsonProperty(PropertyName = "Comment")]
        public string Comment { get; set; }
        [JsonProperty(PropertyName = "StatusId")]
        public int StatusId { get; set; }
        [JsonProperty(PropertyName = "UserId")]
        public int UserId { get; set; }
        [JsonProperty(PropertyName = "JobUnitSymptomsList")]
        public List<JobUnitSymptomsViewModel> JobUnitSymptomsList { get; set; }
        [JsonProperty(PropertyName = "JobUnitAmplitudeList")]
        public List<JobUnitAmplitudeViewModel> JobUnitAmplitudeList { get; set; }
        [JsonIgnore]
        [JsonProperty(PropertyName = "JobUnitSymptomsListJson")]
        public string JobUnitSymptomsListJson { get; set; }
        [JsonIgnore]
        [JsonProperty(PropertyName = "JobUnitAmplitudeListJson")]
        public string JobUnitAmplitudeListJson { get; set; }
    }

    public class JobUnitSymptomsViewModel
    {
        [JsonProperty(PropertyName = "UnitSymptomsId")]
        public int UnitSymptomsId { get; set; }
        [JsonProperty(PropertyName = "UnitAnalysisId")]
        public int UnitAnalysisId { get; set; }
        [JsonProperty(PropertyName = "SymptomTypeId")]
        public int? SymptomTypeId { get; set; }
        [JsonProperty(PropertyName = "SymptomType")]
        public string SymptomType { get; set; }
        [JsonProperty(PropertyName = "FrequencyId")]
        public int? FrequencyId { get; set; }
        [JsonProperty(PropertyName = "Frequency")]
        public string Frequency { get; set; }
        [JsonProperty(PropertyName = "IndicatedFaultId")]
        public int? IndicatedFaultId { get; set; }
        [JsonProperty(PropertyName = "FailureModeId")]
        public int? FailureModeId { get; set; }
        [JsonProperty(PropertyName = "Symptoms")]
        public string Symptoms { get; set; }
        [JsonProperty(PropertyName = "Active")]
        public string Active { get; set; }
    }

    public class JobUnitAmplitudeViewModel
    {
        [JsonProperty(PropertyName = "UnitAmplitudeId")]
        public string UnitAmplitudeId { get; set; }
        [JsonProperty(PropertyName = "UnitAnalysisId")]
        public string UnitAnalysisId { get; set; }
        [JsonProperty(PropertyName = "OAVibration")]
        public string OAVibration { get; set; }
        [JsonProperty(PropertyName = "OAGELevelPkPk")]
        public string OAGELevelPkPk { get; set; }
        [JsonProperty(PropertyName = "OASensorDirection")]
        public int? OASensorDirection { get; set; }
        [JsonProperty(PropertyName = "OASensorLocation")]
        public int? OASensorLocation { get; set; }
        [JsonProperty(PropertyName = "OAVibChangePercentage")]
        public int? OAVibChangePercentage { get; set; }
    }

    public class JobEquipUnitSelectedViewModel
    {
        public int JobEquipmentId { get; set; }
        public int ServiceId { get; set; }
        public string UnitType { get; set; }
        public int UnitId { get; set; }
        public int StatusId { get; set; }
        public int UserId { get; set; }
        public int languageId { get; set; }
    }

}

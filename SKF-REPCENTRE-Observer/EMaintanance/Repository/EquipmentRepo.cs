using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class EquipmentRepo
    {
        private readonly Utility util;
        readonly string JsonHeader = ""; // {\"ReportingServices\": removing this, since urgent delivery I am declaring as empty string.
        readonly string JsonFooter = ""; // } **** In Future we need to remove ****

        public EquipmentRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetEquipmentByStatus(int LanguageId, int EquipmentId, int ClientSiteId, int RequestId, string Type, string Action, string Status)
        {
            string sql = null;
            object param = null;
            using (var conn = util.MasterCon())
            {
                try
                {
                    if (Type != null && Type == "Equipment")
                    {
                        sql = "dbo.EAppListEquipment";
                        EquipmentId = RequestId;
                        param = new { ClientSiteId, EquipmentId, LanguageId, Action, Status };
                    }
                    else if (Type != null && Type == "Drive")
                    {
                        sql = "dbo.EAppListEquipmentDriveUnit";
                        var DriveUnitId = RequestId;
                        param = new { EquipmentId, DriveUnitId, LanguageId, Action, Status };
                    }
                    else if (Type != null && Type == "Intermediate")
                    {
                        sql = "dbo.EAppListEquipmentIntermediateUnit";
                        var IntermediateUnitId = RequestId;
                        param = new { EquipmentId, IntermediateUnitId, LanguageId, Action, Status };
                    }
                    else if (Type != null && Type == "Driven")
                    {
                        sql = "dbo.EAppListEquipmentDrivenUnit";
                        var DrivenUnitId = RequestId;
                        param = new { EquipmentId, DrivenUnitId, LanguageId, Action, Status };
                    }
                    else
                    {
                        throw new CustomException("Unable to load data due to Invalid Type", "Error", true, "Invalid Type : Valid Types are 'Equipment | Drive | Intermediate | Driven'");
                    }

                    return await (conn.QueryAsync<dynamic>(sql, param, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetAssetByClientSiteId(int LanguageId, int ClientSiteId)
        {
            string sql = "dbo.EAppListClientSiteTaxonomy";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, ClientSiteId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetListBearingByDesignation(int LanguageId, int UnitId, string UnitType, string Type, string QueryString)
        {
            string sql = "dbo.EAppListBearingByDesignation";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, UnitId, UnitType, Type, QueryString }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetFrDetailByEq(int EquipmentId)
        {
            string sql = "dbo.EAppGetFailureReportDetail";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { EquipmentId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetEquipmentByClientSiteId(int ClientSiteId, int LanguageId, string Status)
        {
            // The below syntax is calling the Equipment View and Loads the Result.
            string sql = "dbo.EAppListEquipment";
            int EquipmentId = 0;
            string Action = "List";

            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteId, EquipmentId, LanguageId, Action, Status }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> loadEqbyPlantAreaSystem(int PlantId, int AreaId, int SystemId)
        {
            string sql = "dbo.EAppLoadEquipmentByPlantAreaSystem";

            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { PlantId, AreaId, SystemId }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdateAttachments(string Type, int TypeId, int AttachId, string FileName, string LogicalName, string PhysicalPath, string Active, int UserId)
        {
            string sql = "dbo.EAppSaveEquipmentAttachments";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        Type,
                        TypeId,
                        AttachId,
                        FileName,
                        LogicalName,
                        PhysicalPath,
                        Active,
                        UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveEquipmentWithDrive([FromBody] EquipmentViewModel evm)
        {
            string sql = "dbo.EAppSaveEquipmentWithDriveUnit";
            if (evm.DriveUnits.Count > 0)
            {
                var duvm = evm.DriveUnits[0];
                var EListOrder = evm.ListOrder;
                var DListOrder = duvm.ListOrder;
                var ReportServicesJson = JsonHeader + JsonConvert.SerializeObject(duvm.ReportingServices) + JsonFooter;
                //var DEBearingJson = JsonHeader + JsonConvert.SerializeObject(duvm.BearingDriveEnd) + JsonFooter;
                //var NDEBearingJson = JsonHeader + JsonConvert.SerializeObject(duvm.BearingNonDriveEnd) + JsonFooter;
                var ShaftJson = JsonHeader + JsonConvert.SerializeObject(duvm.Shaft) + JsonFooter;

                using (var conn = util.MasterCon())
                {
                    try
                    {
                        return await (conn.QueryAsync<dynamic>(sql, new
                        {
                            evm.EquipmentId,
                            evm.PlantAreaId,
                            evm.EquipmentCode,
                            evm.EquipmentName,
                            evm.Descriptions,
                            EListOrder,
                            evm.OrientationId,
                            evm.MountingId,
                            evm.StandByEquipId,
                            duvm.DriveUnitId,
                            duvm.AssetId,
                            duvm.IdentificationName,
                            DListOrder,
                            duvm.ManufacturerId,
                            duvm.RPM,
                            duvm.Frame,
                            duvm.Voltage,
                            duvm.PowerFactor,
                            duvm.UnitRate,
                            duvm.Model,
                            duvm.HP,
                            duvm.Type,
                            duvm.MotorFanBlades,
                            duvm.SerialNumber,
                            duvm.RotorBars,
                            duvm.Poles,
                            duvm.Slots,
                            //duvm.BearingDriveEndId,
                            //duvm.BearingNonDriveEndId,
                            duvm.PulleyDiaDrive,
                            duvm.PulleyDiaDriven,
                            duvm.BeltLength,
                            duvm.CouplingId,
                            duvm.MeanRepairManHours,
                            duvm.DownTimeCostPerHour,
                            duvm.CostToRepair,
                            duvm.MeanFailureRate,
                            ReportServicesJson,
                            ShaftJson,
                            evm.Active,
                            evm.UserId,
                            duvm.ManufactureYear,
                            duvm.FirstInstallationDate,
                            duvm.OperationModeId,
                            evm.AreaId,
                            evm.SystemId,
                            duvm.LineFrequencyId,
                            duvm.SpeedTypeId,
                            duvm.SensorProviderId,
                            duvm.MinRPM,
                            duvm.MaxRPM
                        }, commandType: CommandType.StoredProcedure));
                    }
                    catch (SqlException sqlException)
                    {
                        try
                        {
                            CustomUtils.HandleException(sqlException);
                            return null; // Returned Just to solve compile issue.
                        }
                        catch (CustomException cex)
                        {
                            throw new CustomException(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                        }
                    }
                    catch (Exception ex)
                    {
                        throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                    }
                }
            }
            else
            {
                throw new CustomException("Couldn't able to create Equipment without Drive Unit Information", "Error", true, "Couldn't able to create Equipment without Drive Unit Information");
            }

        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] EquipmentViewModel evm)
        {
            string sql = "dbo.EAppSaveEquipment";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        evm.EquipmentId,
                        evm.PlantAreaId,
                        evm.EquipmentCode,
                        evm.EquipmentName,
                        evm.Descriptions,
                        evm.ListOrder,
                        evm.OrientationId,
                        evm.MountingId,
                        evm.StandByEquipId,
                        evm.Active,
                        evm.UserId,
                        evm.AreaId,
                        evm.SystemId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    try
                    {
                        CustomUtils.HandleException(sqlException);
                        return null; // Returned Just to solve compile issue.
                    }
                    catch (CustomException cex)
                    {
                        throw new CustomException(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> Clone(string Type, int TypeId, int PlantAreaId, int CloneCount, int UserId, int LanguageId)
        {
            string sql = null;
            object param = null;

            if (Type != null && Type == "DR")
            {
                sql = "EAppCloneEquipmentDriveUnit";
                int DriveUnitId = TypeId;
                param = new { DriveUnitId, CloneCount, UserId };
            }
            else if (Type != null && Type == "IN")
            {
                sql = "EAppCloneEquipmentIntermediateUnit";
                int IntermediateUnitId = TypeId;
                param = new { IntermediateUnitId, CloneCount, UserId };
            }
            else if (Type != null && Type == "DN")
            {
                sql = "EAppCloneEquipmentDrivenUnit";
                int DrivenUnitId = TypeId;
                param = new { DrivenUnitId, CloneCount, UserId };
            }
            else if (Type != null && Type == "EQ")
            {
                sql = "EAppCloneEquipment";
                int EquipmentId = TypeId;
                int PlantClone = 0;
                param = new { EquipmentId, PlantAreaId, CloneCount, UserId, PlantClone };
            }
            else if (Type != null && Type == "PL")
            {
                sql = "EAppClonePlant";
                param = new { PlantAreaId, CloneCount, UserId, LanguageId };
            }
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, param, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveCloneIdentifier([FromBody] CloneIdentifierViewModel civm)
        {
            string sql = "dbo.EAppSaveCloneIdentifier";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        civm.Type,
                        civm.TId,
                        civm.LanguageId,
                        civm.TName

                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    try
                    {
                        CustomUtils.HandleException(sqlException);
                        return null; // Returned Just to solve compile issue.
                    }
                    catch (CustomException cex)
                    {
                        throw new CustomException(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] DriveUnitViewModel duvm)
        {
            string sql = "dbo.EAppSaveEquipmentDriveUnit";
            using (var conn = util.MasterCon())
            {
                try
                {
                    var ReportServicesJson = JsonHeader + JsonConvert.SerializeObject(duvm.ReportingServices) + JsonFooter;
                    //var DEBearingJson = JsonHeader + JsonConvert.SerializeObject(duvm.BearingDriveEnd) + JsonFooter;
                    //var NDEBearingJson = JsonHeader + JsonConvert.SerializeObject(duvm.BearingNonDriveEnd) + JsonFooter;
                    var ShaftJson = JsonHeader + JsonConvert.SerializeObject(duvm.Shaft) + JsonFooter;

                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        duvm.DriveUnitId,
                        duvm.EquipmentId,
                        duvm.AssetId,
                        duvm.IdentificationName,
                        duvm.ListOrder,
                        duvm.ManufacturerId,
                        duvm.RPM,
                        duvm.Frame,
                        duvm.Voltage,
                        duvm.PowerFactor,
                        duvm.UnitRate,
                        duvm.Model,
                        duvm.HP,
                        duvm.Type,
                        duvm.MotorFanBlades,
                        duvm.SerialNumber,
                        duvm.RotorBars,
                        duvm.Poles,
                        duvm.Slots,
                        //duvm.BearingDriveEndId,
                        //duvm.BearingNonDriveEndId,
                        duvm.PulleyDiaDrive,
                        duvm.PulleyDiaDriven,
                        duvm.BeltLength,
                        duvm.CouplingId,
                        duvm.MeanRepairManHours,
                        duvm.DownTimeCostPerHour,
                        duvm.CostToRepair,
                        duvm.MeanFailureRate,
                        ReportServicesJson,
                        ShaftJson,
                        duvm.Active,
                        duvm.UserId,
                        duvm.ManufactureYear,
                        duvm.FirstInstallationDate,
                        duvm.OperationModeId,
                        duvm.LineFrequencyId,
                        duvm.SpeedTypeId,
                        duvm.SensorProviderId,
                        duvm.MinRPM,
                        duvm.MaxRPM
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    try
                    {
                        CustomUtils.HandleException(sqlException);
                        return null; // Returned Just to solve compile issue.
                    }
                    catch (CustomException cex)
                    {
                        throw new CustomException(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] IntermediateUnitViewModel ivm)
        {
            string sql = "dbo.EAppSaveEquipmentIntermediateUnit";
            using (var conn = util.MasterCon())
            {
                try
                {
                    var ReportServicesJson = JsonHeader + JsonConvert.SerializeObject(ivm.ReportingServices) + JsonFooter;
                    var DEBearingJson = JsonHeader + JsonConvert.SerializeObject(ivm.BearingDriveEnd) + JsonFooter;
                    var NDEBearingJson = JsonHeader + JsonConvert.SerializeObject(ivm.BearingNonDriveEnd) + JsonFooter;
                    var ShaftJson = JsonHeader + JsonConvert.SerializeObject(ivm.Shaft) + JsonFooter;

                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        ivm.IntermediateUnitId,
                        ivm.EquipmentId,
                        ivm.AssetId,
                        ivm.IdentificationName,
                        ivm.ListOrder,
                        ivm.ManufacturerId,
                        ivm.Ratio,
                        ivm.Size,
                        ivm.Model,
                        ivm.BeltLength,
                        ivm.PulleyDiaDrive,
                        ivm.PulleyDiaDriven,
                        ivm.RatedRPMInput,
                        ivm.RatedRPMOutput,
                        ivm.PinionInputGearTeeth,
                        ivm.PinionOutputGearTeeth,
                        ivm.IdlerInputGearTeeth,
                        ivm.IdlerOutputGearTeeth,
                        ivm.BullGearTeeth,
                        ivm.Serial,
                        //ivm.BearingInputId,
                        //ivm.BearingOutputId,
                        ivm.MeanRepairManHours,
                        ivm.DownTimeCostPerHour,
                        ivm.CostToRepair,
                        ivm.MeanFailureRate,
                        ReportServicesJson,
                        ShaftJson,
                        ivm.Active,
                        ivm.UserId,
                        ivm.ManufactureYear,
                        ivm.FirstInstallationDate,
                        ivm.OperationModeId,
                        ivm.SensorProviderId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    try
                    {
                        CustomUtils.HandleException(sqlException);
                        return null; // Returned Just to solve compile issue.
                    }
                    catch (CustomException cex)
                    {
                        throw new CustomException(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate([FromBody] DrivenUnitViewModel dvm)
        {
            string sql = "dbo.EAppSaveEquipmentDrivenUnit";
            using (var conn = util.MasterCon())
            {
                try
                {
                    var ReportServicesJson = JsonHeader + JsonConvert.SerializeObject(dvm.ReportingServices) + JsonFooter;
                    //var DEBearingJson = JsonHeader + JsonConvert.SerializeObject(dvm.BearingDriveEnd) + JsonFooter;
                    //var NDEBearingJson = JsonHeader + JsonConvert.SerializeObject(dvm.BearingNonDriveEnd) + JsonFooter;
                    var ShaftJson = JsonHeader + JsonConvert.SerializeObject(dvm.Shaft) + JsonFooter;

                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        dvm.DrivenUnitId,
                        dvm.EquipmentId,
                        dvm.AssetId,
                        dvm.IdentificationName,
                        dvm.ListOrder,
                        dvm.ManufacturerId,
                        dvm.MaxRPM,
                        dvm.Capacity,
                        dvm.Model,
                        dvm.Lubrication,
                        dvm.SerialNumber,
                        dvm.RatedFlowGPM,
                        dvm.PumpEfficiency,
                        dvm.RatedSuctionPressure,
                        dvm.Efficiency,
                        dvm.RatedDischargePressure,
                        dvm.CostPerUnit,
                        //dvm.BearingDriveEndId,
                        //dvm.BearingNonDriveEndId,
                        dvm.ImpellerVanes,
                        dvm.ImpellerVanesKW,
                        dvm.Stages,
                        dvm.NumberOfPistons,
                        dvm.PumpType,
                        dvm.MeanRepairManHours,
                        dvm.DownTimeCostPerHour,
                        dvm.CostToRepair,
                        dvm.MeanFailureRate,
                        ReportServicesJson,
                        ShaftJson,
                        dvm.Active,
                        dvm.UserId,
                        dvm.ManufactureYear,
                        dvm.FirstInstallationDate,
                        dvm.OperationModeId,
                        dvm.SensorProviderId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (SqlException sqlException)
                {
                    try
                    {
                        CustomUtils.HandleException(sqlException);
                        return null; // Returned Just to solve compile issue.
                    }
                    catch (CustomException cex)
                    {
                        throw new CustomException(cex.Message, cex.Type, cex.IsException, cex.Exception?.ToString());
                    }
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

    }
}

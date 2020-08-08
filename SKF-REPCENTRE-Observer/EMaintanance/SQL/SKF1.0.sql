--Add Two more columns for machine updated date and updated user id 
ALTER TABLE [dbo].[MachineMainds] 
ADD ModifiedDate datetime NULL, ModifiedBy nvarchar(50) NULL
----------------------------------------------------------------------------------------------

--Stored Procedure to create New Machine and update details
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE Procedure [dbo].[SP_MachineCreateAndUpdateInfo]
(
@ClientID nvarchar(50)=NULL,
@MachineID nvarchar(250)=NULL,
@UserID nvarchar(50)=NULL,
@MachineDesc nvarchar(50)=NULL,
@StandBy nvarchar(50)=NULL,
@LocationID  nvarchar(50)=NULL,
@MachinePicture1 nvarchar(150)=NULL,
@MachinePicture2 nvarchar(150)=NULL,
@MachinePicture3 nvarchar(150)=NULL,
@MachinePicture4 nvarchar(150)=NULL,
@MachinePicture5 nvarchar(150)=NULL,
@MachinePicture6 nvarchar(150)=NULL,
@MachineOrientation nvarchar(50)=NULL,
@MachineMounting nvarchar(50)=NULL,
@MachineStatus bit=NULL,
@MachinePriority nvarchar(500)=NULL,
@MachineCreatedDate datetime=NULL,
@MachineSortOrder int =NULL,
@TotalOutageTime money=NULL,
@CostPerHour money=NULL,
@CostToRepair money=NULL
)
AS 
IF EXISTS (SELECT MachineMainUniqueID FROM dbo.MachineMainds WHERE MachineMainUniqueID=@MachineID AND customerid=@ClientID AND location=@LocationID)
BEGIN
UPDATE dbo.MachineMainds SET machine_description=@MachineDesc,[standby]=@StandBy,location=@LocationID,machine_picture=@MachinePicture1,machine_picture1 =@MachinePicture2,machine_picture2=@MachinePicture3,machine_picture3=@MachinePicture4,machine_picture4=@MachinePicture5,machine_picture5=@MachinePicture6,machine_orientation=@MachineOrientation,machine_mounting =@MachineMounting,MachineStatus=@MachineStatus,MachineSortOrder=@MachineSortOrder,ModifiedDate=@MachineCreatedDate,ModifiedBy=@UserID  WHERE MachineMainUniqueID=@MachineID AND customerid=@ClientID AND location=@LocationID
END
ELSE
BEGIN
INSERT INTO  MachineMainds (MachineMainUniqueID,customerid,[user],machine_description,[standby],total_outagetime,costperhour,costtorepair,location,machine_picture,machine_picture1,machine_picture2,machine_picture3,machine_picture4,machine_picture5,machine_orientation,machine_mounting,MachineStatus,MachineCreateDate,MachineSortOrder) VALUES (@MachineID,@ClientID,@UserID,@MachineDesc,@StandBy,@TotalOutageTime,@CostPerHour,@CostToRepair,@LocationID,@MachinePicture1,@MachinePicture2,@MachinePicture3,@MachinePicture4,@MachinePicture5,@MachinePicture6,@MachineOrientation,@MachineMounting,@MachineStatus,@MachineCreatedDate,@MachineSortOrder)
END

GO

-----------------------------------------------------------------------------
--Storted Procedure for Drive Asset Create and Update info
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE Procedure [dbo].[SP_MachineDriveAssetCreateAndUpdateInfo]
(
@ClientID nvarchar(50)=NULL,
@MachineID nvarchar(250)=NULL,
@UserID nvarchar(50)=NULL,
@AssetID nvarchar(250)=NULL,
@LocationID  nvarchar(50)=NULL,
@TaxonomyCode nvarchar(50)=NULL,
@Manufacturer nvarchar(50)=NULL,
@RPM nvarchar(50)=NULL,
@Frame nvarchar(50)=NULL,
@Voltage nvarchar(50)=NULL,
@PowerFactor nvarchar(50)=NULL,
@UnitRate nvarchar(50)=NULL,
@Model nvarchar(50)=NULL,
@HP nvarchar(50)=NULL,
@Type nvarchar(50)=NULL,
@MotorFanBlades nvarchar(50)=NULL,
@Serialno nvarchar(50)=NULL,
@RotorBars nvarchar(50)=NULL,
@Poles nvarchar(50)=NULL,
@Slots nvarchar(50)=NULL,
@NonDriveEnd nvarchar(50)=NULL,
@PulleyDiameter nvarchar(50)=NULL,
@MotorSide nvarchar(50)=NULL,
@BeltLength nvarchar(50)=NULL,
@DriveEnd nvarchar(50)=NULL,
@Coupling nvarchar(50)=NULL,
@TotalOutagetime nvarchar(50)=NULL,
@CostperHour nvarchar(50)=NULL,
@Costtorepair nvarchar(50)=NULL,
@MeanFailureRate nvarchar(50)=NULL,
@VibrationReport nvarchar(50)=NULL,
@OilReport nvarchar(50)=NULL,
@ThermoReport nvarchar(50)=NULL,
@MotorReport nvarchar(50)=NULL,
@DriveSortOrder nvarchar(50)=NULL
)
AS 
IF EXISTS (SELECT MachineDriveUniqueID FROM dbo.MachineDriveds WHERE MachineDriveUniqueID=@AssetID AND MachineMainUniqueID=@MachineID AND customerid=@ClientID AND location=@LocationID)
BEGIN
UPDATE dbo.MachineDriveds SET MachineDriveUniqueID=@AssetID,Drive_taxonomy=@TaxonomyCode,location=@LocationID,manufacturer=@Manufacturer,rpm =@RPM,frame=@Frame,Voltage =@Voltage,Power_factor=@PowerFactor,Unit_Rate=@UnitRate,model=@Model,hp =@HP,[TYPE]=@Type,motor_fan_blades=@MotorFanBlades,serialno=@Serialno,rotor_bars=@RotorBars,poles=@Poles,slots=@Slots,non_drive_end=@NonDriveEnd,pulley_diameter=@PulleyDiameter,motor_side=@MotorSide,belt_length=@BeltLength,drive_end=@DriveEnd,coupling=@Coupling,drive_total_outagetime=@TotalOutagetime,drive_costperhour=@CostperHour,drive_costtorepair=@Costtorepair,drive_mean_failurerate=@MeanFailureRate,VibrationReport=@VibrationReport,OilReport=@OilReport,ThermoReport=@ThermoReport,MotorReport=@MotorReport,DriveSortOrder=@DriveSortOrder     WHERE MachineDriveUniqueID=@ASSETID AND MachineMainUniqueID=@MachineID AND customerid=@ClientID AND location=@LocationID
END
ELSE
BEGIN
INSERT INTO  MachineDriveds (MachineDriveUniqueID,customerid,[user],MachineMainUniqueID,Drive_taxonomy,manufacturer,rpm,frame,Voltage,Power_factor,Unit_Rate,model,hp,[Type],motor_fan_blades,serialno,rotor_bars,poles,slots,non_drive_end,pulley_diameter,motor_side,belt_length,drive_end,coupling,drive_total_outagetime,drive_costperhour,drive_costtorepair,drive_mean_failurerate,VibrationReport,OilReport,ThermoReport,MotorReport,Location,DriveSortOrder) 
VALUES (@AssetID,@ClientID,@UserID,@MachineID,@TaxonomyCode,@Manufacturer,@RPM,@Frame,@Voltage,@PowerFactor,@UnitRate,@Model,@HP,@Type,@MotorFanBlades,@Serialno,@RotorBars,@Poles,@Slots,@NonDriveEnd,@PulleyDiameter,@MotorSide,@BeltLength,@DriveEnd,@Coupling,@TotalOutagetime,@CostperHour,@Costtorepair,@MeanFailureRate,@VibrationReport,@OilReport,@ThermoReport,@MotorReport,@LocationID,@DriveSortOrder)     

END

GO
----------------------------------------------------------1-----------------1------------------------------------------
--Stored Procedure for Intermediate Asset Create and Update
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE Procedure [dbo].[SP_MachineIntermediateAssetCreateAndUpdateInfo]
(
@ClientID nvarchar(50)=NULL,
@MachineID nvarchar(250)=NULL,
@UserID nvarchar(50)=NULL,
@AssetID nvarchar(250)=NULL,
@LocationID  nvarchar(50)=NULL,
@TaxonomyCode nvarchar(50)=NULL,
@Manufacturer nvarchar(50)=NULL,
@Ratio nvarchar(50)=NULL,
@Size nvarchar(50)=NULL,
@BearingBeltLength nvarchar(50)=NULL,
@DrivenPulleyDia nvarchar(50)=NULL,
@DrivingPpulleyDia nvarchar(50)=NULL,
@RatedRpmInput nvarchar(50)=NULL,
@RatedRpmOutput nvarchar(50)=NULL,
@PinionInputGearteeth nvarchar(50)=NULL,
@IdlerOutputGearteeth nvarchar(50)=NULL,
@IdlerInputGearteeth nvarchar(50)=NULL,
@BullGearTeeth nvarchar(50)=NULL,
@BullGearModel nvarchar(50)=NULL,
@Serial nvarchar(50)=NULL,
@BearingInput nvarchar(50)=NULL,
@BearingOutput nvarchar(50)=NULL,
@TotalOutagetime nvarchar(50)=NULL,
@CostperHour nvarchar(50)=NULL,
@Costtorepair nvarchar(50)=NULL,
@MeanFailureRate nvarchar(50)=NULL,
@VibrationReport nvarchar(50)=NULL,
@OilReport nvarchar(50)=NULL,
@ThermoReport nvarchar(50)=NULL,
@MotorReport nvarchar(50)=NULL,
@InterSortOrder nvarchar(50)=NULL
)
AS 
IF EXISTS (SELECT MachineInterUniqueID FROM dbo.MachineInterds WHERE MachineInterUniqueID=@AssetID AND MachineMainUniqueID=@MachineID AND customerid=@ClientID AND location=@LocationID)
BEGIN
UPDATE dbo.MachineInterds SET MachineInterUniqueID=@AssetID,Inter_taxonomy=@TaxonomyCode,location=@LocationID,Inter_manufacturer=@Manufacturer,ratio =@Ratio,size=@Size,bearing_belt_length =@BearingBeltLength,driven_pulley_dia=@DrivenPulleyDia,driving_pulley_dia =@DrivingPpulleyDia,rated_rpm_input=@RatedRpmInput,rated_rpm_output =@RatedRpmOutput,pinion_input_gearteeth=@PinionInputGearteeth,idler_input_gearteeth=@IdlerInputGearteeth ,idler_output_gearteeth=@IdlerOutputGearteeth,bull_gear_teeth=@BullGearTeeth,bull_gear_model=@BullGearModel,serial=@Serial,bearing_input =@BearingInput,bearing_output =@BearingOutput,Inter_total_outagetime=@TotalOutagetime,Inter_costperhour=@CostperHour,Inter_costtorepair=@Costtorepair,Inter_mean_failurerate=@MeanFailureRate,VibrationReport=@VibrationReport,OilReport=@OilReport,ThermoReport=@ThermoReport,MotorReport=@MotorReport,InterSortOrder=@InterSortOrder    WHERE MachineInterUniqueID=@ASSETID AND MachineMainUniqueID=@MachineID AND customerid=@ClientID AND location=@LocationID
END
ELSE
BEGIN
INSERT INTO  MachineInterds (MachineInterUniqueID,customerid,[user],MachineMainUniqueID,Inter_taxonomy,Inter_manufacturer,ratio,size,bearing_belt_length,driven_pulley_dia,driving_pulley_dia,rated_rpm_input,rated_rpm_output,pinion_input_gearteeth,idler_input_gearteeth,idler_output_gearteeth,bull_gear_teeth,bull_gear_model,serial,bearing_input,bearing_output,Inter_total_outagetime,Inter_costperhour,Inter_costtorepair,Inter_mean_failurerate,VibrationReport,OilReport,ThermoReport,MotorReport,Location,InterSortOrder) 
VALUES (@AssetID,@ClientID,@UserID,@MachineID,@TaxonomyCode,@Manufacturer,@Ratio,@Size,@BearingBeltLength,@DrivenPulleyDia,@DrivingPpulleyDia,@RatedRpmInput,@RatedRpmOutput,@PinionInputGearteeth,@IdlerInputGearteeth,@IdlerOutputGearteeth,@BullGearTeeth,@BearingInput,@Serial,@BearingOutput,@BullGearModel,@TotalOutagetime,@CostperHour,@Costtorepair,@MeanFailureRate,@VibrationReport,@OilReport,@ThermoReport,@MotorReport,@LocationID,@InterSortOrder)     

END

GO

-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--Stored Procedure for Driven End Asset Create and Update
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE Procedure [dbo].[SP_MachineDrivenEndAssetCreateAndUpdateInfo]
(
@ClientID nvarchar(50)=NULL,
@MachineID nvarchar(250)=NULL,
@UserID nvarchar(50)=NULL,
@AssetID nvarchar(250)=NULL,
@LocationID  nvarchar(50)=NULL,
@TaxonomyCode nvarchar(50)=NULL,
@Manufacturer nvarchar(50)=NULL,
@MaxRPM nvarchar(50)=NULL,
@Capacity nvarchar(50)=NULL,
@Model nvarchar(50)=NULL,
@Lubrication nvarchar(50)=NULL,
@Serialno nvarchar(50)=NULL,
@Ratedflow nvarchar(50)=NULL,
@PumpEfficiency nvarchar(50)=NULL,
@RatedSuction nvarchar(50)=NULL,
@MachineEefficiency nvarchar(50)=NULL,
@RatedDischargePressure nvarchar(50)=NULL,
@costPerUnit nvarchar(50)=NULL,
@BearingNDE nvarchar(50)=NULL,
@OppEndDE nvarchar(50)=NULL,
@ImpellerVanes nvarchar(50)=NULL,
@KW nvarchar(50)=NULL,
@Stages nvarchar(50)=NULL,
@NoOfPistons nvarchar(50)=NULL,
@TypePump nvarchar(50)=NULL,
@TotalOutagetime nvarchar(50)=NULL,
@CostperHour nvarchar(50)=NULL,
@Costtorepair nvarchar(50)=NULL,
@MeanFailureRate nvarchar(50)=NULL,
@VibrationReport nvarchar(50)=NULL,
@OilReport nvarchar(50)=NULL,
@ThermoReport nvarchar(50)=NULL,
@MotorReport nvarchar(50)=NULL,
@DrivenSortOrder nvarchar(50)=NULL
)
AS 
IF EXISTS (SELECT MachineDriEndUniqueID FROM dbo.MachineDrivenEndds WHERE MachineDriEndUniqueID=@AssetID AND MachineMainUniqueID=@MachineID AND customerid=@ClientID AND location=@LocationID)
BEGIN
UPDATE dbo.MachineDrivenEndds SET MachineDriEndUniqueID=@AssetID,Driven_taxonomy=@TaxonomyCode,location=@LocationID,du_manufacturer=@Manufacturer,du_max_rpm =@MaxRPM,du_capacity=@Capacity,du_model =@Model,du_lubrication=@Lubrication,du_serialno =@Serialno,ratedflow=@Ratedflow,pump_efficiency =@PumpEfficiency,rated_suction=@RatedSuction,driver_machine_efficiency=@MachineEefficiency,rated_discharge_pressure=@RatedDischargePressure,cost_perunit=@costPerUnit,bearing_nde=@BearingNDE,opp_end_de =@OppEndDE,impeller_vanes =@ImpellerVanes,kw=@KW,stages=@Stages,no_of_pistons=@NoOfPistons,type_pump=@TypePump,Driven_total_outagetime=@TotalOutagetime,Driven_costperhour=@CostperHour,Driven_costtorepair=@Costtorepair,Driven_mean_failurerate=@MeanFailureRate,VibrationReport=@VibrationReport,OilReport=@OilReport,ThermoReport=@ThermoReport,MotorReport=@MotorReport,DrivenSortOrder=@DrivenSortOrder    WHERE MachineDriEndUniqueID=@ASSETID AND MachineMainUniqueID=@MachineID AND customerid=@ClientID AND location=@LocationID
END
ELSE
BEGIN
INSERT INTO  MachineDrivenEndds (MachineDriEndUniqueID,customerid,[user],MachineMainUniqueID,Driven_taxonomy,du_manufacturer,du_max_rpm,du_capacity,du_model,du_lubrication,du_serialno,ratedflow,pump_efficiency,rated_suction,driver_machine_efficiency,rated_discharge_pressure,cost_perunit,bearing_nde,opp_end_de,impeller_vanes,kw,stages,no_of_pistons,type_pump,Driven_total_outagetime,Driven_costperhour,Driven_costtorepair,Driven_mean_failurerate,VibrationReport,OilReport,ThermoReport,MotorReport,Location,DrivenSortOrder) 
VALUES (@AssetID,@ClientID,@UserID,@MachineID,@TaxonomyCode,@Manufacturer,@MaxRPM,@Capacity,@Model,@Lubrication,@Serialno,@Ratedflow,@PumpEfficiency,@RatedSuction,@MachineEefficiency,@RatedDischargePressure,@costPerUnit,@BearingNDE,@OppEndDE,@ImpellerVanes,@KW,@Stages,@NoOfPistons,@TypePump,@TotalOutagetime,@CostperHour,@Costtorepair,@MeanFailureRate,@VibrationReport,@OilReport,@ThermoReport,@MotorReport,@LocationID,@DrivenSortOrder)     

END

GO

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
--
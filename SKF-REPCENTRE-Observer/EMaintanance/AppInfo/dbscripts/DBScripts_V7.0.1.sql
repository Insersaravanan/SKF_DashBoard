 
--
-- Set transaction isolation level
--
SET TRANSACTION ISOLATION LEVEL SERIALIZABLE
GO

--
-- Start Transaction
--
BEGIN TRANSACTION
GO

--
-- Drop foreign key [User_Lookup] on table [dbo].[Users]
--
ALTER TABLE [dbo].[Users]
  DROP CONSTRAINT IF EXISTS [User_Lookup]
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Create foreign key [User_Lookup] on table [dbo].[Users]
--
ALTER TABLE [dbo].[Users] WITH NOCHECK
  ADD CONSTRAINT [User_Lookup] FOREIGN KEY ([UserTypeId]) REFERENCES [dbo].[Lookups] ([LookupId])
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Drop foreign key [Jobs_Stataus] on table [dbo].[Jobs]
--
ALTER TABLE [dbo].[Jobs]
  DROP CONSTRAINT IF EXISTS [Jobs_Stataus]
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Create foreign key [Jobs_Stataus] on table [dbo].[Jobs]
--
ALTER TABLE [dbo].[Jobs] WITH NOCHECK
  ADD CONSTRAINT [Jobs_Stataus] FOREIGN KEY ([StatusId]) REFERENCES [dbo].[Lookups] ([LookupId])
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Drop foreign key [Equipment_Mounting] on table [dbo].[Equipment]
--
ALTER TABLE [dbo].[Equipment]
  DROP CONSTRAINT IF EXISTS [Equipment_Mounting]
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Alter column [EquipmentCode] on table [dbo].[Equipment]
--
ALTER TABLE [dbo].[Equipment]
  ALTER
    COLUMN [EquipmentCode] [nvarchar](100)
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Create foreign key [Equipment_Mounting] on table [dbo].[Equipment]
--
ALTER TABLE [dbo].[Equipment] WITH NOCHECK
  ADD CONSTRAINT [Equipment_Mounting] FOREIGN KEY ([MountingId]) REFERENCES [dbo].[Lookups] ([LookupId])
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Refresh view [dbo].[vEquipment]
--
EXEC sp_refreshview '[dbo].[vEquipment]'
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Alter procedure [dbo].[EAppSaveEquipment]
--
GO
 
CREATE OR ALTER PROCEDURE [dbo].[EAppSaveEquipment] 
	 @EquipmentId INT
	,@PlantAreaId INT	  
	,@AreaId INT
	,@SystemId INT	
	,@EquipmentCode NVARCHAR(100)
	,@EquipmentName NVARCHAR(150)
	,@Descriptions NVARCHAR(250)
	,@ListOrder INT 
	,@OrientationId INT 
	,@MountingId INT 
	,@StandByEquipId INT 
	,@Active VARCHAR(1)
	,@UserId INT
AS
BEGIN
	BEGIN TRANSACTION
	BEGIN TRY
		if isnull(@ListOrder,0) = 0 and isnull(@EquipmentId,0) = 0
		Begin
			select @ListOrder = isnull(max(e.ListOrder),0)+1 From Equipment e Where e.PlantAreaId = @PlantAreaId
		End
 		MERGE [dbo].[Equipment] AS [target]
		USING (
			SELECT @EquipmentId 
			) AS source(EquipmentId)
			ON ([target].[EquipmentId] = [source].[EquipmentId])
		WHEN MATCHED
			THEN
 
				UPDATE
				SET PlantAreaId = @PlantAreaId	 
				,AreaId=@AreaId
				,SystemId=@SystemId
				,EquipmentCode = @EquipmentCode
				,EquipmentName = @EquipmentName
				,Descriptions = @Descriptions
				,ListOrder = @ListOrder
				,OrientationId = @OrientationId
				,MountingId = @MountingId
				,StandByEquipId = @StandByEquipId
				,Active = @Active
		WHEN NOT MATCHED BY TARGET
			THEN
				INSERT (
				 PlantAreaId
				 ,AreaId
				 ,SystemId
				,EquipmentCode
				,EquipmentName
				,Descriptions
				,ListOrder
				,OrientationId
				,MountingId
				,StandByEquipId
				,Active
				,CreatedBy
					)
				VALUES (
				 @PlantAreaId
				 ,@AreaId
				 ,@SystemId
				,@EquipmentCode
				,@EquipmentName
				,@Descriptions
				,@ListOrder
				,@OrientationId
				,@MountingId
				,@StandByEquipId
				,@Active
				,@UserId
					)
				;
 

		COMMIT TRANSACTION
	END TRY

	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Drop foreign key [JobEquipment_Conditions] on table [dbo].[JobEquipment]
--
ALTER TABLE [dbo].[JobEquipment]
  DROP CONSTRAINT IF EXISTS [JobEquipment_Conditions]
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Create foreign key [JobEquipment_Conditions] on table [dbo].[JobEquipment]
--
ALTER TABLE [dbo].[JobEquipment] WITH NOCHECK
  ADD CONSTRAINT [JobEquipment_Conditions] FOREIGN KEY ([ConditionId]) REFERENCES [dbo].[Lookups] ([LookupId])
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Drop foreign key [JobEquipUnitAnalysis_Condition] on table [dbo].[JobEquipUnitAnalysis]
--
ALTER TABLE [dbo].[JobEquipUnitAnalysis]
  DROP CONSTRAINT IF EXISTS [JobEquipUnitAnalysis_Condition]
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Create foreign key [JobEquipUnitAnalysis_Condition] on table [dbo].[JobEquipUnitAnalysis]
--
ALTER TABLE [dbo].[JobEquipUnitAnalysis] WITH NOCHECK
  ADD CONSTRAINT [JobEquipUnitAnalysis_Condition] FOREIGN KEY ([ConditionId]) REFERENCES [dbo].[Lookups] ([LookupId])
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Alter procedure [dbo].[EAppSaveEquipmentIntermediateUnit]
--
GO
CREATE OR ALTER PROCEDURE [dbo].[EAppSaveEquipmentIntermediateUnit] 	
	@IntermediateUnitId int 
	,@EquipmentId int 
	,@AssetId int  
	,@IdentificationName nvarchar(150) 
	,@ListOrder int 
	,@ManufacturerId int 
	,@Ratio nvarchar(100) 
	,@Size nvarchar(100) 
	,@Model nvarchar(100) 
	,@BeltLength nvarchar(100) 
	,@PulleyDiaDrive nvarchar(100) 
	,@PulleyDiaDriven nvarchar(100) 
	,@RatedRPMInput nvarchar(100) 
	,@RatedRPMOutput nvarchar(100) 
	,@PinionInputGearTeeth nvarchar(100) 
	,@PinionOutputGearTeeth nvarchar(100) 
	,@IdlerInputGearTeeth nvarchar(100) 
	,@IdlerOutputGearTeeth nvarchar(100) 
	,@BullGearTeeth nvarchar(100) 
	,@Serial nvarchar(100) 
	,@MeanRepairManHours decimal(15, 4) 
	,@DownTimeCostPerHour decimal(15, 4) 
	,@CostToRepair decimal(15, 4) 
	,@MeanFailureRate decimal(15, 4) 
	,@ReportServicesJson nvarchar(max)
	,@DEBearingJson nvarchar(max)
	,@NDEBearingJson nvarchar(max)
	,@Active varchar(1)  
	,@UserId INT
	,@ManufactureYear int
	,@FirstInstallationDate date
	,@OperationModeId int
AS
BEGIN
	BEGIN TRANSACTION
	BEGIN TRY
  		DECLARE @Created TABLE (
			[IntermediateUnitId] INT
			,PRIMARY KEY ([IntermediateUnitId])
			); 
			 
 		MERGE [dbo].[EquipmentIntermediateUnit] AS [target]
		USING (
			SELECT @IntermediateUnitId 
			) AS source(IntermediateUnitId)
			ON ([target].[IntermediateUnitId] = [source].[IntermediateUnitId])
		WHEN MATCHED
			THEN
 
				UPDATE
				SET  
				AssetId = @AssetId 
				,IdentificationName = @IdentificationName
				,ListOrder = @ListOrder
				,ManufacturerId = @ManufacturerId
				,Ratio = @Ratio
				,Size = @Size
				,BeltLength = @BeltLength
				,PulleyDiaDrive = @PulleyDiaDrive
				,PulleyDiaDriven = @PulleyDiaDriven 
				,RatedRPMInput = @RatedRPMInput
				,RatedRPMOutput = @RatedRPMOutput
				,PinionInputGearTeeth = @PinionInputGearTeeth
				,PinionOutputGearTeeth = @PinionOutputGearTeeth
				,IdlerInputGearTeeth = @IdlerInputGearTeeth
				,IdlerOutputGearTeeth = @IdlerOutputGearTeeth
				,BullGearTeeth = @BullGearTeeth
				,Model = @Model
				,Serial = @Serial 
				,MeanRepairManHours = @MeanRepairManHours
				,DownTimeCostPerHour = @DownTimeCostPerHour
				,CostToRepair = @CostToRepair
				,MeanFailureRate = @MeanFailureRate
				,Active = @Active
				,ManufactureYear = @ManufactureYear
				,FirstInstallationDate = @FirstInstallationDate
				,OperationModeId = @OperationModeId
				WHEN NOT MATCHED BY TARGET
			THEN
				INSERT ( 
				 EquipmentId
				,AssetId  
				,IdentificationName 
				,ListOrder 
				,ManufacturerId 
				,Ratio 
				,Size 
				,BeltLength 
				,PulleyDiaDrive 
				,PulleyDiaDriven 
				,RatedRPMInput 
				,RatedRPMOutput 
				,PinionInputGearTeeth 
				,PinionOutputGearTeeth 
				,IdlerInputGearTeeth 
				,IdlerOutputGearTeeth 
				,BullGearTeeth 
				,Model 
				,Serial  
				,MeanRepairManHours 
				,DownTimeCostPerHour 
				,CostToRepair 
				,MeanFailureRate 
				,Active 
				,CreatedBy
				,ManufactureYear
				,FirstInstallationDate
				,OperationModeId
					)
				VALUES ( 
				 @EquipmentId
				,@AssetId  
				,@IdentificationName 
				,@ListOrder 
				,@ManufacturerId 
				,@Ratio 
				,@Size 
				,@BeltLength 
				,@PulleyDiaDrive 
				,@PulleyDiaDriven 
				,@RatedRPMInput 
				,@RatedRPMOutput 
				,@PinionInputGearTeeth 
				,@PinionOutputGearTeeth 
				,@IdlerInputGearTeeth 
				,@IdlerOutputGearTeeth 
				,@BullGearTeeth 
				,@Model 
				,@Serial  
				,@MeanRepairManHours 
				,@DownTimeCostPerHour 
				,@CostToRepair 
				,@MeanFailureRate 
				,@Active 
				,@UserId
				,@ManufactureYear
				,@FirstInstallationDate
				,@OperationModeId
					) OUTPUT INSERTED.IntermediateUnitId
				INTO @Created ;
			    
				SELECT @IntermediateUnitId = [IntermediateUnitId]
				FROM @Created; 
---- Process Start Report Service------
 DECLARE @IntermediateServiceId int, @ReportId int, @JActive varchar(1) 
	
	DROP TABLE IF EXISTS #LoadJson
	 
	CREATE TABLE #LoadJson
	(
	  LoaderId int not null identity(1,1),
	  IntermediateServiceId int,
	  ReportId int,
	  Active varchar(1) 
	) 

Insert into #LoadJson (IntermediateServiceId,ReportId,Active)
SELECT
    JSON_Value (c.value, '$.UnitServiceId') as IntermediateServiceId, 
    JSON_Value (c.value, '$.ServiceId') as ReportId, 
	JSON_Value (c.value, '$.Active') as Active  
FROM OPENJSON ( @ReportServicesJson ) as c 
 
  
DECLARE GetIdCur CURSOR READ_ONLY
    FOR
    SELECT IntermediateServiceId,ReportId,Active
	from #LoadJson  

    OPEN GetIdCur
    FETCH NEXT FROM GetIdCur INTO
    @IntermediateServiceId,@ReportId,@JActive
    WHILE @@FETCH_STATUS = 0
		BEGIN
		 	MERGE [dbo].[IntermediateServices] AS [target]
			USING (
				SELECT @IntermediateUnitId,@ReportId 
				) AS source(IntermediateUnitId,ReportId)
				ON ([target].[IntermediateUnitId] = [source].[IntermediateUnitId] and [target].[ReportId] = [source].[ReportId])
			WHEN MATCHED
				THEN 
					UPDATE
					SET Active = @JActive
			WHEN NOT MATCHED BY TARGET
					THEN
						INSERT (  
						 IntermediateUnitId
						,ReportId
						,Active
						,CreatedBy
							)
						VALUES ( 
						 @IntermediateUnitId
						,@ReportId  
						,@JActive
						,@UserId
							)
						;
		FETCH NEXT FROM GetIdCur INTO @IntermediateServiceId,@ReportId,@JActive
		END
    CLOSE GetIdCur
    DEALLOCATE GetIdCur
 ---- Process End Report Service------ 
 ---- Process Start Bearing Drive End------
	DECLARE @BearingId int, @DEActive varchar(1),@DEManufacturerId int ,@DEPlace varchar(3), @RDCount int
	
	DROP TABLE IF EXISTS #LoadDEBearingJson

	CREATE TABLE #LoadDEBearingJson
	(
	  LoaderId int not null identity(1,1),
	  Place varchar(3), 
	  BearingId int,
	  ManufacturerId Int,
	  Active Varchar(1) 
	) 

Insert into #LoadDEBearingJson (BearingId,ManufacturerId,Active,Place)
SELECT
    JSON_Value (c.value, '$.BearingId') as BearingId,
	JSON_Value (c.value, '$.ManufacturerId') as ManufacturerId,   
	JSON_Value (c.value, '$.Active') as Active,
	'DE' as Place  
FROM OPENJSON ( @DEBearingJson ) as c 

select  @RDCount = count(BearingId) from #LoadDEBearingJson
if isnull(@RDCount,0) > 0 
Begin
	Update  [IntermediateBearing] set Active = 'N' where IntermediateUnitId = @IntermediateUnitId and Place = 'DE'
End 
 
DECLARE GetBeringDECur CURSOR READ_ONLY
    FOR
    SELECT BearingId,ManufacturerId,Active,Place
	from #LoadDEBearingJson  

    OPEN GetBeringDECur
    FETCH NEXT FROM GetBeringDECur INTO
    @BearingId,@DEManufacturerId,@DEActive,@DEPlace
    WHILE @@FETCH_STATUS = 0
		BEGIN
		 	MERGE [dbo].[IntermediateBearing] AS [target]
			USING (
				SELECT @IntermediateUnitId, @BearingId, @DEPlace  
				) AS source(IntermediateUnitId,BearingId,Place)
				ON ([target].[IntermediateUnitId] = [source].[IntermediateUnitId] 
				and [target].[Place] = [source].[Place]
				and [target].[BearingId] = [source].[BearingId])				
			WHEN MATCHED
				THEN 
					UPDATE
					SET Active = @DEActive
			WHEN NOT MATCHED BY TARGET
					THEN
						INSERT (  
						 IntermediateUnitId
						,BearingId
						,ManufacturerId
						,Place
						,Active
						,CreatedBy
							)
						VALUES ( 
						 @IntermediateUnitId
						,@BearingId 
						,@DEManufacturerId
						,@DEPlace 
						,@DEActive
						,@UserId
							)
						;
		FETCH NEXT FROM GetBeringDECur INTO   @BearingId,@DEManufacturerId,@DEActive,@DEPlace
		END
    CLOSE GetBeringDECur
    DEALLOCATE GetBeringDECur
 ---- Process End Bearing Drive End------
  ---- Process Start Bearing Non Drive End------
	DECLARE @NDEActive varchar(1) ,@NDEPlace varchar(3) , @NDEManufacturerID int, @RNDCount int
	
	DROP TABLE IF EXISTS #LoadNDEBearingJson

	CREATE TABLE #LoadNDEBearingJson
	(
	  LoaderId int not null identity(1,1),
	  Place varchar(3), 
	  BearingId int,
	  ManufacturerId int,
	  Active Varchar(1) 
	) 
 
Insert into #LoadNDEBearingJson (BearingId,ManufacturerId,Active,Place)
SELECT
    JSON_Value (c.value, '$.BearingId') as BearingId,
	JSON_Value (c.value, '$.ManufacturerId') as ManufacturerId,  
	JSON_Value (c.value, '$.Active') as Active,
	'NDE' as Place  
FROM OPENJSON ( @NDEBearingJson ) as c 

select  @RNDCount = count(BearingId) from #LoadNDEBearingJson
if isnull(@RNDCount,0) > 0 
Begin
	Update  [IntermediateBearing] set Active = 'N' where IntermediateUnitId = @IntermediateUnitId and Place = 'NDE'
End 

 
DECLARE GetBeringNDECur CURSOR READ_ONLY
    FOR
    SELECT BearingId,ManufacturerId,Active,Place
	from #LoadNDEBearingJson  

    OPEN GetBeringNDECur
    FETCH NEXT FROM GetBeringNDECur INTO
    @BearingId,@NDEManufacturerID,@NDEActive,@NDEPlace
    WHILE @@FETCH_STATUS = 0
		BEGIN
		 	MERGE [dbo].[IntermediateBearing] AS [target]
			USING (
				SELECT @IntermediateUnitId, @BearingId,@NDEPlace  
				) AS source(IntermediateUnitId,BearingId,Place)
				ON ([target].[IntermediateUnitId] = [source].[IntermediateUnitId] 
				and [target].[Place] = [source].[Place]
				and [target].[BearingId] = [source].[BearingId])				
			WHEN MATCHED
				THEN 
					UPDATE
					SET Active = @NDEActive
			WHEN NOT MATCHED BY TARGET
					THEN
						INSERT (  
						 IntermediateUnitId
						,BearingId
						,ManufacturerId
						,Place
						,Active
						,CreatedBy
							)
						VALUES ( 
						 @IntermediateUnitId
						,@BearingId 
						,@NDEManufacturerID
						,@NDEPlace 
						,@NDEActive
						,@UserId
							)
						;
		FETCH NEXT FROM GetBeringNDECur INTO   @BearingId,@NDEManufacturerID,@NDEActive,@NDEPlace
		END
    CLOSE GetBeringNDECur
    DEALLOCATE GetBeringNDECur
 ---- Process End Bearing Non Drive End------ 
		COMMIT TRANSACTION
	END TRY

	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Alter procedure [dbo].[EAppSaveEquipmentDriveUnit]
--
GO

CREATE OR ALTER PROCEDURE [dbo].[EAppSaveEquipmentDriveUnit] 
	@DriveUnitId int
	,@EquipmentId int
	,@AssetId int 
	,@IdentificationName nvarchar(150)
	,@ListOrder int
	,@ManufacturerId int
	,@RPM nvarchar(100)
	,@Frame nvarchar(100)
	,@Voltage nvarchar(100)
	,@PowerFactor nvarchar(100)
	,@UnitRate nvarchar(100)
	,@Model nvarchar(100)
	,@HP nvarchar(100)
	,@Type nvarchar(100)
	,@MotorFanBlades nvarchar(100)
	,@SerialNumber nvarchar(100)
	,@RotorBars nvarchar(100)
	,@Poles nvarchar(100)
	,@Slots nvarchar(100) 
	,@PulleyDiaDrive nvarchar(100)
	,@PulleyDiaDriven nvarchar(100)
	,@BeltLength nvarchar(100)
	,@CouplingId int
	,@MeanRepairManHours decimal(15, 4)
	,@DownTimeCostPerHour decimal(15, 4)
	,@CostToRepair decimal(15, 4)
	,@MeanFailureRate decimal(15, 4)
	,@ReportServicesJson nvarchar(max)
	,@DEBearingJson nvarchar(max)
	,@NDEBearingJson nvarchar(max)
	,@Active VARCHAR(1)
	,@UserId INT
	,@ManufactureYear int
	,@FirstInstallationDate date
	,@OperationModeId int
AS
BEGIN
	BEGIN TRANSACTION
	BEGIN TRY
  		DECLARE @Created TABLE (
			[DriveUnitId] INT
			,PRIMARY KEY ([DriveUnitId])
			); 

 		MERGE [dbo].[EquipmentDriveUnit] AS [target]
		USING (
			SELECT @DriveUnitId 
			) AS source(DriveUnitId)
			ON ([target].[DriveUnitId] = [source].[DriveUnitId])
		WHEN MATCHED
			THEN
 
				UPDATE
				SET AssetId = @AssetId 
				,IdentificationName = @IdentificationName
				,ListOrder = @ListOrder
				,ManufacturerId = @ManufacturerId
				,RPM = @RPM
				,Frame = @Frame
				,Voltage = @Voltage
				,PowerFactor = @PowerFactor
				,UnitRate = @UnitRate 
				,Model = @Model
				,HP = @HP
				,[Type] = @Type
				,MotorFanBlades = @MotorFanBlades
				,SerialNumber = @SerialNumber
				,RotorBars = @RotorBars
				,Poles = @Poles
				,Slots = @Slots  
				,PulleyDiaDrive = @PulleyDiaDrive
				,PulleyDiaDriven = @PulleyDiaDriven
				,BeltLength = @BeltLength
				,CouplingId = @CouplingId
				,MeanRepairManHours = @MeanRepairManHours
				,DownTimeCostPerHour = @DownTimeCostPerHour
				,CostToRepair = @CostToRepair
				,MeanFailureRate = @MeanFailureRate
				,Active = @Active
				,ManufactureYear = @ManufactureYear
				,FirstInstallationDate = @FirstInstallationDate
				,OperationModeId = @OperationModeId

	WHEN NOT MATCHED BY TARGET
			THEN
				INSERT ( 
				EquipmentId
				,AssetId 
				,IdentificationName
				,ListOrder
				,ManufacturerId
				,RPM
				,Frame
				,Voltage
				,PowerFactor
				,UnitRate
				,Model
				,HP
				,[Type]
				,MotorFanBlades 
				,SerialNumber
				,RotorBars
				,Poles 
				,Slots 
				,PulleyDiaDrive
				,PulleyDiaDriven 
				,BeltLength
				,CouplingId 
				,MeanRepairManHours 
				,DownTimeCostPerHour 
				,CostToRepair
				,MeanFailureRate 
				,Active
				,CreatedBy
				,ManufactureYear
				,FirstInstallationDate
				,OperationModeId
					)
				VALUES ( 
				@EquipmentId
				,@AssetId 
				,@IdentificationName
				,@ListOrder
				,@ManufacturerId
				,@RPM
				,@Frame
				,@Voltage
				,@PowerFactor
				,@UnitRate
				,@Model
				,@HP
				,@Type
				,@MotorFanBlades 
				,@SerialNumber
				,@RotorBars
				,@Poles 
				,@Slots 
				,@PulleyDiaDrive
				,@PulleyDiaDriven 
				,@BeltLength
				,@CouplingId 
				,@MeanRepairManHours 
				,@DownTimeCostPerHour 
				,@CostToRepair
				,@MeanFailureRate 
				,@Active
				,@UserId
				,@ManufactureYear
				,@FirstInstallationDate
				,@OperationModeId
					) OUTPUT INSERTED.DriveUnitId
				INTO @Created ;
			    
				SELECT @DriveUnitId = [DriveUnitId]
				FROM @Created; 
 ---- Process Start Report Service------
	DECLARE @DriveServiceId int,@ReportId int, @JActive varchar(1) 
	
	DROP TABLE IF EXISTS #LoadJson

	CREATE TABLE #LoadJson
	(
	  LoaderId int not null identity(1,1),
	  DriveServiceId int, 
	  ReportId int,
	  Active Varchar(1) 
	) 

Insert into #LoadJson (DriveServiceId,ReportId,Active)
SELECT
    JSON_Value (c.value, '$.UnitServiceId') as DriveServiceId,  
	JSON_Value (c.value, '$.ServiceId') as ReportId, 
	JSON_Value (c.value, '$.Active') as Active  
FROM OPENJSON ( @ReportServicesJson ) as c 
 
  
DECLARE GetIdCur CURSOR READ_ONLY
    FOR
    SELECT DriveServiceId,ReportId,Active
	from #LoadJson  

    OPEN GetIdCur
    FETCH NEXT FROM GetIdCur INTO
    @DriveServiceId,@ReportId,@JActive
    WHILE @@FETCH_STATUS = 0
		BEGIN
		 	MERGE [dbo].[DriveServices] AS [target]
			USING (
				SELECT @DriveUnitId,@ReportId 
				) AS source(DriveUnitId,ReportId)
				ON ([target].[DriveUnitId] = [source].[DriveUnitId] and [target].[ReportId] = [source].[ReportId])
			WHEN MATCHED
				THEN 
					UPDATE
					SET Active = @JActive
			WHEN NOT MATCHED BY TARGET
					THEN
						INSERT (  
						 DriveUnitId
						,ReportId
						,Active
						,CreatedBy
							)
						VALUES ( 
						 @DriveUnitId
						,@ReportId  
						,@JActive
						,@UserId
							)
						;
		FETCH NEXT FROM GetIdCur INTO    @DriveServiceId,@ReportId,@JActive
		END
    CLOSE GetIdCur
    DEALLOCATE GetIdCur
 ---- Process End Report Service------
 ---- Process Start Bearing Drive End------
	DECLARE @BearingId int, @DEActive varchar(1),@DEManufacturerId int ,@DEPlace varchar(3), @RDCount int
	
	DROP TABLE IF EXISTS #LoadDEBearingJson

	CREATE TABLE #LoadDEBearingJson
	(
	  LoaderId int not null identity(1,1),
	  Place varchar(3), 
	  BearingId int,
	  ManufacturerId Int,
	  Active Varchar(1) 
	) 

Insert into #LoadDEBearingJson (BearingId,ManufacturerId,Active,Place)
SELECT
    JSON_Value (c.value, '$.BearingId') as BearingId,
	JSON_Value (c.value, '$.ManufacturerId') as ManufacturerId,   
	JSON_Value (c.value, '$.Active') as Active,
	'DE' as Place  
FROM OPENJSON ( @DEBearingJson ) as c 

select  @RDCount = count(BearingId) from #LoadDEBearingJson
if isnull(@RDCount,0) > 0 
Begin
	Update  [DriveBearing] set Active = 'N' where DriveUnitId = @DriveUnitId and Place = 'DE'
End 

DECLARE GetBeringDECur CURSOR READ_ONLY
    FOR
    SELECT BearingId,ManufacturerId,Active,Place
	from #LoadDEBearingJson  

    OPEN GetBeringDECur
    FETCH NEXT FROM GetBeringDECur INTO
    @BearingId,@DEManufacturerId,@DEActive,@DEPlace
    WHILE @@FETCH_STATUS = 0
		BEGIN
		 	MERGE [dbo].[DriveBearing] AS [target]
			USING (
				SELECT @DriveUnitId, @BearingId, @DEPlace  
				) AS source(DriveUnitId,BearingId,Place)
				ON ([target].[DriveUnitId] = [source].[DriveUnitId] 
				and [target].[Place] = [source].[Place]
				and [target].[BearingId] = [source].[BearingId])				
			WHEN MATCHED
				THEN 
					UPDATE
					SET Active = @DEActive
			WHEN NOT MATCHED BY TARGET
					THEN
						INSERT (  
						 DriveUnitId
						,BearingId
						,ManufacturerId
						,Place
						,Active
						,CreatedBy
							)
						VALUES ( 
						 @DriveUnitId
						,@BearingId 
						,@DEManufacturerId
						,@DEPlace 
						,@DEActive
						,@UserId
							)
						;
		FETCH NEXT FROM GetBeringDECur INTO   @BearingId,@DEManufacturerId,@DEActive,@DEPlace
		END
    CLOSE GetBeringDECur
    DEALLOCATE GetBeringDECur
 ---- Process End Bearing Drive End------
  ---- Process Start Bearing Non Drive End------
	DECLARE @NDEActive varchar(1) ,@NDEPlace varchar(3) , @NDEManufacturerID int , @RNDCount int
	
	DROP TABLE IF EXISTS #LoadNDEBearingJson

	CREATE TABLE #LoadNDEBearingJson
	(
	  LoaderId int not null identity(1,1),
	  Place varchar(3), 
	  BearingId int,
	  ManufacturerId int,
	  Active Varchar(1) 
	) 
 
Insert into #LoadNDEBearingJson (BearingId,ManufacturerId,Active,Place)
SELECT
    JSON_Value (c.value, '$.BearingId') as BearingId,
	JSON_Value (c.value, '$.ManufacturerId') as ManufacturerId,  
	JSON_Value (c.value, '$.Active') as Active,
	'NDE' as Place  
FROM OPENJSON ( @NDEBearingJson ) as c 

select  @RNDCount = count(BearingId) from #LoadNDEBearingJson
if isnull(@RNDCount,0) > 0 
Begin
 Update  [DriveBearing] set Active = 'N' where DriveUnitId = @DriveUnitId and Place = 'NDE'
End 


DECLARE GetBeringNDECur CURSOR READ_ONLY
    FOR
    SELECT BearingId,ManufacturerId,Active,Place
	from #LoadNDEBearingJson  

    OPEN GetBeringNDECur
    FETCH NEXT FROM GetBeringNDECur INTO
    @BearingId,@NDEManufacturerID,@NDEActive,@NDEPlace
    WHILE @@FETCH_STATUS = 0
		BEGIN
		 	MERGE [dbo].[DriveBearing] AS [target]
			USING (
				SELECT @DriveUnitId, @BearingId,@NDEPlace  
				) AS source(DriveUnitId,BearingId,Place)
				ON ([target].[DriveUnitId] = [source].[DriveUnitId] 
				and [target].[Place] = [source].[Place]
				and [target].[BearingId] = [source].[BearingId])				
			WHEN MATCHED
				THEN 
					UPDATE
					SET Active = @NDEActive
			WHEN NOT MATCHED BY TARGET
					THEN
						INSERT (  
						 DriveUnitId
						,BearingId
						,ManufacturerId
						,Place
						,Active
						,CreatedBy
							)
						VALUES ( 
						 @DriveUnitId
						,@BearingId 
						,@NDEManufacturerID
						,@NDEPlace 
						,@NDEActive
						,@UserId
							)
						;
		FETCH NEXT FROM GetBeringNDECur INTO   @BearingId,@NDEManufacturerID,@NDEActive,@NDEPlace
		END
    CLOSE GetBeringNDECur
    DEALLOCATE GetBeringNDECur
 ---- Process End Bearing Non Drive End------ 

	COMMIT TRANSACTION
	END TRY

	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Alter procedure [dbo].[EAppSaveEquipmentWithDriveUnit]
--
GO

CREATE OR ALTER PROCEDURE [dbo].[EAppSaveEquipmentWithDriveUnit]
	 @EquipmentId INT
	,@PlantAreaId INT	  
	,@EquipmentCode NVARCHAR(100)
	,@EquipmentName NVARCHAR(150)
	,@Descriptions NVARCHAR(250)
	,@EListOrder INT 
	,@OrientationId INT 
	,@MountingId INT 
	,@StandByEquipId INT 
	,@DriveUnitId int 
	,@AssetId int 
	,@IdentificationName nvarchar(150)
	,@DListOrder int
	,@ManufacturerId int
	,@RPM nvarchar(100)
	,@Frame nvarchar(100)
	,@Voltage nvarchar(100)
	,@PowerFactor nvarchar(100)
	,@UnitRate nvarchar(100)
	,@Model nvarchar(100)
	,@HP nvarchar(100)
	,@Type nvarchar(100)
	,@MotorFanBlades nvarchar(100)
	,@SerialNumber nvarchar(100)
	,@RotorBars nvarchar(100)
	,@Poles nvarchar(100)
	,@Slots nvarchar(100)
	,@PulleyDiaDrive nvarchar(100)
	,@PulleyDiaDriven nvarchar(100)
	,@BeltLength nvarchar(100)
	,@CouplingId int
	,@MeanRepairManHours decimal(15, 4)
	,@DownTimeCostPerHour decimal(15, 4)
	,@CostToRepair decimal(15, 4)
	,@MeanFailureRate decimal(15, 4) 
	,@ReportServicesJson nvarchar(max) 
	,@DEBearingJson nvarchar(max)
	,@NDEBearingJson nvarchar(max)
	,@Active VARCHAR(1)
	,@UserId INT
	,@ManufactureYear int
	,@FirstInstallationDate date
	,@OperationModeId int
	,@AreaId int
	,@SystemId int
AS
BEGIN
	BEGIN TRANSACTION
	BEGIN TRY
 		DECLARE @Created TABLE (
			[EquipId] INT
			,PRIMARY KEY ([EquipId])
			);
 		if isnull(@EListOrder,0) = 0 and isnull(@EquipmentId,0) = 0
		Begin
			select @EListOrder = isnull(max(e.ListOrder),0)+1 From Equipment e Where e.PlantAreaId = @PlantAreaId
		End
		MERGE [dbo].[Equipment] AS [target]
		USING (
			SELECT @EquipmentId 
			) AS source(EquipmentId)
			ON ([target].[EquipmentId] = [source].[EquipmentId])
		WHEN NOT MATCHED BY TARGET
			THEN
				INSERT (
				 PlantAreaId
				,EquipmentCode
				,EquipmentName
				,Descriptions
				,ListOrder
				,OrientationId
				,MountingId
				,StandByEquipId
				,Active
				,CreatedBy
				,AreaId
				,SystemId
					)
				VALUES (
				 @PlantAreaId
				,@EquipmentCode
				,@EquipmentName
				,@Descriptions
				,@EListOrder
				,@OrientationId
				,@MountingId
				,@StandByEquipId
				,@Active
				,@UserId
				,@AreaId
				,@SystemId
					) 
				OUTPUT INSERTED.EquipmentId
				INTO @Created;
		  
				SELECT @EquipmentId = [EquipId]
				FROM @Created;
				 
		Exec dbo.EAppSaveEquipmentDriveUnit
			@DriveUnitId 
			,@EquipmentId 
			,@AssetId  
			,@IdentificationName 
			,@DListOrder 
			,@ManufacturerId 
			,@RPM 
			,@Frame 
			,@Voltage 
			,@PowerFactor 
			,@UnitRate 
			,@Model 
			,@HP 
			,@Type 
			,@MotorFanBlades 
			,@SerialNumber 
			,@RotorBars 
			,@Poles 
			,@Slots  
			,@PulleyDiaDrive 
			,@PulleyDiaDriven 
			,@BeltLength  
			,@CouplingId  
			,@MeanRepairManHours 
			,@DownTimeCostPerHour 
			,@CostToRepair 
			,@MeanFailureRate
			,@ReportServicesJson
			,@DEBearingJson
			,@NDEBearingJson
			,@Active 
			,@UserId 
			,@ManufactureYear 
	        ,@FirstInstallationDate 
			,@OperationModeId  

			SELECT @EquipmentId as EquipmentId;

		COMMIT TRANSACTION
	END TRY

	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
	
END
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Alter procedure [dbo].[EAppSaveEquipmentDrivenUnit]
--
GO
 
 CREATE OR ALTER PROCEDURE [dbo].[EAppSaveEquipmentDrivenUnit] 
	@DrivenUnitId int 
	,@EquipmentId int 
	,@AssetId int  
	,@IdentificationName nvarchar(150) 
	,@ListOrder int 
	,@ManufacturerId int 
	,@MaxRPM nvarchar(100) 
	,@Capacity nvarchar(100) 
	,@Model nvarchar(100) 
	,@Lubrication nvarchar(100) 
	,@SerialNumber nvarchar(100) 
	,@RatedFlowGPM nvarchar(100) 
	,@PumpEfficiency nvarchar(100) 
	,@RatedSuctionPressure nvarchar(100) 
	,@Efficiency nvarchar(100) 
	,@RatedDischargePressure nvarchar(100) 
	,@CostPerUnit nvarchar(100)  
	,@ImpellerVanes nvarchar(100) 
	,@ImpellerVanesKW nvarchar(100) 
	,@Stages nvarchar(100)  
	,@NumberOfPistons nvarchar(100) 
	,@PumpType nvarchar(100) 
	,@MeanRepairManHours decimal(15, 4) 
	,@DownTimeCostPerHour decimal(15, 4) 
	,@CostToRepair decimal(15, 4) 
	,@MeanFailureRate decimal(15, 4) 
	,@ReportServicesJson nvarchar(max)
	,@DEBearingJson nvarchar(max)
	,@NDEBearingJson nvarchar(max)
	,@Active VARCHAR(1)
	,@UserId INT
	,@ManufactureYear int
	,@FirstInstallationDate date
	,@OperationModeId int
AS
BEGIN
	BEGIN TRANSACTION
	BEGIN TRY
  		DECLARE @Created TABLE (
			[DrivenUnitId] INT
			,PRIMARY KEY ([DrivenUnitId])
			);

 		MERGE [dbo].[EquipmentDrivenUnit] AS [target]
		USING (
			SELECT @DrivenUnitId 
			) AS source(DrivenUnitId)
			ON ([target].[DrivenUnitId] = [source].[DrivenUnitId])
		WHEN MATCHED
			THEN
 
				UPDATE
				SET AssetId = @AssetId,
				IdentificationName = @IdentificationName,
				ListOrder = @ListOrder
				,ManufacturerId = @ManufacturerId
				,MaxRPM = @MaxRPM
				,Capacity = @Capacity
				,Model = @Model
				,Lubrication = @Lubrication
				,SerialNumber = @SerialNumber
				,RatedFlowGPM = @RatedFlowGPM
				,PumpEfficiency = @PumpEfficiency
				,RatedSuctionPressure = @RatedSuctionPressure
				,Efficiency  = @Efficiency
				,RatedDischargePressure = @RatedDischargePressure
				,CostPerUnit = @CostPerUnit 
				,ImpellerVanes = @ImpellerVanes
				,ImpellerVanesKW = @ImpellerVanesKW
				,Stages = @Stages
				,NumberOfPistons = @NumberOfPistons
				,PumpType = @PumpType
				,MeanRepairManHours = @MeanRepairManHours
				,DownTimeCostPerHour = @DownTimeCostPerHour
				,CostToRepair = @CostToRepair
				,MeanFailureRate  = @MeanFailureRate
				,Active = @Active
				,ManufactureYear = @ManufactureYear
				,FirstInstallationDate = @FirstInstallationDate
				,OperationModeId = @OperationModeId
					WHEN NOT MATCHED BY TARGET
			THEN
				INSERT ( 
				 EquipmentId
				,AssetId 
				,IdentificationName
				,ListOrder
				,ManufacturerId
				,MaxRPM
				,Capacity
				,Model
				,Lubrication
				,SerialNumber
				,RatedFlowGPM 
				,PumpEfficiency 
				,RatedSuctionPressure
				,Efficiency
				,RatedDischargePressure
				,CostPerUnit  
				,ImpellerVanes 
				,ImpellerVanesKW  
				,Stages 
				,NumberOfPistons  
				,PumpType  
				,MeanRepairManHours 
				,DownTimeCostPerHour 
				,CostToRepair 
				,MeanFailureRate 
				,Active 
				,CreatedBy
				,ManufactureYear
				,FirstInstallationDate
				,OperationModeId
					)
				VALUES ( 
				@EquipmentId
				,@AssetId 
				,@IdentificationName
				,@ListOrder
				,@ManufacturerId
				,@MaxRPM
				,@Capacity
				,@Model
				,@Lubrication
				,@SerialNumber
				,@RatedFlowGPM 
				,@PumpEfficiency 
				,@RatedSuctionPressure
				,@Efficiency
				,@RatedDischargePressure
				,@CostPerUnit  
				,@ImpellerVanes 
				,@ImpellerVanesKW  
				,@Stages 
				,@NumberOfPistons  
				,@PumpType  
				,@MeanRepairManHours 
				,@DownTimeCostPerHour 
				,@CostToRepair 
				,@MeanFailureRate 
				,@Active  
				,@UserId
				,@ManufactureYear
				,@FirstInstallationDate
				,@OperationModeId
					) OUTPUT INSERTED.DrivenUnitId
				INTO @Created ;
			    
				SELECT @DrivenUnitId = [DrivenUnitId]
				FROM @Created; 
 ---- Process Start Report Service------
	DECLARE @DrivenServiceId int, @ReportId int, @JActive varchar(1) 
	
	DROP TABLE IF EXISTS #LoadJson

	CREATE TABLE #LoadJson
	(
	  LoaderId int not null identity(1,1),
	  DrivenServiceId int, 
	  ReportId int,
	  Active varchar(1) 
	) 

Insert into #LoadJson (DrivenServiceId,ReportId,Active)
SELECT
    JSON_Value (c.value, '$.UnitServiceId') as DrivenServiceId, 
	JSON_Value (c.value, '$.ServiceId') as ReportId, 
	JSON_Value (c.value, '$.Active') as Active  
FROM OPENJSON ( @ReportServicesJson ) as c 
 
  
DECLARE GetIdCur CURSOR READ_ONLY
    FOR
    SELECT DrivenServiceId,ReportId,Active
	from #LoadJson  

    OPEN GetIdCur
    FETCH NEXT FROM GetIdCur INTO
    @DrivenServiceId, @ReportId, @JActive
    WHILE @@FETCH_STATUS = 0
		BEGIN
		 	MERGE [dbo].[DrivenServices] AS [target]
			USING (
				SELECT @DrivenUnitId,@ReportId 
				) AS source(DrivenUnitId,ReportId)
				ON ([target].[DrivenUnitId] = [source].[DrivenUnitId] and [target].[ReportId] = [source].[ReportId])
			WHEN MATCHED
				THEN 
					UPDATE
					SET Active = @JActive
			WHEN NOT MATCHED BY TARGET
					THEN
						INSERT (  
						 DrivenUnitId
						,ReportId
						,Active
						,CreatedBy
							)
						VALUES ( 
						 @DrivenUnitId
						,@ReportId  
						,@JActive
						,@UserId
							)
						;
		FETCH NEXT FROM GetIdCur INTO	@DrivenServiceId,@ReportId,@JActive
		END
    CLOSE GetIdCur
    DEALLOCATE GetIdCur
 ---- Process End Report Service------

  ---- Process Start Bearing Drive End------
	DECLARE @BearingId int, @DEActive varchar(1),@DEManufacturerId int ,@DEPlace varchar(3), @RDCount int
	
	DROP TABLE IF EXISTS #LoadDEBearingJson

	CREATE TABLE #LoadDEBearingJson
	(
	  LoaderId int not null identity(1,1),
	  Place varchar(3), 
	  BearingId int,
	  ManufacturerId Int,
	  Active Varchar(1) 
	) 

Insert into #LoadDEBearingJson (BearingId,ManufacturerId,Active,Place)
SELECT
    JSON_Value (c.value, '$.BearingId') as BearingId,
	JSON_Value (c.value, '$.ManufacturerId') as ManufacturerId,   
	JSON_Value (c.value, '$.Active') as Active,
	'DE' as Place  
FROM OPENJSON ( @DEBearingJson ) as c 
 
DECLARE GetBeringDECur CURSOR READ_ONLY
FOR
SELECT BearingId,ManufacturerId,Active,Place
from #LoadDEBearingJson  

select  @RDCount = count(BearingId) from #LoadDEBearingJson
if isnull(@RDCount,0) > 0 
Begin
	Update  [DrivenBearing] set Active = 'N' where DrivenUnitId = @DrivenUnitId and Place = 'DE'
End 	
    
	OPEN GetBeringDECur
    FETCH NEXT FROM GetBeringDECur INTO
    @BearingId,@DEManufacturerId,@DEActive,@DEPlace
    WHILE @@FETCH_STATUS = 0
		BEGIN
		 	MERGE [dbo].[DrivenBearing] AS [target]
			USING (
				SELECT @DrivenUnitId, @BearingId, @DEPlace  
				) AS source(DrivenUnitId,BearingId,Place)
				ON ([target].[DrivenUnitId] = [source].[DrivenUnitId] 
				and [target].[Place] = [source].[Place]
				and [target].[BearingId] = [source].[BearingId])				
			WHEN MATCHED
				THEN 
					UPDATE
					SET Active = @DEActive
			WHEN NOT MATCHED BY TARGET
					THEN
						INSERT (  
						 DrivenUnitId
						,BearingId
						,ManufacturerId
						,Place
						,Active
						,CreatedBy
							)
						VALUES ( 
						 @DrivenUnitId
						,@BearingId 
						,@DEManufacturerId
						,@DEPlace 
						,@DEActive
						,@UserId
							)
						;
		FETCH NEXT FROM GetBeringDECur INTO   @BearingId,@DEManufacturerId,@DEActive,@DEPlace
		END
    CLOSE GetBeringDECur
    DEALLOCATE GetBeringDECur
 ---- Process End Bearing Drive End------
  ---- Process Start Bearing Non Drive End------
	DECLARE @NDEActive varchar(1) ,@NDEPlace varchar(3) , @NDEManufacturerID int , @RNDCount int
	
	DROP TABLE IF EXISTS #LoadNDEBearingJson

	CREATE TABLE #LoadNDEBearingJson
	(
	  LoaderId int not null identity(1,1),
	  Place varchar(3), 
	  BearingId int,
	  ManufacturerId int,
	  Active Varchar(1) 
	) 
 
Insert into #LoadNDEBearingJson (BearingId,ManufacturerId,Active,Place)
SELECT
    JSON_Value (c.value, '$.BearingId') as BearingId,
	JSON_Value (c.value, '$.ManufacturerId') as ManufacturerId,  
	JSON_Value (c.value, '$.Active') as Active,
	'NDE' as Place  
FROM OPENJSON ( @NDEBearingJson ) as c 

select  @RNDCount = count(BearingId) from #LoadNDEBearingJson
if isnull(@RNDCount,0) > 0 
Begin
	Update  [DrivenBearing] set Active = 'N' where DrivenUnitId = @DrivenUnitId and Place = 'NDE'
End 

 
DECLARE GetBeringNDECur CURSOR READ_ONLY
    FOR
    SELECT BearingId,ManufacturerId,Active,Place
	from #LoadNDEBearingJson  

    OPEN GetBeringNDECur
    FETCH NEXT FROM GetBeringNDECur INTO
    @BearingId,@NDEManufacturerID,@NDEActive,@NDEPlace
    WHILE @@FETCH_STATUS = 0
		BEGIN
		 	MERGE [dbo].[DrivenBearing] AS [target]
			USING (
				SELECT @DrivenUnitId, @BearingId,@NDEPlace  
				) AS source(DrivenUnitId,BearingId,Place)
				ON ([target].[DrivenUnitId] = [source].[DrivenUnitId] 
				and [target].[Place] = [source].[Place]
				and [target].[BearingId] = [source].[BearingId])				
			WHEN MATCHED
				THEN 
					UPDATE
					SET Active = @NDEActive
			WHEN NOT MATCHED BY TARGET
					THEN
						INSERT (  
						 DrivenUnitId
						,BearingId
						,ManufacturerId
						,Place
						,Active
						,CreatedBy
							)
						VALUES ( 
						 @DrivenUnitId
						,@BearingId 
						,@NDEManufacturerID
						,@NDEPlace 
						,@NDEActive
						,@UserId
							)
						;
		FETCH NEXT FROM GetBeringNDECur INTO   @BearingId,@NDEManufacturerID,@NDEActive,@NDEPlace
		END
    CLOSE GetBeringNDECur
    DEALLOCATE GetBeringNDECur
 ---- Process End Bearing Non Drive End------ 
		COMMIT TRANSACTION
	END TRY

	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Alter procedure [dbo].[EAppRptJobEquipConditionChart]
--
GO
CREATE OR ALTER PROCEDURE [dbo].[EAppRptJobEquipConditionChart]
	@JobId bigint,  
	@LanguageId int 
AS
BEGIN  
 
	Declare @TotalCount decimal(5,2)
	select @TotalCount = count(*) from JobEquipment je where je.JobId = @JobId and je.Active = 'Y'
	select c.ConditionId, 
	concat(Cast(dbo.GetLookupTranslated(c.ConditionId,1,'LookupCode' ) as int),':',dbo.[GetConditionCodeTranslated](c.ConditionId,j.ClientSiteId,1,'ConditionName' ),
	' (',count(je.JobEquipmentId),')' )as ECondition,count(je.JobEquipmentId)JCount,
	case when isnull(count(je.JobEquipmentId),0) = 0 then 0 else (isnull(count(je.JobEquipmentId),1) * 100/isnull(@TotalCount,1) )end as CondtionPct
 	from ConditionCodeClientMapping c join jobs j on j.ClientSiteId = c.ClientSiteId and j.jobid = @JobId
	left join JobEquipment je on je.JobId = j.jobid and c.ConditionId = je.ConditionId
	Group by j.clientsiteid,c.ConditionId, je.ConditionId 
	order by c.conditionid
END 
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Alter function [dbo].[GetNameTranslated]
--
GO
CREATE OR ALTER Function [dbo].[GetNameTranslated](@Id int,@LanguageId Int,@Flag varchar(50))
returns nvarchar(150) as
begin
declare @Name nvarchar(150),@Code varchar(10)

If @Flag in( 'ProgramMenuName' , 'ProgramName') 
	Begin
		select @Name = case when @Flag = 'ProgramName' then pt.ProgramName  else pt.MenuName end 
		from Programs p  join ProgramTranslated pt on pt.ProgramId = p.ProgramId and pt.LanguageId = @LanguageId
		where  p.ProgramId = @Id
	--	 ( pt.LanguageId = @LanguageId or (  pt.LanguageId  = p.CreatedLanguageId 	and not exists (select 'x' from ProgramTranslated where ProgramId = p.ProgramId and languageid = @Languageid)))
	End
 
else If @Flag = 'CountryName' 
	Begin
		select @Name = ct.CountryName
		from country c  join CountryTranslated ct on ct.CountryId = c.CountryId and ct.LanguageId = @LanguageId
		where c.CountryId = @Id --   ( ct.LanguageId = @LanguageId or (  ct.LanguageId  = c.CreatedLanguageId 		and not exists (select 'x' from CountryTranslated where countryid = c.countryid and languageid = @Languageid)))
	End
else If @Flag = 'CostCentreName' 
	Begin
		select @Name = ct.CostCentreName
		from CostCentre c  join CostCentreTranslated ct on ct.CostCentreId = c.CostCentreId and ct.LanguageId = @LanguageId
		where c.CostCentreId = @Id --  ( ct.LanguageId = @LanguageId or (  ct.LanguageId  = c.CreatedLanguageId 		and not exists (select 'x' from CostCentreTranslated where CostCentreId = c.CostCentreId and languageid = @Languageid)))
	End
else If @Flag = 'SectorName' 
Begin
	select @Name = st.SectorName 
	from Sector s  join SectorTranslated st on st.SectorId = s.SectorId and st.LanguageId = @LanguageId
	where s.SectorId = @Id 
	--  ( st.LanguageId = @LanguageId or (  st.LanguageId  = s.CreatedLanguageId 	and not exists (select 'x' from SectorTranslated where SectorId = s.SectorId and languageid = @Languageid)))
End
else If @Flag = 'SegmentName' 
Begin
	select @Name = st.SegmentName  
	from Segment s  join SegmentTranslated st on st.SegmentId = s.SegmentId and st.LanguageId = @LanguageId
	where  s.SegmentId = @Id --( st.LanguageId = @LanguageId or (  st.LanguageId  = s.CreatedLanguageId 	and not exists (select 'x' from SegmentTranslated where SegmentId = s.SegmentId and languageid = @Languageid)))
End

else If @Flag = 'IndustryName' 
Begin
	select @Name = ct.IndustryName
	from Industry c  join IndustryTranslated ct on ct.IndustryId = c.IndustryId and  ct.LanguageId = @LanguageId
	where  c.IndustryId = @Id  -- ( ct.LanguageId = @LanguageId or (  ct.LanguageId  = c.CreatedLanguageId 	and not exists (select 'x' from IndustryTranslated where IndustryId = c.IndustryId and languageid = @Languageid)))
End

else If @Flag = 'ClientName' 
Begin
	select @Name = ct.ClientName
	from Client c  join ClientTranslated ct on ct.ClientId = c.ClientId and ct.LanguageId = @LanguageId 
	where   c.ClientId = @Id  -- ( ct.LanguageId = @LanguageId or (  ct.LanguageId  = c.CreatedLanguageId 	and not exists (select 'x' from ClientTranslated where ClientId = c.ClientId and languageid = @Languageid)))
End
else If @Flag = 'ClientSiteName' 
Begin
	select @Name = ct.SiteName
	from ClientSite c  join ClientSiteTranslated ct on ct.ClientSiteId = c.ClientSiteId and ct.LanguageId = @LanguageId
	where  c.ClientSiteId = @Id  --  ( ct.LanguageId = @LanguageId or (  ct.LanguageId  = c.CreatedLanguageId 	and not exists (select 'x' from ClientSiteTranslated where ClientSiteId = c.ClientSiteId and languageid = @Languageid)))
End
else If @Flag = 'RoleGroupName' 
Begin
	select @Name = rt.RoleGroupName
	from RoleGroup r  join RoleGroupTranslated rt on rt.RoleGroupId = r.RoleGroupId and rt.LanguageId = @LanguageId 
	where r.RoleGroupId = @Id --   ( rt.LanguageId = @LanguageId or (  rt.LanguageId  = r.CreatedLanguageId 	and not exists (select 'x' from RoleGroupTranslated where RoleGroupId = r.RoleGroupId and languageid = @Languageid)))
End
else If @Flag = 'RoleName' 
Begin
	select @Name = r.RoleName
	from Roles r  where r.roleid = @Id
End
else If @Flag = 'PrivilegeName' 
Begin
	select @Name = p.PrivilegeName
	from Privileges p  where p.PrivilegeId = @Id
End
else If @Flag in ('LookupValue' , 'LookupCode')
Begin
	select @Name = case when @Flag = 'LookupValue' then lt.LValue
						when @Flag = 'LookupCode' then l.LookupCode end 
	from Lookups l  join LookupTranslated lt on lt.LookupId = l.LookupId and lt.LanguageId = @LanguageId 
	where l.LookupId = @Id 
	--( lt.LanguageId = @LanguageId or (  lt.LanguageId  = l.CreatedLanguageId 	and not exists (select 'x' from LookupTranslated where LookupId = l.LookupId and languageid = @Languageid)))
End
else If @Flag in( 'AssetCategoryName' , 'AssetCategoryCName')
Begin
	select @Name = case  when @Flag = 'AssetCategoryName' then ft.AssetCategoryName
						 when @Flag = 'AssetCategoryCName' then concat(f.AssetCategoryCode ,' - ', ft.AssetCategoryName) end  
	from AssetCategory f  join AssetCategoryTranslated ft on ft.AssetCategoryId = f.AssetCategoryId and ft.LanguageId = @LanguageId
	where f.AssetCategoryId = @Id 
	--( ft.LanguageId = @LanguageId or (  ft.LanguageId  = f.CreatedLanguageId 	and not exists (select 'x' from AssetCategoryTranslated where AssetCategoryId = f.AssetCategoryId and languageid = @Languageid)))
End
else If @Flag in( 'AssetClassName' ,'AssetClassCName', 'AssetClassCode')
Begin
	select @Name = case when @Flag = 'AssetClassName' then ft.AssetClassName
						when @Flag = 'AssetClassCName' then concat(f.AssetClassCode ,' - ', ft.AssetClassName)
						when @Flag = 'AssetClassCode' then f.AssetClassCode end 
	from AssetClass f  join AssetClassTranslated ft on ft.AssetClassId = f.AssetClassId and ft.LanguageId = @LanguageId
	where f.AssetClassId = @Id 
	--( ft.LanguageId = @LanguageId or (  ft.LanguageId  = f.CreatedLanguageId 	and not exists (select 'x' from AssetClassTranslated where AssetClassId = f.AssetClassId and languageid = @Languageid)))
End

else If @Flag in('AssetTypeName','AssetTypeCName','AssetTypeCode')
Begin
	select @Name = Case when @Flag = 'AssetTypeName' then att.AssetTypeName 
						when @Flag = 'AssetTypeCName' then concat(a.AssetTypeCode ,' - ', att.AssetTypeName) 
						when @Flag = 'AssetTypeCode' then a.AssetTypeCode end
	from AssetType a  join AssetTypeTranslated att on att.AssetTypeId = a.AssetTypeId and att.LanguageId = @LanguageId
	where a.AssetTypeId = @Id 
	--( att.LanguageId = @LanguageId or (  att.LanguageId  = a.CreatedLanguageId 	and not exists (select 'x' from AssetTypeTranslated where AssetTypeId = a.AssetTypeId and languageid = @Languageid)))
End
else If @Flag in ('AssetSequenceName','AssetSequenceCName','AssetSequenceCode')
Begin
	select @Name = case when @Flag = 'AssetSequenceName' then ft.AssetSequenceName 
						when @Flag = 'AssetSequenceCName' then concat(f.AssetSequenceCode ,' - ', ft.AssetSequenceName)
						when @Flag = 'AssetSequenceCode' then f.AssetSequenceCode end
	from AssetSequence f  join AssetSequenceTranslated ft on ft.AssetSequenceId = f.AssetSequenceId and ft.LanguageId = @LanguageId 
	where f.AssetSequenceId = @Id 
	--( ft.LanguageId = @LanguageId or (  ft.LanguageId  = f.CreatedLanguageId 	and not exists (select 'x' from AssetSequenceTranslated where AssetSequenceId = f.AssetSequenceId and languageid = @Languageid)))
End
else If @Flag in ('FailureModeName','FailureModeCode')
Begin
	select @Name = case when @Flag = 'FailureModeName' then ft.FailureModeName
						when @Flag = 'FailureModeCode' then f.FailureModeCode end
	from FailureMode f  join FailureModeTranslated ft on ft.FailureModeId = f.FailureModeId and ft.LanguageId = @LanguageId
	where f.FailureModeId = @Id 
	--( ft.LanguageId = @LanguageId or (  ft.LanguageId  = f.CreatedLanguageId 	and not exists (select 'x' from FailureModeTranslated where FailureModeId = f.FailureModeId and languageid = @Languageid)))
End

else If @Flag in ('FailureCauseName','FailureCauseCode')
Begin
	select @Name = case when @Flag = 'FailureCauseName' then ft.FailureCauseName  
						when @Flag = 'FailureCauseCode' then f.FailureCauseCode end
	from FailureCause f  join FailureCauseTranslated ft on ft.FailureCauseId = f.FailureCauseId and ft.LanguageId = @LanguageId
	where f.FailureCauseId = @Id
	--( ft.LanguageId = @LanguageId or (  ft.LanguageId  = f.CreatedLanguageId 	and not exists (select 'x' from FailureCauseTranslated where FailureCauseId = f.FailureCauseId and languageid = @Languageid)))
End
else If @Flag = 'BearingName' 
Begin
	select @Name = bt.BearingName
	from Bearings b  join BearingTranslated bt on bt.BearingId = b.BearingId and bt.LanguageId = @LanguageId
	where b.BearingId = @Id
	--( bt.LanguageId = @LanguageId or (  bt.LanguageId  = b.CreatedLanguageId 	and not exists (select 'x' from BearingTranslated where BearingId = b.BearingId and languageid = @Languageid)))
End
else If @Flag = 'ManufacturerName' 
Begin
	select @Name = mt.ManufacturerName
	from Manufacturer m  join ManufacturerTranslated mt on mt.ManufacturerId = m.ManufacturerId and mt.LanguageId = @LanguageId
	where m.ManufacturerId = @Id
	--( mt.LanguageId = @LanguageId or (  mt.LanguageId  = m.CreatedLanguageId 	and not exists (select 'x' from ManufacturerTranslated where ManufacturerId = m.ManufacturerId and languageid = @Languageid)))
End
else If @Flag = 'PlantAreaName' 
Begin
	select @Name = pat.PlantAreaName
	from PlantArea pa  join PlantAreaTranslated pat on pat.PlantAreaId = pa.PlantAreaId and pat.LanguageId = @LanguageId
	where pa.PlantAreaId = @Id 
	--( pat.LanguageId = @LanguageId or (  pat.LanguageId  = pa.CreatedLanguageId 	and not exists (select 'x' from PlantAreaTranslated where PlantAreaId = pa.PlantAreaId and languageid = @Languageid)))

End
else If @Flag  in ('AreaName','AreaDescriptions')
Begin
	select @Name = case when @Flag = 'AreaName' then st.AreaName when @Flag = 'AreaDescriptions' then st.Descriptions  end 
	from [Area] s  join AreaTranslated st on st.AreaId = s.AreaId and st.LanguageId = @LanguageId
	where s.AreaId = @Id
	--( st.LanguageId = @LanguageId or (  st.LanguageId  = s.AreaLanguageId 	and not exists (select 'x' from AreaTranslated where AreaId = s.AreaId and languageid = @Languageid)))
End
else If @Flag in ('SystemName','SystemDescriptions')
Begin
	select @Name = case when @Flag = 'SystemName' then st.SystemName when @Flag = 'SystemDescriptions' then st.Descriptions  end
	from [System] s  join SystemTranslated st on st.SystemId = s.SystemId and st.LanguageId = @LanguageId
	where s.SystemId = @Id 
	--( st.LanguageId = @LanguageId or (  st.LanguageId  = s.CreatedLanguageId 	and not exists (select 'x' from SystemTranslated where SystemId = s.SystemId and languageid = @Languageid)))
End
else If @Flag = 'EquipmentName' 
Begin
	select @Name = e.EquipmentName from Equipment e where e.EquipmentId = @Id
End
else If @Flag in( 'DRUnitName' ,'DRUnitAssetId')
Begin
 	select @Name = case when @Flag = 'DRUnitName' then d.IdentificationName
						when @Flag = 'DRUnitAssetId' then cast(d.AssetId as varchar) end
     from EquipmentDriveUnit d where d.DriveUnitId = @Id
	End
else If @Flag in('DNUnitName' ,'DNUnitAssetId')
Begin
 	select @Name = case when @Flag = 'DNUnitName' then  d.IdentificationName
	                    when @Flag = 'DNUnitAssetId' then cast(d.AssetId as varchar) end
	from EquipmentDrivenUnit d where d.DrivenUnitId = @Id
	
End
else If @Flag in('INUnitName' ,'INUnitAssetId')
Begin
 	select @Name = case when @Flag = 'INUnitName' then d.IdentificationName 
	                    when @Flag = 'INUnitAssetId' then cast(d.AssetId as varchar) end
     from EquipmentIntermediateUnit d where d.IntermediateUnitId = @Id
End
else If @Flag = 'TaxonomyAssetCode' 
Begin
	select @Name = t.AssetClassTypeCode from Taxonomy t where t.TaxonomyId = @Id
End
Return @Name
end
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Create procedure [dbo].[EAppListBearingByDesignation]
--
GO

CREATE OR ALTER PROCEDURE [dbo].[EAppListBearingByDesignation]
	@LanguageId int,
	@UnitId int,
	@UnitType varchar(75),
	@Type varchar(75), 
	@QueryString varchar(5) -- Used to do wrap search.
AS
BEGIN

if @UnitType = 'DR'
Begin
	select b.BearingId, b.ManufacturerId,b.BearingCode as Designation,bt.BearingName,
	dbo.GetNameTranslated(b.ManufacturerId,@LanguageId,'ManufacturerName') as ManufacturerName 
	from  Bearings b join BearingTranslated bt on bt.BearingId = b.BearingId and bt.LanguageId =  @LanguageId
	where (b.BearingCode like @QueryString+'%') 
	and not exists (select 'x' from DriveBearing d where d.DriveUnitId = @UnitId and Place = @Type and d.BearingId =b.BearingId and d.Active = 'Y') 
End

else if @UnitType = 'IN'
Begin
	select b.BearingId, b.ManufacturerId,b.BearingCode as Designation,bt.BearingName,
	dbo.GetNameTranslated(b.ManufacturerId,@LanguageId,'ManufacturerName') as ManufacturerName 
	from  Bearings b join BearingTranslated bt on bt.BearingId = b.BearingId and bt.LanguageId =  @LanguageId
	where (b.BearingCode like @QueryString+'%') 
	and not exists (select 'x' from DrivenBearing d where d.DrivenUnitId = @UnitId and Place = @Type and d.BearingId =b.BearingId and d.Active = 'Y') 
End

else if @UnitType = 'DN'
Begin
	select b.BearingId, b.ManufacturerId,b.BearingCode as Designation,bt.BearingName,
	dbo.GetNameTranslated(b.ManufacturerId,@LanguageId,'ManufacturerName') as ManufacturerName 
	from  Bearings b join BearingTranslated bt on bt.BearingId = b.BearingId and bt.LanguageId =  @LanguageId
	where (b.BearingCode like @QueryString+'%') 
	and not exists (select 'x' from IntermediateBearing d where d.IntermediateUnitId = @UnitId and Place = @Type and d.BearingId =b.BearingId and d.Active = 'Y') 

End
	 
END
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Alter procedure [dbo].[EAppRptEquipmentConditionMonitoring]
--
GO

CREATE OR ALTER PROCEDURE [dbo].[EAppRptEquipmentConditionMonitoring]
	@JobEquipmentId bigint, 
	@LanguageId int 
AS
BEGIN
  ;With JECTE as (
 	Select j.Jobnumber,j.ReviewerId, e.PlantAreaId,p.ClientSiteId, je.JobEquipmentId,e.EquipmentId, 
	e.EquipmentName, 
	je.ConditionId,	je.DataCollectionDate, je.ReportDate, je.CreatedBy ,je.Comment, 
	Je.ServiceId,e.AreaId,e.SystemId
	from  JobEquipment je Join Equipment e on e.EquipmentId = je.EquipmentId 
	join PlantArea p on p.PlantAreaId = e.PlantAreaId
	join Jobs j on j.JobId = je.JobId
	Where JobEquipmentId = @JobEquipmentId 
	)
	Select 
	je.PlantAreaId,je.ClientSiteId,
	je.ServiceId,
	dbo.GetLookupTranslated(je.ServiceId,@LanguageId,'LookupValue' ) ServiceName,
	 dbo.GetNameTranslated(je.PlantAreaId,@LanguageId,'PlantAreaName') as PlantAreaName,
	 dbo.GetNameTranslated(je.AreaId,@LanguageId,'AreaName') as AreaName,
	 dbo.GetNameTranslated(je.SystemId,@LanguageId,'SystemName') as SystemName,
	je.JobEquipmentId,je.EquipmentId, je.EquipmentName, concat(u.FirstName,' ',u.LastName) as ReportBy , 
	u.EmailId, (Select concat(a.FirstName,' ',a.LastName) from users a where userid = je.ReviewerId ) as ReviewerName,
	je.DataCollectionDate, je.ReportDate, cast(dbo.GetLookupTranslated(je.ConditionId,@LanguageId,'LookupCode' ) as int) as ConditionCode,
	 dbo.[GetConditionCodeTranslated](je.ConditionId,je.ClientSiteId,@LanguageId,'ConditionName' ) as ConditionName,
	je.Comment, @LanguageId as LanguageId
	From JECTE je join users u on u.UserId = je.CreatedBy

END
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Alter procedure [dbo].[EAppListEquipmentIntermediateUnit]
--
GO
 
CREATE OR ALTER PROCEDURE [dbo].[EAppListEquipmentIntermediateUnit]
	@EquipmentId int,
	@IntermediateUnitId int,
	@LanguageId int, 
	@Action varchar(75), -- Attachment | Services
	@Status varchar(5) 
AS
BEGIN
 	Declare @YTCBearingId int 
	If (isnull(@EquipmentId, 0) > 0  and ISNULL(@Action, '') = '')
	Begin
		select @YTCBearingId = BearingId from Bearings where BearingCode = 'YTC'

	   select e.EquipmentId,e.IntermediateUnitId,
	   (select Count(*) from IntermediateBearing ib where ib.IntermediateUnitId = e.IntermediateUnitId and ib.BearingId <> @YTCBearingId and ib.Place = 'DE' and ib.Active = 'Y') as DESelectedCount,
		(select Count(*) from IntermediateBearing ib where ib.IntermediateUnitId = e.IntermediateUnitId and ib.BearingId <> @YTCBearingId and ib.Place = 'NDE' and ib.Active = 'Y') as NDESelectedCount,
		dbo.GetNameTranslated(e.EquipmentId,null,'EquipmentName') EquipmentName,
		e.AssetId,
		dbo.GetNameTranslated(e.AssetId,null,'TaxonomyAssetCode') AssetCode,
		e.IdentificationName,e.ListOrder,
		e.ManufacturerId,
		dbo.GetNameTranslated(e.ManufacturerId,null,'ManufacturerName') ManufacturerName
		,e.Ratio,e.Size,e.BeltLength,e.PulleyDiaDrive,e.PulleyDiaDriven,e.RatedRPMInput,e.RatedRPMOutput,e.PinionInputGearTeeth,e.PinionOutputGearTeeth
		,e.IdlerInputGearTeeth,e.IdlerOutputGearTeeth,e.BullGearTeeth,e.Model,e.Serial,e.BearingInputId,e.BearingOutputId,e.MeanRepairManHours
		,e.DownTimeCostPerHour,e.CostToRepair,e.MeanFailureRate,e.Active,e.ManufactureYear,e.FirstInstallationDate,e.OperationModeId		
	 from EquipmentIntermediateUnit e
	where  e.EquipmentId = @EquipmentId
    End
	else If (isnull(@IntermediateUnitId, 0) > 0 and @Action = 'Attachment')
	Begin
		select ia.IntermediateAttachId, ia.IntermediateUnitId, ia.FileName, ia.LogicalName, ia.PhysicalPath, ia.Active from IntermediateAttachments ia
		where  ia.IntermediateUnitId = @IntermediateUnitId  and ia.Active = @Status
    End
	else If (@Action = 'Services')
	Begin
		select isnull(i.IntermediateServiceId,0)as UnitServiceId,@IntermediateUnitId as IntermediateUnitId,isnull(i.ReportId,l.LookupId)as ServiceId,l.LookupName as ServiceName,isnull(i.Active,'N')as Active from IntermediateServices i 
		right join (select lookupid,dbo.GetNameTranslated(lookupid,@LanguageId,'LookupValue')LookupName,ListOrder from lookups where Lname ='ReportType')  l on i.ReportId = l.LookupId
		and i.IntermediateUnitId = @IntermediateUnitId
		order by l.listOrder
    End
 	else If (@Action = 'DEBearings')
	Begin
		select b.BearingId, b.ManufacturerId,b.BearingCode as Designation,dbo.GetNameTranslated(b.BearingId,@LanguageId,'BearingName') as BearingName,
		dbo.GetNameTranslated(b.ManufacturerId,@LanguageId,'ManufacturerName') as ManufacturerName,
		isnull(d.Active,'N')as Active 
		from IntermediateBearing d 
		join Bearings b on d.BearingId = b.BearingId --and b.active = 'Y' 
		where d.IntermediateUnitId = @IntermediateUnitId and d.Place = 'DE' and d.Active = 'Y'
    End 
	else If (@Action = 'NDEBearings')
	Begin
		select b.BearingId, b.ManufacturerId,b.BearingCode as Designation,dbo.GetNameTranslated(b.BearingId,@LanguageId,'BearingName') as BearingName,
		dbo.GetNameTranslated(b.ManufacturerId,@LanguageId,'ManufacturerName') as ManufacturerName,
		isnull(d.Active,'N')as Active 
		from IntermediateBearing d 
		join Bearings b on d.BearingId = b.BearingId --and b.active = 'Y' 
		where d.IntermediateUnitId = @IntermediateUnitId and d.Place = 'NDE' and d.Active = 'Y'
    End 
END
 
  
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Alter procedure [dbo].[EAppListEquipmentDriveUnit]
--
GO

CREATE OR ALTER PROCEDURE [dbo].[EAppListEquipmentDriveUnit] --8035, 0, 1, '', 'Y'
	@EquipmentId int,
	@DriveUnitId int,
	@LanguageId int, 
	@Action varchar(75), -- Attachment | Services
	@Status varchar(5) 
AS
BEGIN
 	Declare @YTCBearingId int 
	If (isnull(@EquipmentId, 0) > 0 and ISNULL(@Action, '') = '')
	Begin
		select @YTCBearingId = BearingId from Bearings where BearingCode = 'YTC'

		select e.EquipmentId,e.DriveUnitId,
		(select Count(*) from DriveBearing db where db.DriveUnitId = e.DriveUnitId and db.BearingId <> @YTCBearingId and db.Place = 'DE' and db.Active = 'Y') as DESelectedCount,
		(select Count(*) from DriveBearing db where db.DriveUnitId = e.DriveUnitId and db.BearingId <> @YTCBearingId and db.Place = 'NDE' and db.Active = 'Y') as NDESelectedCount,
		dbo.GetNameTranslated(e.EquipmentId,null,'EquipmentName') EquipmentName,
		e.AssetId,
		dbo.GetNameTranslated(e.AssetId,null,'TaxonomyAssetCode') AssetCode,
		e.IdentificationName,e.ListOrder,
		e.ManufacturerId,
		dbo.GetNameTranslated(e.ManufacturerId,null,'ManufacturerName') ManufacturerName,
		e.RPM,e.Frame,e.Voltage,e.PowerFactor,e.UnitRate,e.Model,e.HP,e.[Type] as MType,e.MotorFanBlades,e.SerialNumber,e.RotorBars,e.Poles,e.Slots,e.BearingDriveEndId,
		e.BearingNonDriveEndId,e.PulleyDiaDrive,e.PulleyDiaDriven,e.BeltLength,
		e.CouplingId,
		dbo.GetNameTranslated(e.CouplingId,null,'LookupValue') CouplingName,
		e.MeanRepairManHours,e.DownTimeCostPerHour,e.CostToRepair,e.MeanFailureRate,e.Active,e.ManufactureYear,e.FirstInstallationDate,e.OperationModeId	
		from EquipmentDriveUnit e
		where e.EquipmentId = @EquipmentId
    End

	else If (isnull(@DriveUnitId, 0) > 0 and @Action = 'Attachment')
	Begin
		select da.DriveAttachId, da.DriveUnitId, da.FileName, da.LogicalName, da.PhysicalPath, da.Active from DriveAttachments da
		where  da.DriveUnitId = @DriveUnitId and da.Active = @Status
    End

	else If (@Action = 'Services')
	Begin
		select isnull(d.DriveServiceId,0)as UnitServiceId,@DriveUnitId as DriveUnitId,isnull(d.ReportId,l.LookupId)as ServiceId,l.LookupName as ServiceName,isnull(d.Active,'N')as Active 
		from DriveServices d 
		right join (select lookupid,dbo.GetNameTranslated(lookupid,@LanguageId,'LookupValue')LookupName,ListOrder from lookups where Lname ='ReportType')  l on d.ReportId = l.LookupId
		and d.DriveUnitId = @DriveUnitId
		order by l.listOrder
    End
	else If (@Action = 'DEBearings')
	Begin
		select b.BearingId, b.ManufacturerId,b.BearingCode as Designation,dbo.GetNameTranslated(b.BearingId,@LanguageId,'BearingName') as BearingName,
		dbo.GetNameTranslated(b.ManufacturerId,@LanguageId,'ManufacturerName') as ManufacturerName,
		isnull(d.Active,'N')as Active 
		from DriveBearing d 
		join Bearings b on d.BearingId = b.BearingId --and b.active = 'Y'
		where d.DriveUnitId = @DriveUnitId and d.Place = 'DE' and d.Active = 'Y'
    End 
	else If (@Action = 'NDEBearings')
	Begin
		select b.BearingId, b.ManufacturerId,b.BearingCode as Designation,dbo.GetNameTranslated(b.BearingId,@LanguageId,'BearingName') as BearingName,
		dbo.GetNameTranslated(b.ManufacturerId,@LanguageId,'ManufacturerName') as ManufacturerName,
		isnull(d.Active,'N')as Active 
		from DriveBearing d 
		join Bearings b on d.BearingId = b.BearingId --and b.active = 'Y'
		where d.DriveUnitId = @DriveUnitId and d.Place = 'NDE' and d.Active = 'Y'
    End 
END
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Alter procedure [dbo].[EAppListEquipmentDrivenUnit]
--
GO
 
CREATE OR ALTER PROCEDURE [dbo].[EAppListEquipmentDrivenUnit]
	@EquipmentId int,
	@DrivenUnitId int,
	@LanguageId int, 
	@Action varchar(75), -- Attachment | Services
	@Status varchar(5) 
AS
BEGIN
	Declare @YTCBearingId int 
	select @YTCBearingId = BearingId from Bearings where BearingCode = 'YTC'
	If (isnull(@EquipmentId, 0) > 0 and ISNULL(@Action, '') = '')
	Begin
		select e.EquipmentId,e.DrivenUnitId,
		(select Count(*) from DrivenBearing db where db.DrivenUnitId = e.DrivenUnitId and db.BearingId <> @YTCBearingId and db.Place = 'DE' and db.Active = 'Y') as DESelectedCount,
		(select Count(*) from DrivenBearing db where db.DrivenUnitId = e.DrivenUnitId and db.BearingId <> @YTCBearingId and db.Place = 'NDE' and db.Active = 'Y')  as NDESelectedCount,
		dbo.GetNameTranslated(e.EquipmentId,null,'EquipmentName') EquipmentName,
		e.AssetId,
		dbo.GetNameTranslated(e.AssetId,null,'TaxonomyAssetCode') AssetCode,
		e.IdentificationName,e.ListOrder,
		e.ManufacturerId,
		dbo.GetNameTranslated(e.ManufacturerId,null,'ManufacturerName') ManufacturerName,
		e.MaxRPM,e.Capacity,e.Model,e.Lubrication,e.SerialNumber,e.RatedFlowGPM,e.PumpEfficiency,e.RatedSuctionPressure,e.Efficiency,e.RatedDischargePressure,e.CostPerUnit,e.BearingDriveEndId,e.BearingNonDriveEndId
		,e.ImpellerVanes,e.ImpellerVanesKW,e.Stages,e.NumberOfPistons,e.PumpType,e.MeanRepairManHours,e.DownTimeCostPerHour,e.CostToRepair,e.MeanFailureRate
		,e.Active,e.ManufactureYear,e.FirstInstallationDate,e.OperationModeId	
		from EquipmentDrivenUnit e
		where  e.EquipmentId = @EquipmentId
    End

	else If (isnull(@DrivenUnitId, 0) > 0 and @Action = 'Attachment')
	Begin
		select da.DrivenAttachId, da.DrivenUnitId, da.FileName, da.LogicalName, da.PhysicalPath, da.Active from DrivenAttachments da
		where  da.DrivenUnitId = @DrivenUnitId  and da.Active = @Status
    End

	else If (@Action = 'Services')
	Begin
		select isnull(d.DrivenServiceId,0)as UnitServiceId,@DrivenUnitId as DrivenUnitId,isnull(d.ReportId,l.LookupId)as ServiceId,l.LookupName as ServiceName,isnull(d.Active,'N')as Active 
		from DrivenServices d 
		right join (select lookupid,dbo.GetNameTranslated(lookupid,@LanguageId,'LookupValue')LookupName,ListOrder from lookups where Lname ='ReportType')  l on d.ReportId = l.LookupId
		and d.DrivenUnitId = @DrivenUnitId
		order by l.listOrder
    End
 	else If (@Action = 'DEBearings')
	Begin
		select b.BearingId, b.ManufacturerId,b.BearingCode as Designation, dbo.GetNameTranslated(b.BearingId,@LanguageId,'BearingName') as BearingName,
		dbo.GetNameTranslated(b.ManufacturerId,@LanguageId,'ManufacturerName') as ManufacturerName,
		isnull(d.Active,'N')as Active 
		from DrivenBearing d 
		join Bearings b on d.BearingId = b.BearingId --and b.active = 'Y'
		where d.DrivenUnitId = @DrivenUnitId and d.Place = 'DE' and d.Active = 'Y'
    End  
	else If (@Action = 'NDEBearings')
	Begin
		select b.BearingId, b.ManufacturerId,b.BearingCode as Designation,dbo.GetNameTranslated(b.BearingId,@LanguageId,'BearingName') as BearingName,
		dbo.GetNameTranslated(b.ManufacturerId,@LanguageId,'ManufacturerName') as ManufacturerName,
		isnull(d.Active,'N')as Active 
		from DrivenBearing d 
		join Bearings b on d.BearingId = b.BearingId --and b.active = 'Y'
		where d.DrivenUnitId = @DrivenUnitId and d.Place = 'NDE' and d.Active = 'Y'
    End 

END
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Alter procedure [dbo].[EAppCloneEquipment]
--
GO
 
CREATE OR ALTER PROCEDURE [dbo].[EAppCloneEquipment] 
	 @EquipmentId Bigint
	,@PlantAreaId Int
	,@CloneCount int 
	,@UserId Int
	,@PlantClone int
AS
BEGIN
	BEGIN TRANSACTION
	BEGIN TRY
	  	
		DECLARE @Cloned TABLE (
		[EquipmentId] Bigint
		,PRIMARY KEY ([EquipmentId])
		);

	WHILE (@CloneCount >0)
	BEGIN 
		Declare @NewEquipmentId Bigint, @EquipmentCode nVARCHAR(100) ,@EquipmentName NVARCHAR(150),@EquipmentNName NVARCHAR(150) ,@Descriptions NVARCHAR(250) ,@ListOrder INT 
		,@OrientationId INT  ,@MountingId INT ,@StandByEquipId INT, @DriveUnitJson nvarchar(max), @DrivenUnitJson nvarchar(max)  
		,@IntermediateUnitJson nvarchar(max) ,@Active varchar(1), @Seq bigint
		, @AssetId int 	,@IdentificationName nvarchar(150)	,@DRListOrder int	,@ManufacturerId int	,   @RPM nvarchar(100)
		,@Frame nvarchar(100)	,@Voltage nvarchar(100)	,@PowerFactor nvarchar(100)	,@UnitRate nvarchar(100)	,@Model nvarchar(100)	,@HP nvarchar(100)
		,@Type nvarchar(100)	,@MotorFanBlades nvarchar(100)	,@SerialNumber nvarchar(100)	,@RotorBars nvarchar(100)	,@Poles nvarchar(100)
		,@Slots nvarchar(100)	,@BearingDriveEndId int	,@BearingNonDriveEndId int	,@PulleyDiaDrive nvarchar(100)	,@PulleyDiaDriven nvarchar(100)
		,@BeltLength nvarchar(100)	,@CouplingId int	,@MeanRepairManHours decimal(15, 5)	,@DownTimeCostPerHour decimal(15, 5)	,@CostToRepair decimal(15, 5)
		,@MeanFailureRate decimal(15, 5)	,@DriveServicesJson nvarchar(max),@DEBearingJson nvarchar(max),@NDEBearingJson nvarchar(max)
		,@DNListOrder int , @MaxRPM nvarchar(100) 
		,@Capacity nvarchar(100) , @Lubrication nvarchar(100), @RatedFlowGPM nvarchar(100),@PumpEfficiency nvarchar(100) 
		,@RatedSuctionPressure nvarchar(100),@Efficiency nvarchar(100) ,@RatedDischargePressure nvarchar(100) ,@CostPerUnit nvarchar(100)  
		,@ImpellerVanes nvarchar(100) ,@ImpellerVanesKW nvarchar(100),@Stages nvarchar(100),@NumberOfPistons nvarchar(100) 
		,@PumpType nvarchar(100),@DrivenServicesJson nvarchar(max) 
		,@Ratio nvarchar(100) ,@Size nvarchar(100)
		,@RatedRPMInput nvarchar(100)  ,@RatedRPMOutput nvarchar(100)  ,@PinionInputGearTeeth nvarchar(100) ,@PinionOutputGearTeeth nvarchar(100) 
		,@IdlerInputGearTeeth nvarchar(100)  ,@IdlerOutputGearTeeth nvarchar(100)  ,@BullGearTeeth nvarchar(100)  ,@Serial nvarchar(100) 
		,@BearingInputId int  ,@BearingOutputId int ,@IntermediateServicesJson nvarchar(max),@ManufactureYear int , @FirstInstallationDate date, @OperationModeId int 		
		,@AreaId int, @SystemId int
		DECLARE GetEquipmentCloneCur CURSOR READ_ONLY
		FOR
		Select e.EquipmentCode,e.EquipmentName, e.Descriptions,e.ListOrder,e.OrientationId,e.MountingId, e.StandByEquipId,'Y',
		AreaId,SystemId
		,(SELECT dr.DriveUnitId from EquipmentDriveUnit dr where dr.EquipmentId = e.EquipmentId and dr.Active = 'Y'  
		FOR JSON AUTO 
		)DriveUnitJson 
		,(SELECT dn.DrivenUnitId from EquipmentDrivenUnit dn where dn.EquipmentId = e.EquipmentId and dn.Active = 'Y'  
		FOR JSON AUTO 
		)DrivenUnitJson
		,(SELECT iu.IntermediateUnitId from EquipmentIntermediateUnit iu where iu.EquipmentId = e.EquipmentId and iu.Active = 'Y'  
		FOR JSON AUTO 
		)IntermediateUnitJson	 
	   From Equipment e Where e.EquipmentId = @EquipmentId
		
		OPEN GetEquipmentCloneCur
		FETCH NEXT FROM GetEquipmentCloneCur INTO @EquipmentCode,@EquipmentName, @Descriptions,@ListOrder,@OrientationId,@MountingId, @StandByEquipId,@Active,
		@AreaId,@SystemId,@DriveUnitJson,@DrivenUnitJson,@IntermediateUnitJson
		CLOSE GetEquipmentCloneCur
		DEALLOCATE GetEquipmentCloneCur

		if isnull(@PlantAreaId,0) <> 0
		Begin--Equipment Clone Starts 
			DECLARE @Created TABLE (
			[EquipId] INT
			,PRIMARY KEY ([EquipId])
			);
			 
			select  @NewEquipmentId = 0
			set @EquipmentNName = @EquipmentName
			if isnull(@PlantClone,0) = 0 
			Begin
				set @Seq = (NEXT VALUE FOR [SeqCloneUnit])
				Select 	@EquipmentNName =  concat(@EquipmentName, @Seq) 
			End

 
			select @ListOrder = isnull(max(e.ListOrder),0)+1 From Equipment e Where e.PlantAreaId = @PlantAreaId
 

			MERGE [dbo].[Equipment] AS [target]
			USING (
				SELECT @NewEquipmentId 
				) AS source(EquipmentId)
				ON ([target].[EquipmentId] = [source].[EquipmentId])
			WHEN NOT MATCHED BY TARGET
				THEN
					INSERT (
					 PlantAreaId
					,AreaId
					,SystemId
					,EquipmentCode
					,EquipmentName
					,Descriptions
					,ListOrder
					,OrientationId
					,MountingId
					,StandByEquipId
					,Active
					,CreatedBy
						)
					VALUES (
					 @PlantAreaId
					,@AreaId
					,@SystemId
					,@EquipmentCode
					,@EquipmentNName
					,@Descriptions
					,@ListOrder
					,@OrientationId
					,@MountingId
					,@StandByEquipId
					,@Active
					,@UserId
						)  
				OUTPUT INSERTED.EquipmentId
				INTO @Created;
		  
				SELECT @NewEquipmentId = [EquipId]
				FROM @Created;
				Insert into @Cloned(EquipmentId)values(@NewEquipmentId);
		-------------Equipment Clone Ends -----------------

			if isnull(@NewEquipmentId,0) <> 0 
			Begin
				Begin--Drive Unit Clone Starts			
					DECLARE @DriveUnitId Bigint, @Scount int
					DROP TABLE IF EXISTS #LoadDRUnitJson
					CREATE TABLE #LoadDRUnitJson
					(
						LoaderId int not null identity(1,1),
						DriveUnitId Bigint 
					) 
	 
					Insert into #LoadDRUnitJson (DriveUnitId)
					SELECT
						JSON_Value (c.value, '$.DriveUnitId') as DriveUnitId 
					FROM OPENJSON ( @DriveUnitJson) as c 
					Select 
					@AssetId = Null, @IdentificationName = Null,@DRListOrder = Null,@ManufacturerId = Null,@RPM = Null,@Frame = Null,@Voltage = Null,
					@PowerFactor = Null,@UnitRate= Null,@Model = Null,@HP= Null,@Type= Null,@MotorFanBlades = Null,@SerialNumber = Null,@RotorBars= Null,@Poles= Null,@Slots = Null,
					@BearingDriveEndId = Null,@BearingNonDriveEndId	= Null,@PulleyDiaDrive	= Null,@PulleyDiaDriven	= Null,@BeltLength = Null,
					@CouplingId = Null,@MeanRepairManHours = Null,@DownTimeCostPerHour = Null,@CostToRepair = Null,@MeanFailureRate = Null,
					@DriveServicesJson = Null,@Active = 'Y', @ManufactureYear = null, @FirstInstallationDate = null, @OperationModeId = null,
					@DEBearingJson = Null, @NDEBearingJson = Null


					DECLARE GetDRCloneCur CURSOR READ_ONLY
					FOR
					SELECT 
					du.AssetId,du.IdentificationName,du.ListOrder,du.ManufacturerId,du.RPM ,du.Frame ,du.Voltage 
					,du.PowerFactor,du.UnitRate,du.Model,du.HP,du.[Type],du.MotorFanBlades,du.SerialNumber,du.RotorBars,du.Poles,du.Slots 
					,du.PulleyDiaDrive	,du.PulleyDiaDriven	,du.BeltLength 
					,du.CouplingId,du.MeanRepairManHours,du.DownTimeCostPerHour,du.CostToRepair,du.MeanFailureRate
					,du.ManufactureYear,du.FirstInstallationDate,du.OperationModeId,
					(SELECT db.BearingId ,db.ManufacturerId, 'Y' as Active from DriveBearing db 
					 where db.DriveUnitId = du.DriveUnitId and db.Place = 'DE' and db.Active = 'Y'
					FOR JSON AUTO 
					) DEBearings,
					(SELECT db.BearingId ,db.ManufacturerId, 'Y' as Active from DriveBearing db 
					 where db.DriveUnitId = du.DriveUnitId and db.Place = 'NDE' and db.Active = 'Y'
					FOR JSON AUTO 
					) NDEBearings,
					(SELECT ds.ReportId as ServiceId,ds.Active from DriveServices ds where ds.DriveUnitId = du.DriveUnitId and ds.Active = 'Y'  
					FOR JSON AUTO 
					) ReportingServices
					from EquipmentDriveUnit du join #LoadDRUnitJson s on s.DriveUnitId = du.DriveUnitId 

					OPEN GetDRCloneCur
					FETCH NEXT FROM GetDRCloneCur INTO
					@AssetId, @IdentificationName,@DRListOrder,@ManufacturerId,@RPM ,@Frame ,@Voltage 
					,@PowerFactor,@UnitRate,@Model,@HP,@Type,@MotorFanBlades,@SerialNumber,@RotorBars,@Poles,@Slots 
					,@PulleyDiaDrive	,@PulleyDiaDriven	,@BeltLength 
					,@CouplingId,@MeanRepairManHours,@DownTimeCostPerHour,@CostToRepair,@MeanFailureRate
					,@ManufactureYear,@FirstInstallationDate,@OperationModeId
					,@DEBearingJson,@NDEBearingJson,@DriveServicesJson
					WHILE @@FETCH_STATUS = 0
					BEGIN

						EXEC [dbo].[EAppSaveEquipmentDriveUnit] 
						0,@NewEquipmentId,@AssetId,@IdentificationName,@DRListOrder,@ManufacturerId,@RPM,@Frame,@Voltage,@PowerFactor
						,@UnitRate,@Model,@HP,@Type,@MotorFanBlades,@SerialNumber,@RotorBars,@Poles,@Slots
						,@PulleyDiaDrive,@PulleyDiaDriven,@BeltLength,@CouplingId,@MeanRepairManHours,@DownTimeCostPerHour,@CostToRepair,@MeanFailureRate
						,@DriveServicesJson,@DEBearingJson,@NDEBearingJson, @Active,@UserId,@ManufactureYear,@FirstInstallationDate,@OperationModeId

 					FETCH NEXT FROM GetDRCloneCur INTO
					@AssetId,@IdentificationName,@DRListOrder,@ManufacturerId,@RPM ,@Frame ,@Voltage 
					,@PowerFactor,@UnitRate,@Model,@HP,@Type,@MotorFanBlades,@SerialNumber,@RotorBars,@Poles,@Slots 
					,@PulleyDiaDrive	,@PulleyDiaDriven	,@BeltLength 
					,@CouplingId,@MeanRepairManHours,@DownTimeCostPerHour,@CostToRepair,@MeanFailureRate
					,@ManufactureYear,@FirstInstallationDate,@OperationModeId
					,@DEBearingJson,@NDEBearingJson,@DriveServicesJson
					END
					CLOSE GetDRCloneCur
					DEALLOCATE GetDRCloneCur

				END--DriveUnit Clone End

				Begin--Driven Unit Clone Starts			
					DECLARE @DrivenUnitId Bigint 
					DROP TABLE IF EXISTS #LoadDNUnitJson
					CREATE TABLE #LoadDNUnitJson
					(
						LoaderId int not null identity(1,1),
						DrivenUnitId Bigint 
					) 
	 
					Insert into #LoadDNUnitJson (DrivenUnitId)
					SELECT
						JSON_Value (c.value, '$.DrivenUnitId') as DrivenUnitId 
					FROM OPENJSON ( @DrivenUnitJson) as c 
					SELECT @EquipmentId = Null , @AssetId  = Null , @IdentificationName = Null , @ListOrder = Null , @ManufacturerId = Null , @MaxRPM = Null ,  
					 @Capacity   = Null , @Model  = Null , @Lubrication  = Null , @SerialNumber  = Null , @RatedFlowGPM  = Null , @PumpEfficiency   = Null , 
					 @RatedSuctionPressure  = Null , @Efficiency   = Null , @RatedDischargePressure   = Null , @CostPerUnit   = Null , @BearingDriveEndId = Null , 
					 @BearingNonDriveEndId = Null , @ImpellerVanes   = Null , @ImpellerVanesKW  = Null , @Stages  = Null , @NumberOfPistons  = Null ,  
					 @PumpType = Null , @MeanRepairManHours = Null , @DownTimeCostPerHour = Null , @CostToRepair = Null , @MeanFailureRate = Null , 
					 @DrivenServicesJson  = Null , @ManufactureYear = null, @FirstInstallationDate = null, @OperationModeId = null  ,
					 @DEBearingJson = Null, @NDEBearingJson = Null

					DECLARE GetDNCloneCur CURSOR READ_ONLY
					FOR
					SELECT 
					du.AssetId ,du.IdentificationName,du.ListOrder,du.ManufacturerId,du.MaxRPM  
					,du.Capacity  ,du.Model ,du.Lubrication ,du.SerialNumber ,du.RatedFlowGPM ,du.PumpEfficiency  
					,du.RatedSuctionPressure ,du.Efficiency  ,du.RatedDischargePressure  ,du.CostPerUnit
					,du.ImpellerVanes  ,du.ImpellerVanesKW ,du.Stages ,du.NumberOfPistons  
					,du.PumpType,du.MeanRepairManHours,du.DownTimeCostPerHour,du.CostToRepair,du.MeanFailureRate
					,du.ManufactureYear,du.FirstInstallationDate,du.OperationModeId
					,(SELECT db.BearingId ,db.ManufacturerId, 'Y' as Active from DrivenBearing db 
					 where db.DrivenUnitId = du.DrivenUnitId and db.Place = 'DE' and db.Active = 'Y'
					FOR JSON AUTO 
					) DEBearings,
					(SELECT db.BearingId ,db.ManufacturerId, 'Y' as Active from DrivenBearing db 
					 where db.DrivenUnitId = du.DrivenUnitId and db.Place = 'NDE' and db.Active = 'Y'
					FOR JSON AUTO 
					) NDEBearings
					, (SELECT ds.ReportId as ServiceId,ds.Active from DrivenServices ds where ds.DrivenUnitId = @DrivenUnitId and ds.Active = 'Y'  
					FOR JSON AUTO 
					) ReportingServices
					from EquipmentDrivenUnit du join #LoadDNUnitJson n on n.DrivenUnitId =du.DrivenUnitId 

					OPEN GetDNCloneCur
					FETCH NEXT FROM GetDNCloneCur INTO
					@AssetId ,@IdentificationName,@ListOrder,@ManufacturerId,@MaxRPM  
					,@Capacity  ,@Model ,@Lubrication ,@SerialNumber ,@RatedFlowGPM ,@PumpEfficiency  
					,@RatedSuctionPressure ,@Efficiency  ,@RatedDischargePressure  ,@CostPerUnit
					,@ImpellerVanes  ,@ImpellerVanesKW ,@Stages ,@NumberOfPistons  
					,@PumpType,@MeanRepairManHours,@DownTimeCostPerHour,@CostToRepair,@MeanFailureRate
					,@ManufactureYear,@FirstInstallationDate,@OperationModeId
					,@DEBearingJson,@NDEBearingJson,@DrivenServicesJson
					WHILE @@FETCH_STATUS = 0
					BEGIN
						EXEC [dbo].[EAppSaveEquipmentDrivenUnit] 
						0,@NewEquipmentId,@AssetId ,@IdentificationName,@ListOrder,@ManufacturerId,@MaxRPM  
						,@Capacity  ,@Model ,@Lubrication ,@SerialNumber ,@RatedFlowGPM ,@PumpEfficiency  
						,@RatedSuctionPressure ,@Efficiency  ,@RatedDischargePressure  ,@CostPerUnit,@ImpellerVanes  
						,@ImpellerVanesKW ,@Stages ,@NumberOfPistons  
						,@PumpType,@MeanRepairManHours,@DownTimeCostPerHour,@CostToRepair,@MeanFailureRate
						,@DrivenServicesJson,@DEBearingJson,@NDEBearingJson,@Active,@UserId,@ManufactureYear,@FirstInstallationDate,@OperationModeId

 					FETCH NEXT FROM GetDNCloneCur INTO
					@AssetId ,@IdentificationName,@ListOrder,@ManufacturerId,@MaxRPM  
					,@Capacity  ,@Model ,@Lubrication ,@SerialNumber ,@RatedFlowGPM ,@PumpEfficiency  
					,@RatedSuctionPressure ,@Efficiency  ,@RatedDischargePressure  ,@CostPerUnit  
					,@ImpellerVanes  ,@ImpellerVanesKW ,@Stages ,@NumberOfPistons  
					,@PumpType,@MeanRepairManHours,@DownTimeCostPerHour,@CostToRepair,@MeanFailureRate
					,@ManufactureYear,@FirstInstallationDate,@OperationModeId
					,@DEBearingJson,@NDEBearingJson,@DrivenServicesJson
					END
					CLOSE GetDNCloneCur
					DEALLOCATE GetDNCloneCur

				END--DrivenUnit Clone End

				Begin--IntermediateUnit Clone Starts			
					DECLARE @IntermediateUnitId Bigint 
					DROP TABLE IF EXISTS #LoadINUnitJson
					CREATE TABLE #LoadINUnitJson
					(
						LoaderId int not null identity(1,1),
						IntermediateUnitId Bigint 
					) 
	 
					Insert into #LoadINUnitJson (IntermediateUnitId)
					SELECT
						JSON_Value (c.value, '$.IntermediateUnitId') as IntermediateUnitId 
					FROM OPENJSON ( @IntermediateUnitJson) as c 

					SELECT @AssetId  = Null , @IdentificationName  = Null , @ListOrder  = Null , @ManufacturerId  = Null , @Ratio  = Null ,					 
					 @Size    = Null , @Model   = Null , @BeltLength   = Null , @PulleyDiaDrive    = Null , @PulleyDiaDriven   = Null ,
					 @RatedRPMInput    = Null , @RatedRPMOutput    = Null , @PinionInputGearTeeth   = Null , @PinionOutputGearTeeth  = Null , 
					 @IdlerInputGearTeeth    = Null , @IdlerOutputGearTeeth    = Null , @BullGearTeeth    = Null , @Serial   = Null ,
					 @BearingInputId  = Null , @BearingOutputId = Null , @MeanRepairManHours   = Null , @DownTimeCostPerHour  = Null ,
					 @CostToRepair   = Null , @MeanFailureRate  = Null , @IntermediateServicesJson  = Null, @Active = 'Y',
					 @ManufactureYear = Null, @FirstInstallationDate = Null, @OperationModeId = Null,
					 @DEBearingJson = Null, @NDEBearingJson = Null

					DECLARE GetINCloneCur CURSOR READ_ONLY
					FOR
					SELECT 
					 iu.AssetId ,iu.IdentificationName ,iu.ListOrder ,iu.ManufacturerId ,iu.Ratio  
					,iu.Size   ,iu.Model  ,iu.BeltLength  ,iu.PulleyDiaDrive   ,iu.PulleyDiaDriven  
					,iu.RatedRPMInput   ,iu.RatedRPMOutput   ,iu.PinionInputGearTeeth  ,iu.PinionOutputGearTeeth  
					,iu.IdlerInputGearTeeth   ,iu.IdlerOutputGearTeeth   ,iu.BullGearTeeth   ,iu.Serial  
					,iu.MeanRepairManHours  ,iu.DownTimeCostPerHour 
					,iu.CostToRepair  ,iu.MeanFailureRate
					,iu.ManufactureYear,iu.FirstInstallationDate,iu.OperationModeId 
					,(SELECT ib.BearingId ,ib.ManufacturerId, 'Y' as Active from IntermediateBearing ib 
					 where ib.IntermediateUnitId = iu.IntermediateUnitId and ib.Place = 'DE' and ib.Active = 'Y'
					FOR JSON AUTO 
					) DEBearings,
					(SELECT ib.BearingId ,ib.ManufacturerId, 'Y' as Active from IntermediateBearing ib 
					 where ib.IntermediateUnitId = iu.IntermediateUnitId and ib.Place = 'NDE' and ib.Active = 'Y'
					FOR JSON AUTO 
					) NDEBearings
					, (SELECT ds.ReportId as ServiceId,ds.Active from IntermediateServices ds where ds.IntermediateUnitId = iu.IntermediateUnitId and ds.Active = 'Y'  
					FOR JSON AUTO 
					) ReportingServices
					from EquipmentIntermediateUnit iu join #LoadINUnitJson n on n.IntermediateUnitId =iu.IntermediateUnitId
 

					OPEN GetINCloneCur
					FETCH NEXT FROM GetINCloneCur INTO
					 @AssetId ,@IdentificationName ,@ListOrder ,@ManufacturerId ,@Ratio  
					,@Size   ,@Model  ,@BeltLength  ,@PulleyDiaDrive   ,@PulleyDiaDriven  
					,@RatedRPMInput   ,@RatedRPMOutput   ,@PinionInputGearTeeth  ,@PinionOutputGearTeeth  
					,@IdlerInputGearTeeth   ,@IdlerOutputGearTeeth   ,@BullGearTeeth   ,@Serial  
					,@MeanRepairManHours  ,@DownTimeCostPerHour 
					,@CostToRepair  ,@MeanFailureRate,@ManufactureYear,@FirstInstallationDate,@OperationModeId
					,@DEBearingJson, @NDEBearingJson ,@IntermediateServicesJson
					WHILE @@FETCH_STATUS = 0
					BEGIN
						EXEC [dbo].[EAppSaveEquipmentIntermediateUnit] 
							0,@NewEquipmentId,@AssetId ,@IdentificationName ,@ListOrder ,@ManufacturerId ,@Ratio  
						,@Size   ,@Model  ,@BeltLength  ,@PulleyDiaDrive   ,@PulleyDiaDriven  
						,@RatedRPMInput   ,@RatedRPMOutput   ,@PinionInputGearTeeth  ,@PinionOutputGearTeeth  
						,@IdlerInputGearTeeth   ,@IdlerOutputGearTeeth   ,@BullGearTeeth   ,@Serial  
						,@MeanRepairManHours  ,@DownTimeCostPerHour 
						,@CostToRepair  ,@MeanFailureRate 
						,@IntermediateServicesJson,@DEBearingJson, @NDEBearingJson ,@Active,@UserId,@ManufactureYear,@FirstInstallationDate,@OperationModeId
 
 					FETCH NEXT FROM GetINCloneCur INTO
					 @AssetId ,@IdentificationName ,@ListOrder ,@ManufacturerId ,@Ratio  
					,@Size   ,@Model  ,@BeltLength  ,@PulleyDiaDrive   ,@PulleyDiaDriven  
					,@RatedRPMInput   ,@RatedRPMOutput   ,@PinionInputGearTeeth  ,@PinionOutputGearTeeth  
					,@IdlerInputGearTeeth   ,@IdlerOutputGearTeeth   ,@BullGearTeeth   ,@Serial  
					,@MeanRepairManHours  ,@DownTimeCostPerHour 
					,@CostToRepair  ,@MeanFailureRate,@ManufactureYear,@FirstInstallationDate,@OperationModeId
					,@DEBearingJson, @NDEBearingJson ,@IntermediateServicesJson
					END
					CLOSE GetINCloneCur
					DEALLOCATE GetINCloneCur

				END--IntermediateUnit Clone End
			End
			
		End --Equipment Clone End
 
	SET @CloneCount = @CloneCount - 1
	END
	COMMIT TRANSACTION;
	
	if isnull(@plantClone,0) = 0  
		Begin
		select e.Equipmentid as TId, e.EquipmentName as TName from  Equipment e
		join @Cloned c on c.EquipmentId = e.EquipmentId 
		End 
	END TRY

	BEGIN CATCH
		IF @@TRANCOUNT > 0
			ROLLBACK TRANSACTION;
		THROW;
	END CATCH
END
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--*** @Manual Scripts *** Version7.0.1.1 *** Prepared By : Prakash Anban *** Date : 18-Jul-2019 ***

ALTER   PROCEDURE [dbo].[EAppListBearingByDesignation]
	@LanguageId int,
	@UnitId int,
	@UnitType varchar(75),
	@Type varchar(75), 
	@QueryString varchar(5) -- Used to do wrap search.
AS
BEGIN

if @UnitType = 'DR'
Begin
	select b.BearingId, b.ManufacturerId,b.BearingCode as Designation, Concat('(',b.BearingCode, ') - ', bt.BearingName) as BearingName,
	dbo.GetNameTranslated(b.ManufacturerId,@LanguageId,'ManufacturerName') as ManufacturerName 
	from  Bearings b join BearingTranslated bt on bt.BearingId = b.BearingId and bt.LanguageId =  @LanguageId
	where (b.BearingCode like @QueryString+'%') 
	and not exists (select 'x' from DriveBearing d where d.DriveUnitId = @UnitId and Place = @Type and d.BearingId =b.BearingId and d.Active = 'Y') 
End

else if @UnitType = 'IN'
Begin
	select b.BearingId, b.ManufacturerId,b.BearingCode as Designation, Concat('(',b.BearingCode, ') - ', bt.BearingName) as BearingName,
	dbo.GetNameTranslated(b.ManufacturerId,@LanguageId,'ManufacturerName') as ManufacturerName 
	from  Bearings b join BearingTranslated bt on bt.BearingId = b.BearingId and bt.LanguageId =  @LanguageId
	where (b.BearingCode like @QueryString+'%') 
	and not exists (select 'x' from DrivenBearing d where d.DrivenUnitId = @UnitId and Place = @Type and d.BearingId =b.BearingId and d.Active = 'Y') 
End

else if @UnitType = 'DN'
Begin
	select b.BearingId, b.ManufacturerId,b.BearingCode as Designation, Concat('(',b.BearingCode, ') - ', bt.BearingName) as BearingName,
	dbo.GetNameTranslated(b.ManufacturerId,@LanguageId,'ManufacturerName') as ManufacturerName 
	from  Bearings b join BearingTranslated bt on bt.BearingId = b.BearingId and bt.LanguageId =  @LanguageId
	where (b.BearingCode like @QueryString+'%') 
	and not exists (select 'x' from IntermediateBearing d where d.IntermediateUnitId = @UnitId and Place = @Type and d.BearingId =b.BearingId and d.Active = 'Y') 

End
	 
END


--
-- Commit Transaction
--
IF @@TRANCOUNT>0 COMMIT TRANSACTION
GO

--*** @Manual Scripts *** Version7.1.0.3 *** Prepared By : Senthil Kumar *** Date : 02-Aug-2019 ***
CREATE PROCEDURE [dbo].[EAppRptExportJobDetail]  
	@JobId bigint, 
	@LanguageId int 
	as
	Begin
	DROP TABLE IF EXISTS #TJobDetails
	CREATE TABLE #TJobDetails
	(
		LoaderId int not null identity(1,1),
		Plant nvarchar(250),
		MachineId nvarchar(250),
		MachineDescription nvarchar(2500),
		AssetId nvarchar(250),
		SurveyDate Date,
		ReportDate Date,
		ServiceType nvarchar(250),
		ConditionName nvarchar(250),
		IndicatedFaults nvarchar(max),
		AssetComment nvarchar(max),
		AssetRecommendation nvarchar(max),
		ConfidenceFactor nvarchar(250),
		FailureProbability nvarchar(150),
		Priorities nvarchar(150),
		ClientSiteId int,
		UnitAnalysisId bigint,
		UnitType varchar(3),
		UnitId bigint,
		JobEquipmentId bigint,
		ServiceId bigint,
		DataCollectionDate Date
	) 
	insert into #TJobDetails(Plant,MachineId,MachineDescription,AssetId,SurveyDate,ReportDate,ServiceType,ConditionName,IndicatedFaults,AssetComment,AssetRecommendation,ConfidenceFactor,FailureProbability,Priorities,ClientSiteId,UnitAnalysisId,UnitType,UnitId,JobEquipmentId,ServiceId,DataCollectionDate)
	exec [EAppRptJobDetail] @JobId,@LanguageId
	 
	DROP TABLE IF EXISTS #TJobAssetHistory
	CREATE TABLE #TJobAssetHistory
	(
		HLoaderId int not null identity(1,1), 
		UnitType varchar(3),
		UnitId Bigint,
		ServiceId int,
		JobEquipmentId bigint,
		PDate2 varchar(30), 
		PCondition2 varchar(100),	 
		PDate3 varchar(30), 
		PCondition3 varchar(100),
		PDate4 varchar(30), 
		PCondition4 varchar(100),
		PDate5 varchar(30),
		PCondition5 varchar(100) 
	)			 
	Declare @UnitType varchar(3),@UnitId Bigint,@ServiceId int ,@UnitAnalysisId Bigint,@JobEquipmentId Bigint ,@DataCollectionDate Date,@ClientSiteId int
	DECLARE GetJobDetail CURSOR READ_ONLY
	FOR
	Select  ClientSiteId,UnitAnalysisId,UnitType,UnitId,JobEquipmentId,ServiceId,DataCollectionDate from #TJobDetails
	OPEN GetJobDetail
	FETCH NEXT FROM GetJobDetail INTO @ClientSiteId,@UnitAnalysisId,@UnitType,@UnitId,@JobEquipmentId,@ServiceId,@DataCollectionDate
	WHILE @@FETCH_STATUS = 0
	BEGIN
		insert into #TJobAssetHistory(UnitType,UnitId,ServiceId,JobEquipmentId,PDate2,PCondition2,PDate3,PCondition3,PDate4,PCondition4,PDate5,PCondition5)
		exec [EAppRptGetAssetConditionHistory] @UnitType,@UnitId,@ServiceId,@UnitAnalysisId,@JobEquipmentId,@DataCollectionDate,@ClientSiteId,@LanguageId  

	FETCH NEXT FROM GetJobDetail INTO @ClientSiteId,@UnitAnalysisId,@UnitType,@UnitId,@JobEquipmentId,@ServiceId,@DataCollectionDate
 	END
	CLOSE GetJobDetail
	DEALLOCATE GetJobDetail 

	select Plant,MachineId as 'Machine ID',MachineDescription as 'Machine Description' ,AssetId as 'Asset ID',h.PDate2 as 'Previous Date',h.PCondition2 as 'Previous Code', SurveyDate as 'Surevey Date',ReportDate as 'Report Date',ServiceType as 'Service Type',ConditionName as 'Condition Name',IndicatedFaults as 'Indicated Faults',AssetComment as 'Asset Comment',AssetRecommendation as 'Asset Recommendation',ConfidenceFactor as 'Confident Factor',FailureProbability as 'Failure Probability',Priorities as 'Priority',
	h.PDate3 as '3rd Date', h.PCondition3 as '3rd Code',h.PDate4 as '4rd Date', h.PCondition4 as '4rd Code',h.PDate5 as '5rd Date', h.PCondition5 as '5rd Code'
 	from #TJobDetails J join  #TJobAssetHistory H on j.UnitType = h.UnitType and j.UnitId = h.UnitId and   h.ServiceId = h.ServiceId and j.JobEquipmentId = h.JobEquipmentId
	 
 END 

--
-- Set NOEXEC to off
--
SET NOEXEC OFF
GO
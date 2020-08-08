 
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
-- Alter procedure [dbo].[EAppListJobEquipment]
--
GO
 
 
CREATE OR ALTER PROCEDURE [dbo].[EAppListJobEquipment]
	@JobId Bigint, 
	@ServiceId int,
	@LanguageId int,  
	@StatusId int,
	@UserId int
AS
BEGIN
 Declare @IsOil int 

 if @ServiceId = 0
	set @ServiceId = null;

 Select @IsOil = dbo.[GetStatusId](@LanguageId,'ReportType' , 'OA')

 Select je.JobEquipmentId, je.JobId, j.JobName, j.JobNumber, je.EquipmentId,''as EquipmentCode,
 dbo.GetNameTranslated(je.EquipmentId,@LanguageId,'EquipmentName')as EquipmentName, 
 je.ActStartDate, je.ActEndDate, je.StatusId
 ,dbo.GetLookupTranslated(dbo.GetStatusId(@LanguageId,'ReportStatusLegend',dbo.GetLookupTranslated(je.StatusId,@LanguageId,'LookupCode')),@LanguageId,'LookupValue')  StatusColour
 , isnull(dbo.GetLookupTranslated(je.StatusId,@LanguageId,'LookupValue'),'') StatusName
 , isnull(dbo.GetLookupTranslated(je.StatusId,@LanguageId,'LookupCode'),'') StatusCode, isnull(dbo.CheckJobStatus(je.StatusId),0) as IsEditable, 
 case when isnull((select Count(ua.UnitAnalysisId) from JobEquipUnitAnalysis ua where ua.JobEquipmentId = je.JobEquipmentId and ua.IsWorkNotification = 'Y' ),0) >0 then 'Y' else 'N' end as  IsWorkNotification, 
 case when isnull((select Count(ua.UnitAnalysisId) from JobEquipUnitAnalysis ua where ua.JobEquipmentId = je.JobEquipmentId and ua.ServiceId = @IsOil),0) >0 then 'Y' else 'N' end as 'IsOilProperties',
 e.PlantAreaId, dbo.GetNameTranslated(e.PlantAreaId,@LanguageId,'PlantAreaName') as PlantAreaName,
 je.ConditionId,je.Comment as EquipmentComment, je.DataCollectionDate, je.ReportDate , je.ServiceId, isnull(dbo.GetLookupTranslated(je.ServiceId,@LanguageId,'LookupValue'),'') ServiceName,
 je.DataCollectionDone, dbo.[JobEquipUnitUnselected](je.JobEquipmentId) as AssetToReport
 ,getdate() ReportingDate
 from  JobEquipment je  join Jobs j on j.JobId = je.JobId and je.ServiceId = isnull(@ServiceId,je.ServiceId)
 join Equipment e on e.EquipmentId = je.EquipmentId   
 where je.JobId = @JobId and  je.Active = 'Y' and (je.DataCollectorId = @UserId or je.AnalystId = @UserId or je.ReviewerId = @UserId)
 order by  dbo.GetLookupTranslated(je.ServiceId,@LanguageId,'LookupOrder') , e.PlantAreaId,e.ListOrder 
END
 
GO
IF @@ERROR<>0 OR @@TRANCOUNT=0 BEGIN IF @@TRANCOUNT>0 ROLLBACK SET NOEXEC ON END
GO

--
-- Alter procedure [dbo].[EAppSaveJob]
--
GO

 
CREATE OR ALTER PROCEDURE [dbo].[EAppSaveJob]
	 @JobId Bigint 
	,@ScheduleSetupId Bigint 
	,@ClientSiteId int    
	,@JobName nvarchar(150) 
	,@EstStartDate Date 
	,@EstEndDate Date 
	,@AnalystId int  
    ,@JobEquipmentsJson nvarchar(max)
	,@JobServicesJson nvarchar(max)
	,@StatusId int
	,@UserId INT 
AS
BEGIN


	BEGIN TRANSACTION
	BEGIN TRY

		DECLARE @JobNumber varchar(50) Declare @UpdateScheduleStatusid int
  		DECLARE @Created TABLE (
			[JobId] Bigint
			,PRIMARY KEY ([JobId])
			);
		set @UpdateScheduleStatusid = 0 ;
		If @JobId = 0
		Begin
			Select @Statusid = dbo.GetStatusId(1,'JobProcessStatus','NS') , @JobNumber = (NEXT VALUE FOR [SeqJobNumber]),
			@UpdateScheduleStatusid = dbo.GetStatusId(1,'ScheduleStatus','JG') 
		End
 		MERGE [dbo].[Jobs] AS [target] 
		USING (
			SELECT @JobId 
			) AS source(JobId)
			ON ([target].[JobId] = [source].[JobId])
		WHEN MATCHED
			THEN 
				UPDATE 
				SET    
				 ClientSiteId = @ClientSiteId
				,ScheduleSetupId = @ScheduleSetupId 
				,AnalystId = @AnalystId
				,EstStartDate = @EstStartDate
				,EstEndDate = @EstEndDate
				,JobName = @JobName
			 WHEN NOT MATCHED BY TARGET
			THEN
				INSERT ( 
				 ClientSiteId  
				,ScheduleSetupId
				,JobNumber 
				,JobName 
				,EstStartDate
				,EstEndDate				
				,DataCollectionDate 
				,ReportDate 
				,AnalystId 
				,StatusId 
				,CreatedBy
					)
				VALUES ( 
				 @ClientSiteId  
				,@ScheduleSetupId
				,@JobNumber 
				,@JobName 
				,@EstStartDate
				,@EstEndDate
				,@EstStartDate 
				,@EstEndDate 
				,@AnalystId 
				,@StatusId  
				,@UserId
					) OUTPUT INSERTED.JobId
				INTO @Created ;
			    
				SELECT @JobId = [JobId]
				FROM @Created; 

				if isnull(@UpdateScheduleStatusid,0) > 0 and isnull(@ScheduleSetupId,0) > 0
				Begin
					Update ScheduleSetup set StatusId =	@UpdateScheduleStatusid where ScheduleSetupId = @ScheduleSetupId
				End
 ---- Process Start Report Service------
	DECLARE @JobServiceId int, @ServiceId int , @JActive varchar(1)
	
	DROP TABLE IF EXISTS #LoadReportJson

	CREATE TABLE #LoadReportJson
	(
	  LoaderId int not null identity(1,1),
	  JobServiceId int, 
	  ServiceId int,
	  Active varchar(1) 
	) 

Insert into #LoadReportJson (JobServiceId,ServiceId,Active)
SELECT
    JSON_Value (c.value, '$.JobServiceId') as JobServiceId, 
	JSON_Value (c.value, '$.ServiceId') as ServiceId, 
	JSON_Value (c.value, '$.Active') as Active  
FROM OPENJSON ( @JobServicesJson , '$.JobServices') as c 
 
  
DECLARE GetJobServiceIdCur CURSOR READ_ONLY
    FOR
    SELECT JobServiceId,ServiceId,Active
	from #LoadReportJson  

    OPEN GetJobServiceIdCur
    FETCH NEXT FROM GetJobServiceIdCur INTO
    @JobServiceId, @ServiceId, @JActive
    WHILE @@FETCH_STATUS = 0
		BEGIN
		 	MERGE [dbo].[JobServices] AS [target]
			USING (
				SELECT @JobServiceId
				) AS source(JobServiceId)
				ON ([target].[JobServiceId] = [source].[JobServiceId] )
			WHEN MATCHED
				THEN 
					UPDATE
					SET Active = @JActive
			WHEN NOT MATCHED BY TARGET  
					THEN
						INSERT (  
						 JobId
						,ServiceId
						,Active
						,CreatedBy
							)
						VALUES ( 
						 @JobId
						,@ServiceId  
						,@JActive
						,@UserId
							)
						; 
		FETCH NEXT FROM GetJobServiceIdCur INTO	@JobServiceId,@ServiceId,@JActive
		END
    CLOSE GetJobServiceIdCur
    DEALLOCATE GetJobServiceIdCur
 ---- Process End Report Service------				
 ---- Process Start Equipment ------
	DECLARE @JobEquipmentId int, @EquipmentId int, @EJServiceId int, @EStatusId int, @EActive varchar(1)
	Declare @DRCount int ,@DNCount int, @INCount int

	DROP TABLE IF EXISTS #LoadEquipmentJson

	CREATE TABLE #LoadEquipmentJson
	(
		LoaderId int not null identity(1,1),
		JobEquipmentId Bigint, 
		EquipmentId Bigint,
		Active Varchar(1) 
	) 
Select @EStatusId = dbo.GetStatusId(1,'JobProcessStatus','NS') 
Insert into #LoadEquipmentJson (JobEquipmentId,EquipmentId,Active)
SELECT
    JSON_Value (c.value, '$.JobEquipmentId') as JobEquipmentId, 
	JSON_Value (c.value, '$.EquipmentId') as EquipmentId ,
	JSON_Value (c.value, '$.Active') as Active 
FROM OPENJSON ( @JobEquipmentsJson , '$.JobEquipments') as c 
 
 set @AnalystId = case when @AnalystId = 0 then null else @AnalystId end 
  
DECLARE GetJobEquipmentIdCur CURSOR READ_ONLY
    FOR
    SELECT j.JobEquipmentId,j.EquipmentId,s.ServiceId, j.Active 
	from #LoadEquipmentJson  j cross join #LoadReportJson s 
	where s.Active = 'Y'
 
    OPEN GetJobEquipmentIdCur
    FETCH NEXT FROM GetJobEquipmentIdCur INTO
    @JobEquipmentId, @EquipmentId,@EJServiceId, @EActive 
    WHILE @@FETCH_STATUS = 0
		BEGIN  
		      select @DRCount = count(*) from EquipmentDriveUnit du join DriveServices dr   on dr.DriveUnitId = du.DriveUnitId   and ReportId = @EJServiceId  and dr.Active = 'Y'
					where du.EquipmentId = @EquipmentId
			  select @DNCount = count(*) from EquipmentDrivenUnit du join DrivenServices dr   on dr.DrivenUnitId = du.DrivenUnitId   and ReportId = @EJServiceId  and dr.Active = 'Y'
					where du.EquipmentId = @EquipmentId
			  select @INCount = count(*) from EquipmentIntermediateUnit du join IntermediateServices dr   on dr.IntermediateUnitId = du.IntermediateUnitId   and ReportId = @EJServiceId  and dr.Active = 'Y'
					where du.EquipmentId = @EquipmentId 
			if (isnull(@DRCount,0) + isnull(@DNCount,0) + isnull (@INCount,0) ) > 0
			Begin
		 		MERGE [dbo].[JobEquipment] AS [target]
				USING (
					SELECT @JobId, @EquipmentId, @EJServiceId
					) AS source(JobId, EquipmentId, EJServiceId)
					ON (
					[target].[JobId] = [source].[JobId] 
					and [target].[EquipmentId] = [source].[EquipmentId]
					and [target].[ServiceId] = [source].[EJServiceId]          
					)
				WHEN MATCHED THEN
					UPDATE SET Active = @EActive , AnalystId = @AnalystId
 				WHEN NOT MATCHED BY TARGET
						THEN
							INSERT (  
							 JobId
							,EquipmentId
							,ServiceId
							,StatusId
							,AnalystId
							,Active
							,CreatedBy
							,DataCollectionDate
								)
							VALUES (  
							 @JobId
							,@EquipmentId 
							,@EJServiceid
							,@EStatusId
							,@AnalystId
							,@EActive
							,@UserId
							,@EststartDate
								)
							;
		End
		FETCH NEXT FROM GetJobEquipmentIdCur INTO	@JobEquipmentId, @EquipmentId, @EJServiceid, @EActive
		END
    CLOSE GetJobEquipmentIdCur
    DEALLOCATE GetJobEquipmentIdCur
 ---- Process End Equipment ------ 
	
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
-- Commit Transaction
--
IF @@TRANCOUNT>0 COMMIT TRANSACTION
GO

--
-- Set NOEXEC to off
--
SET NOEXEC OFF
GO
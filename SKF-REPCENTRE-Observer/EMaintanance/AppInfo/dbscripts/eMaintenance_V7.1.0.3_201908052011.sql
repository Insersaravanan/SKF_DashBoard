 
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
-- Alter procedure [dbo].[EAppSaveAssignUser]
--
GO
 
 
CREATE OR ALTER PROCEDURE [dbo].[EAppSaveAssignUser]
	 @Type Varchar(30)
	,@Id Bigint  
	,@DataCollectionMode int
	,@DataCollectorId int
	,@AnalystId int 
	,@ReviewerId int
AS
BEGIN
	BEGIN TRANSACTION
	BEGIN TRY
	Declare @JobId bigint
		Select @DataCollectorId = case when @DataCollectorId = 0 then null else @DataCollectorId End ,
		@AnalystId = case when @AnalystId = 0 then null else @AnalystId End ,
		@ReviewerId = case when @ReviewerId = 0 then null else @ReviewerId End
		
		If @Type = 'Job'
		Begin
			MERGE [dbo].[Jobs] AS [target] 
			USING (
				SELECT @Id 
				) AS source(JobId)
				ON ([target].[JobId] = [source].[JobId])
			WHEN MATCHED
				THEN 
					UPDATE 
					SET   
					 DataCollectorId = isnull(@DataCollectorId,DataCollectorId)
					 ,DataCollectionMode = isnull(@DataCollectionMode,DataCollectionMode)
					 ,AnalystId = isnull(@AnalystId,AnalystId)
					 ,ReviewerId = isnull(@ReviewerId,ReviewerId)
					 ,DataCollectionDone = case when isnull(@DataCollectionMode,0) = 1 then 'Y' else DataCollectionDone end
					 ;
			Update JobEquipment set DatacollectionDone = case when isnull(@DataCollectionMode,0) = 1 then 1 else DataCollectionDone end,
			DataCollectorId = case when isnull(@DataCollectionMode,0) = 1 then null else DataCollectorId end	where jobid = @Id 
			Update JobEquipment set AnalystId = @AnalystId where jobid = @Id and AnalystId  is null
			Update JobEquipment set DataCollectorId = @DataCollectorId where jobid = @Id and DataCollectorId  is null 
			Update JobEquipment set ReviewerId = @ReviewerId where jobid = @Id and ReviewerId  is null 
		End
		Else If @Type = 'Equipment'
		Begin
			MERGE [dbo].[JobEquipment] AS [target] 
			USING (
				SELECT @Id 
				) AS source(JobEquipmentId)
				ON ([target].[JobEquipmentId] = [source].[JobEquipmentId])
			WHEN MATCHED
				THEN 
					UPDATE 
					SET     
					 DataCollectorId = isnull(@DataCollectorId,DataCollectorId)
					 ,AnalystId = isnull(@AnalystId,AnalystId)
					 ,ReviewerId = isnull(@ReviewerId,ReviewerId)
					 ,DataCollectionDone = case when isnull(@DataCollectionMode,0) = 1 then 1 else DataCollectionDone end
					 ;
				select @JobId = JobId from JobEquipment where JobEquipmentId =@Id;
				if isnull(@JobId,0) > 0
				Begin
					update jobs set DataCollectorId = isnull(DataCollectorId,@DataCollectorId),
								AnalystId = isnull(AnalystId,@AnalystId),
								ReviewerId = isnull(ReviewerId, @ReviewerId),
								DataCollectionMode = isnull(@DataCollectionMode,DataCollectionMode)
								,DataCollectionDone = case when isnull(@DataCollectionMode,0) = 1 then 'Y' else DataCollectionDone end
					where JobId = @JobId	
					  
				End

		End

	
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
-- Alter procedure [dbo].[EAppListJobDiagnosis]
--
GO

CREATE OR ALTER PROCEDURE [dbo].[EAppListJobDiagnosis]
	@ClientSiteId int,
	@UserId int,
	@JobId Bigint,
	@ScheduleSetupId Bigint,
	@LanguageId int,  
	@StatusId int,
	@FromDate Date,
	@ToDate Date,
	@JobNumber varchar(50)
AS  
BEGIN  
	Declare @VAId int, @OAId int, @SUStatusId int
	Select @VAId = dbo.GetStatusId(1,'ReportType','VA'),  @OAId = dbo.GetStatusId(1,'ReportType','OA'), @SUStatusId = dbo.GetStatusId(1,'JobProcessStatus','SU')
	Select j.JobId, j.JobName, j.JobNumber, j.EstStartDate, j.EstEndDate, j.ActStartDate, j.ActEndDate,j.AnalystId,(select UserName from Users where UserId = j.AnalystId) AnalystName, j.ScheduleSetupId, j.ClientSiteId, j.StatusId, 
	isnull(dbo.GetNameTranslated(j.StatusId,@LanguageId,'LookupValue'),'') StatusName,
	isnull(dbo.GetNameTranslated(j.StatusId,@LanguageId,'LookupCode'),'') StatusCode,
	j.ReviewerId,
	dbo.GetLookupTranslated(dbo.GetStatusId(@LanguageId,'ReportStatusLegend',dbo.GetLookupTranslated(j.StatusId,@LanguageId,'LookupCode')),@LanguageId,'LookupValue')  StatusColour,
	j.DataCollectionDate, j.ReportDate, isnull(dbo.CheckJobStatus(j.StatusId),0) as IsEditable,
	case when j.StatusId = isnull(@SUStatusId,0)  and j.ReviewerId = @UserId then 1 else 0 end JobReportEditable,
	getdate() as ReportingDate,
	@VAId as VAServiceId, @OAId as OAServiceId,
	dbo.GetJobStatusColour(j.JobId,@VAId,j.EstStartDate,@LanguageId,@UserId) as VAStatusColour, 
	dbo.GetJobStatusColour(j.JobId,@OAId,j.EstStartDate,@LanguageId,@UserId) as OAStatusColour,
	dbo.GetJobEquipCount(j.JobId,@VAId,@LanguageId,@UserId)as VACount,
	dbo.GetJobEquipCount(j.JobId,@OAId,@LanguageId,@UserId)as OACount,
	dbo.GetJobProcessPct(j.JobId,null,@LanguageId,@UserId)as StatusPercent,	
	dbo.GetJobToolTip(j.JobId,@VAId,@LanguageId,@UserId)as VAToolTip,
	dbo.GetJobToolTip(j.JobId,@OAId,@LanguageId,@UserId)as OAToolTip,
	DataCollectionMode,
	cast(case when isnull(j.DataCollectionMode,0) = 1 then 1
	when  isnull(DataCollectionMode,0) = 0 
	then 
	case when j.DataCollectorId = @UserId then
		case when (select case when Count(JobEquipmentId) = 0 then 999.999 when Count(JobEquipmentId) - sum(isnull(DataCollectionDone,0)) = 0 then 1 else 0 end  
		from JobEquipment where jobid = j.jobid and  DataCollectorId = @UserId and active = 'Y')  = 0 then 0 else 1 end
	when j.AnalystId = @UserId then
		case when (select case when Count(JobEquipmentId) = 0 then 999.999 when Count(JobEquipmentId) - sum(isnull(DataCollectionDone,0)) = 0 then 1 else 0 end  
		from JobEquipment where jobid = j.jobid and  AnalystId = @UserId and active = 'Y')  = 0 then 0 else 1 end
	when j.ReviewerId = @UserId then
		case when (select case when Count(JobEquipmentId) = 0 then 999.999 when Count(JobEquipmentId) - sum(isnull(DataCollectionDone,0)) = 0 then 1 else 0 end  
		from JobEquipment where jobid = j.jobid and  ReviewerId = @UserId and active = 'Y')  = 0 then 0 else 1 end
 	end 
	end as int) DataCollectionDone,
	ReportSent,
 	case 
	when  isnull(DataCollectionMode,0) = 1  and isnull(j.AnalystId,0) = 0 and isnull(j.ReviewerId,0) = 0 then 'Not Started'
	when  isnull(DataCollectionMode,0) = 1  and isnull(j.AnalystId,0) > 0 and isnull(j.ReviewerId,0) > 0 then 'Done'
	when  isnull(DataCollectionMode,0) = 1 and ( isnull(j.AnalystId,0) > 0 or isnull(j.ReviewerId,0) > 0) then 'In Progress'
	when  (isnull(DataCollectionMode,0) = 0  and isnull(j.DataCollectorId,0) > 0) and isnull(j.AnalystId,0) > 0 and isnull(j.ReviewerId,0) > 0 then 'Done'
	when  (isnull(DataCollectionMode,0) = 0  and isnull(j.DataCollectorId,0) = 0) and isnull(j.AnalystId,0) = 0 and isnull(j.ReviewerId,0) = 0 then 'Not Started'
	when  (isnull(DataCollectionMode,0) = 0  and isnull(j.DataCollectorId,0) > 0) or isnull(j.AnalystId,0) > 0 or isnull(j.ReviewerId,0) > 0 then 'In Progress'
	end Assignment,
	(select isnull(js.JobServiceId,0) as JobServiceId,isnull(js.JobId,@JobId) JobId, isnull(js.ServiceId,l.LookupId)as ServiceId, isnull(l.LookupCode,l.LookupCode)as ServiceCode, Isnull(l.LookupName,l.LookupName) as ServiceName,isnull(js.Active,'N')as Active
	from JobServices js	
	right join (select lookupid,LookupCode,dbo.GetNameTranslated(lookupid,@LanguageId,'LookupValue')LookupName,ListOrder from lookups where Lname ='ReportType')  l on js.ServiceId = l.LookupId
	and  js.JobId = j.JobId 
	FOR JSON AUTO 
	) JobServices,
	dbo.GetDCUpdateCheck(j.JobId,@UserId) as IsDCDoneAllowed,
	dbo.GetRSUpdateCheck(j.JobId,@UserId) as IsReportSentAllowed
 from  Jobs j  where  j.EstStartDate between @FromDate and isnull(@ToDate,getdate()+90) 
 and j.ClientSiteId = @ClientSiteId and j.JobNumber = isnull(@JobNumber,j.JobNumber)  and j.Active = 'Y'
  and exists (select 'x' from JobEquipment where JobId = j.JobId and (DataCollectorId =  @UserId or AnalystId = @UserId or ReviewerId = @UserId))
  order by j.EstStartDate desc, j.JobNumber desc  
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
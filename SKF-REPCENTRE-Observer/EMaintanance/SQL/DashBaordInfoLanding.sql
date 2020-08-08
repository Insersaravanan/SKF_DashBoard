--Stoted Procedure for Dashboard landing page Initial details
CREATE PROCEDURE [dbo].[DashBoardInfoHome]
(
@ClientID nvarchar(50)
)
AS
BEGIN
SELECT (SELECT count(*) as TotalLocations FROM location where clientid=@ClientID) AS TotalLocations, 
(SELECT count(*) as TotalMachines FROM MachineMainds  where customerid=@ClientID) AS TotalMachines, 
(SELECT (SELECT count(*) FROM Machinedriveds WHERE Customerid=@ClientID) + (SELECT count(*) FROM MachineInterds WHERE Customerid=@ClientID) + (SELECT count(*) FROM MachineDrivenEndds WHERE Customerid=@ClientID))  AS TotalAssets,
(SELECT TOP 1 CONVERT(VARCHAR(10), ScheduleDate, 103) as LastSurveyDate FROM JobList where clientid=@ClientID ORDER BY ScheduleDate DESC) as LastSurveyDate,
(SELECT TOP 1 CONVERT(VARCHAR(10), VerifiedDate, 103) as LastCompletedReportDate FROM VibrationMaster  where clientid=@ClientID ORDER BY VerifiedDate DESC) as LastCompletedReportDate,
(SELECT TOP 1 CONVERT(VARCHAR(10), Workorderdate, 103) as LastWorknotificationDate FROM WorkNotificationJobMaster   where clientid=@ClientID ORDER BY Workorderdate DESC) as LastWorknotificationDate

END

GO
------------------------------------------------------------------------------------------------------------------
--Stoted Procedure for Dashboard landing page Saving Total Revenue Cost  details
CREATE PROCEDURE [dbo].[DashBoardSavingRevenueCost]
(
@ClientID nvarchar(50)
)
AS
BEGIN
--To find the State Date and End Date for displaying the Dash Board Cost and Hours value
 Declare @StartDate nvarchar(10);
 Declare @EndDate nvarchar(10);
 SET @StartDate=(SELECT CONVERT(VARCHAR(10), DATEADD(Year,-1,GETDATE()), 120));
 SET @EndDate=(SELECT CONVERT(VARCHAR(10), GETDATE()+1, 120));
 
SELECT (SELECT SUM(RiskAvoidanceRevenue)  FROM dbo.WorkNotificationJobMaster WHERE ClientID=@ClientID AND Workorderdate BETWEEN @StartDate AND @EndDate)+(SELECT SUM(RiskAvoidanceRevenue) FROM dbo.WNSavingsCalMaster WHERE ClientID=@ClientID AND WorkorderClosedDate  BETWEEN @StartDate AND @EndDate) AS RiskAvoidanceCost,
(SELECT SUM(total_cost) FROM PlanMaintenance WHERE customerid=@ClientID AND completion_date BETWEEN @StartDate AND @EndDate) AS TrueSavingsCost,
(SELECT SUM(EnergySavings) FROM dbo.WNSavingsCalMaster WHERE ClientID=@ClientID AND WorkorderClosedDate BETWEEN @StartDate AND @EndDate) AS EnergySavingCost,
(SELECT SUM(Savings) FROM EquipmentSavings WHERE CustomerID=@ClientID AND DateOfReport BETWEEN @StartDate AND @EndDate) AS  TechUpgradeCost,
(SELECT SUM(avoidancecost) FROM fault_report  WHERE CustomerID=@ClientID AND date_of_report  BETWEEN @StartDate AND @EndDate) AS UnexpectedBreakdownCost

END

GO
------------------------------------------------------------------------------------------------------------------
--Stoted Procedure for Dashboard landing page Saving Total Hours details
CREATE PROCEDURE [dbo].[DashBoardSavingHours]
(
@ClientID nvarchar(50)
)
AS
BEGIN
--To find the State Date and End Date for displaying the Dash Board Cost and Hours value
 Declare @StartDate nvarchar(10);
 Declare @EndDate nvarchar(10);
 SET @StartDate=(SELECT CONVERT(VARCHAR(10), DATEADD(Year,-1,GETDATE()), 120));
 SET @EndDate=(SELECT CONVERT(VARCHAR(10), GETDATE()+1, 120));
 
SELECT (SELECT SUM(RiskAvoidanceHours)  FROM dbo.WorkNotificationJobMaster WHERE ClientID=@ClientID AND Workorderdate BETWEEN @StartDate AND @EndDate)+(SELECT SUM(RiskAvoidanceHours) FROM dbo.WNSavingsCalMaster WHERE ClientID=@ClientID AND WorkorderClosedDate  BETWEEN @StartDate AND @EndDate) AS RiskAvoidanceHours,
(SELECT SUM(total_outagetime) FROM PlanMaintenance WHERE customerid=@ClientID AND completion_date BETWEEN @StartDate AND @EndDate) AS TrueSavingsHours,
(SELECT '0.00') AS EnergySavingHours,
(SELECT '0.00') AS  TechUpgradeHours,
(SELECT SUM(actual_outagetime) FROM fault_report  WHERE CustomerID=@ClientID AND date_of_report  BETWEEN @StartDate AND @EndDate) AS UnexpectedBreakdownHours

END

GO
-------------------------------------------------------------------------------------------------------------------
--Stored Procedure for display the customer logo and plant image 
CREATE PROCEDURE [dbo].[DashBoardCustomerLogoAndPlantImage]
(
@ClientID nvarchar(50)
)
AS
BEGIN
--Display the customer logo on the dashboard top let cornet
SELECT [Logo] FROM [dbo].[new_customer]  WHERE customerid=@ClientID
--Display the customer plant image on the dashboard top right cornet
SELECT [PlantImage] FROM [dbo].[HyperfaceView]  WHERE customerid=@ClientID
END
-------------------------------------------------------------------------------------------------------------------
SELECT [location],MachineMainUniqueID,MachineSortOrder,MachineStatus FROM [dbo].MachineMainds  WHERE customerid='WAYNE TEST'
SELECT  TOP 1 (VM.Report_Day+'-'+VM.Report_Month+'-'+VM.Report_Year) AS LastSurveyDate,CC.ClientDescription AS ConditionCode FROM VibrationMaster VM LEFT JOIN ConditionCode CC ON VM.ConditionCode=CC.SKFCode WHERE VM.clientid='WAYNE TEST' AND VM.PlantSection='RAW COAL' and VM.MachineID='PP111' AND VM.ConditionCode=CC.SKFCode

using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;


namespace EMaintanance.Repository
{
    public class ObserverDashboardRepo
    {
        private readonly Utility util;
        public ObserverDashboardRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetFilterListByType(int UserId, string Type, int Id)
        {
            string sql = "dbo.OAppListClientFilter";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        UserId,
                        Type,
                        Id

                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetSensorReading(string Type, int UnitSensorId)
        {
            string sql = "dbo.OAppSensorReading ";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        Type,
                        UnitSensorId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetRoleIDByUserID(int userId)
        {
            string sql = "dbo.OAppGetRoleID";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        userId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }


        public async Task<IEnumerable<dynamic>> GetDashboardDetails([FromBody] ObserverDashboardViewModel obdvm)
        {
            string sql = "dbo.OAppListAssetStatusTest";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new {
                        obdvm.Type,
                        obdvm.UserId,
                        obdvm.CountryId,
                        obdvm.ClientSiteId,
                        obdvm.AreaId,
                        obdvm.PlantAreaId,
                        obdvm.EquipmentId,
                        obdvm.UnitType,
                        obdvm.UnitId

                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetEquipmentConditionHistory(int EquipmentId)
        {
            string sql = "dbo.OAppDBEquipmentConditionHistory";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        EquipmentId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }


        public async Task<IEnumerable<dynamic>> GetAssetConditionHistory(string UnitType, int UnitId)
        {
            string sql = "dbo.OAppDBAssetConditionHistory";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        UnitType,
                        UnitId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetFailureCauseSegmentWise(int? CountryId, int? ClientSiteId, int UserId, int? PlantAreaId)
        {
            string sql = "dbo.OAppDBSegmentByFailureCauses";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        UserId,
                        CountryId,
                        ClientSiteId,
                        PlantAreaId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetSegmentByCustomer(int? CountryId, int? UserId)
        {
            string sql = "dbo.OAppDBSegmentByCustomer";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        UserId,
                        CountryId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

     
        public async Task<IEnumerable<dynamic>> GetAssetClassBySegmentWise(int? CountryId, int? ClientSiteId, int UserId)
        {
            string sql = "dbo.OAppDBAssetClassSegmentWise";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                         UserId,
                        CountryId,
                        ClientSiteId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetEMaintEquipmentPriority([FromBody] ObserverEMaintEquipmentPriorityViewModel obdvm)
        {
            string sql = "dbo.OAppDBWorkPriority";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        obdvm.UserId,
                        obdvm.CountryId,
                        obdvm.ClientSiteId,
                        obdvm.PlantAreaId,
                        obdvm.EquipmentId,
                        obdvm.UnitType,
                        obdvm.UnitId

                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetEMaintJobReport(int ClientSiteId)
        {
            string sql = "dbo.OAppListDBEmaintJobReport";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        ClientSiteId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetListEquipmentPriority([FromBody] ListEMaintEquipmentPriorityViewModel lepvm)
        {
            string sql = "dbo.OAppDBWorkPriorityDetail";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        lepvm.UserId,
                        lepvm.CountryId,
                        lepvm.ClientSiteId,
                        lepvm.PlantAreaId,
                        lepvm.EquipmentId,
                        lepvm.UnitType,
                        lepvm.UnitId,
                        lepvm.PriorityId

                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetListEquipmentHealth([FromBody] ListEMaintEquipmentHealthViewModel lehvm)
        {
            string sql = "dbo.OAppDBEquipmentListByCondition";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        lehvm.UserId,
                        lehvm.CountryId,
                        lehvm.ClientSiteId,
                        lehvm.PlantAreaId,
                        lehvm.ConditionId

                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetSegmentByCustomerDetail([FromBody] ListEMaintSectorByCustomerViewModel lehvm)
        {
            string sql = "dbo.OAppDBSegmentByCustomerDetail";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        lehvm.SectorId

                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetSegmentiDByFailureCausesDetail([FromBody] ListEMaintSectorByCustomerViewModel lehvm)
        {
            string sql = "dbo.OAppDBSegmentByFailureCausesDetail";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        lehvm.SectorId

                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }


        public async Task<IEnumerable<dynamic>> GetAssetClassByAssetDetail([FromBody] ListEMaintAssetClassByAssetIDViewModel lehvm)
        {
            string sql = "dbo.OAppDBAssetClassDetailsByAssetID";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        lehvm.AssetName

                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetSegmentByFailureCausesDetail([FromBody] ListEMaintSectorByFailureCauseViewModel lefvm)
        {
            string sql = "dbo.OAppDBSegmentByFailureCausesDetail";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        lefvm.SectorId

                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }


        public async Task<dynamic> GetDBs()
        {
            string sql = "SELECT database_id as Id, name as Name FROM sys.databases where name like('RMS%%AO');";
            using (var conn = util.MasterCon())
            {
                return await conn.QueryAsync<dynamic>(sql);
            }
        }

        public async Task<dynamic> GetClientGroups(int accId)
        {
            using (var conn = util.MasterCon())
            {
                string accSql = "SELECT name FROM sys.databases where database_id = " + accId + ";";
                string DBName = await conn.QueryFirstOrDefaultAsync<string>(accSql);

                string sql = "USE " + DBName + "; select IDNode, NodeType, TreeType, NodeName, NodeStatus from node where IDParent = 0 order by SortOrderId Asc;";
                return await conn.QueryAsync<dynamic>(sql);
            }
        }

        public async Task<dynamic> GetClients(int accId, int ParentId = 0)
        {
            using (var conn = util.MasterCon())
            {
                string accSql = "SELECT name FROM sys.databases where database_id = " + accId + ";";
                string DBName = await conn.QueryFirstOrDefaultAsync<string>(accSql);

                string sql = "USE " + DBName + "; WITH Hierarchy AS (SELECT 1 AS [Level], [IDNode],[NodeName] AS [GrandParent], [NodeName], [IDParent] , [NodeType], [TreeType], [SortOrderId]"
                 + " FROM Node WHERE[IdParent] = " + ParentId + " UNION ALL"
                 + " SELECT cycle.[Level] + 1, base.[IdNode], cycle.[GrandParent], base.[NodeName], base.[IDParent], base.[NodeType], base.[TreeType], base.[SortOrderId]"
                 + " FROM Node base INNER JOIN Hierarchy cycle ON cycle.[IDNode] = base.[IDParent])"
                 + " SELECT nodes.[IDNode], nodes.[IDParent], nodes.[NodeName],"
                 + "COALESCE(NULLIF(nodes.[GrandParent], nodes.[NodeName])+'-->'+nodes.[NodeName], nodes.[NodeName]) AS[ClientNodeSensor],"
                 + "nodes.[NodeType], (select NodePath from dbo.GetSubNodes(nodes.[IDNode]) where IDNode = nodes.[IDNode]) as NodePath"
                 + " FROM Hierarchy nodes where NodeType = 0 Order By IDParent, SortOrderId ASC";

                return await conn.QueryAsync<dynamic>(sql);
            }
        }

        public async Task<dynamic> GetAssetsForClient(int accId, int ParentId = 0)
        {
            using (var conn = util.MasterCon())
            {
                string accSql = "SELECT name FROM sys.databases where database_id = " + accId + ";";
                string DBName = await conn.QueryFirstOrDefaultAsync<string>(accSql);

                string sql = "USE " + DBName + "; WITH Hierarchy AS (SELECT 1 AS [Level], [IDNode],[NodeName] AS [GrandParent], [NodeName], [IDParent] , [NodeType], [TreeType], [SortOrderId]"
             + " FROM Node WHERE[IdParent] = " + ParentId + " UNION ALL"
             + " SELECT cycle.[Level] + 1, base.[IdNode], cycle.[GrandParent], base.[NodeName], base.[IDParent], base.[NodeType], base.[TreeType], base.[SortOrderId]"
             + " FROM Node base INNER JOIN Hierarchy cycle ON cycle.[IDNode] = base.[IDParent])"
             + " SELECT nodes.[IDNode], nodes.[IDParent], nodes.[NodeName],"
             + "COALESCE(NULLIF(nodes.[GrandParent], nodes.[NodeName])+'-->'+nodes.[NodeName], nodes.[NodeName]) AS[ClientNodeSensor],"
             + "nodes.[NodeType], (select NodePath from dbo.GetSubNodes(nodes.[IDNode]) where IDNode = nodes.[IDNode]) as NodePath"
             + " FROM Hierarchy nodes where NodeType < 3 and NodeType > 0 Order By IDParent, SortOrderId ASC";

                return await conn.QueryAsync<dynamic>(sql);
            }
        }

        public async Task<dynamic> GetSensorNodeForAssets(int accId, int ParentId = 0)
        {
            using (var conn = util.MasterCon())
            {
                string accSql = "SELECT name FROM sys.databases where database_id = " + accId + ";";
                string DBName = await conn.QueryFirstOrDefaultAsync<string>(accSql);

                string sql = "USE " + DBName + "; WITH Hierarchy AS (SELECT 1 AS [Level], [IDNode],[NodeName] AS [GrandParent], [NodeName], [IDParent] , [NodeType], [TreeType], [SortOrderId]"
             + " FROM Node WHERE[IdParent] = " + ParentId + " UNION ALL"
             + " SELECT cycle.[Level] + 1, base.[IdNode], cycle.[GrandParent], base.[NodeName], base.[IDParent], base.[NodeType], base.[TreeType], base.[SortOrderId]"
             + " FROM Node base INNER JOIN Hierarchy cycle ON cycle.[IDNode] = base.[IDParent])"
             + " SELECT nodes.[IDNode], nodes.[IDParent], nodes.[NodeName],"
             + "COALESCE(NULLIF(nodes.[GrandParent], nodes.[NodeName])+'-->'+nodes.[NodeName], nodes.[NodeName]) AS[ClientNodeSensor],"
             + "nodes.[NodeType], (select NodePath from dbo.GetSubNodes(nodes.[IDNode]) where IDNode = nodes.[IDNode]) as NodePath"
             + " FROM Hierarchy nodes where NodeType> 3 Order By IDParent, SortOrderId ASC";

                return await conn.QueryAsync<dynamic>(sql);
            }
        }

        public async Task<dynamic> GetTrendMOMMultiple(int accId, int NodeId)
        {
            using (var conn = util.MasterCon())
            {
                string accSql = "SELECT name FROM sys.databases where database_id = " + accId + ";";
                string DBName = await conn.QueryFirstOrDefaultAsync<string>(accSql);

                string sql = "USE " + DBName + "; exec dbo.TrendMomMultipleFromBinary " + NodeId + ",5;";

                return await conn.QueryAsync<dynamic>(sql);
            }
        }

        public async Task<dynamic> GetTrendMultiple(int accId, int NodeId)
        {
            try
            {
                using (var conn = util.MasterCon())
                {
                    string accSql = "SELECT name FROM sys.databases where database_id = " + accId + ";";
                    string DBName = await conn.QueryFirstOrDefaultAsync<string>(accSql);

                    string sql1 = "USE " + DBName + "; SELECT count(*) as cnt from TrendSingle where IDPoint = " + NodeId + ";";

                    string sql = "";

                    if (conn.ExecuteScalar<int>(sql1) > 0)
                    {
                        sql = "USE " + DBName + "; SELECT TOP 1000 DATEDIFF(s,'1969-12-31 18:30:00',ReadingTime) as x," +
                            " Amp as y, 'Others' as Type FROM TrendSingle WHERE IDPoint= " + NodeId + " AND Amp>1 ORDER BY ReadingTime ASC;";
                    }
                    else
                    {
                        sql = "USE " + DBName + ";" +
                            "select DATEDIFF(s,'1969-12-31 18:30:00',ReadingTime) as x, CASE " +
                                " WHEN NumCh = 1 and NumValues = 5 THEN Ch1_F5Amp" +
                                " WHEN NumCh = 1 and NumValues = 4 THEN Ch1_F4Amp" +
                                " WHEN NumCh = 1 and NumValues = 3 THEN Ch1_F3Amp" +
                                " WHEN NumCh = 1 and NumValues = 2 THEN Ch1_F2Amp" +
                                " WHEN NumCh = 1 and NumValues = 1 THEN Ch1_F1Amp" +
                                " WHEN NumCh = 2 and NumValues = 5 THEN Ch2_F5Amp" +
                                " WHEN NumCh = 2 and NumValues = 4 THEN Ch2_F4Amp" +
                                " WHEN NumCh = 2 and NumValues = 3 THEN Ch2_F3Amp" +
                                " WHEN NumCh = 2 and NumValues = 2 THEN Ch2_F2Amp" +
                                " WHEN NumCh = 2 and NumValues = 1 THEN Ch2_F1Amp" +
                                " WHEN NumCh = 3 and NumValues = 5 THEN Ch3_F5Amp" +
                                " WHEN NumCh = 3 and NumValues = 4 THEN Ch3_F4Amp" +
                                " WHEN NumCh = 3 and NumValues = 3 THEN Ch3_F3Amp" +
                                " WHEN NumCh = 3 and NumValues = 2 THEN Ch3_F2Amp" +
                                " WHEN NumCh = 3 and NumValues = 1 THEN Ch3_F1Amp" +
                                " END AS y," +
                                //" CASE " +
                                //" WHEN NumCh = 1 and NumValues = 5 THEN Ch1_F5Alarm" +
                                //" WHEN NumCh = 1 and NumValues = 4 THEN Ch1_F4Alarm" +
                                //" WHEN NumCh = 1 and NumValues = 3 THEN Ch1_F3Alarm" +
                                //" WHEN NumCh = 1 and NumValues = 2 THEN Ch1_F2Alarm" +
                                //" WHEN NumCh = 1 and NumValues = 1 THEN Ch1_F1Alarm" +
                                //" WHEN NumCh = 2 and NumValues = 5 THEN Ch2_F5Alarm" +
                                //" WHEN NumCh = 2 and NumValues = 4 THEN Ch2_F4Alarm" +
                                //" WHEN NumCh = 2 and NumValues = 3 THEN Ch2_F3Alarm" +
                                //" WHEN NumCh = 2 and NumValues = 2 THEN Ch2_F2Alarm" +
                                //" WHEN NumCh = 2 and NumValues = 1 THEN Ch2_F1Alarm" +
                                //" WHEN NumCh = 3 and NumValues = 5 THEN Ch3_F5Alarm" +
                                //" WHEN NumCh = 3 and NumValues = 4 THEN Ch3_F4Alarm" +
                                //" WHEN NumCh = 3 and NumValues = 3 THEN Ch3_F3Alarm" +
                                //" WHEN NumCh = 3 and NumValues = 2 THEN Ch3_F2Alarm" +
                                //" WHEN NumCh = 3 and NumValues = 1 THEN Ch3_F1Alarm" +
                                //" END AS Alarm," +
                                //" CASE " +
                                //" WHEN NumCh = 1 and NumValues = 5 THEN Ch1_F5Warning" +
                                //" WHEN NumCh = 1 and NumValues = 4 THEN Ch1_F4Warning" +
                                //" WHEN NumCh = 1 and NumValues = 3 THEN Ch1_F3Warning" +
                                //" WHEN NumCh = 1 and NumValues = 2 THEN Ch1_F2Warning" +
                                //" WHEN NumCh = 1 and NumValues = 1 THEN Ch1_F1Warning" +
                                //" WHEN NumCh = 2 and NumValues = 5 THEN Ch2_F5Warning" +
                                //" WHEN NumCh = 2 and NumValues = 4 THEN Ch2_F4Warning" +
                                //" WHEN NumCh = 2 and NumValues = 3 THEN Ch2_F3Warning" +
                                //" WHEN NumCh = 2 and NumValues = 2 THEN Ch2_F2Warning" +
                                //" WHEN NumCh = 2 and NumValues = 1 THEN Ch2_F1Warning" +
                                //" WHEN NumCh = 3 and NumValues = 5 THEN Ch3_F5Warning" +
                                //" WHEN NumCh = 3 and NumValues = 4 THEN Ch3_F4Warning" +
                                //" WHEN NumCh = 3 and NumValues = 3 THEN Ch3_F3Warning" +
                                //" WHEN NumCh = 3 and NumValues = 2 THEN Ch3_F2Warning" +
                                //" WHEN NumCh = 3 and NumValues = 1 THEN Ch3_F1Warning" +
                                //" END AS Warning," +
                                //" CASE " +
                                //" WHEN NumCh = 1 and NumValues = 5 THEN Ch1_F5Status " +
                                //" WHEN NumCh = 1 and NumValues = 4 THEN Ch1_F4Status " +
                                //" WHEN NumCh = 1 and NumValues = 3 THEN Ch1_F3Status " +
                                //" WHEN NumCh = 1 and NumValues = 2 THEN Ch1_F2Status " +
                                //" WHEN NumCh = 1 and NumValues = 1 THEN Ch1_F1Status " +
                                //" WHEN NumCh = 2 and NumValues = 5 THEN Ch2_F5Status " +
                                //" WHEN NumCh = 2 and NumValues = 4 THEN Ch2_F4Status " +
                                //" WHEN NumCh = 2 and NumValues = 3 THEN Ch2_F3Status " +
                                //" WHEN NumCh = 2 and NumValues = 2 THEN Ch2_F2Status " +
                                //" WHEN NumCh = 2 and NumValues = 1 THEN Ch2_F1Status " +
                                //" WHEN NumCh = 3 and NumValues = 5 THEN Ch3_F5Status " +
                                //" WHEN NumCh = 3 and NumValues = 4 THEN Ch3_F4Status " +
                                //" WHEN NumCh = 3 and NumValues = 3 THEN Ch3_F3Status " +
                                //" WHEN NumCh = 3 and NumValues = 2 THEN Ch3_F2Status " +
                                //" WHEN NumCh = 3 and NumValues = 1 THEN Ch3_F1Status " +
                                //" END AS 'Status', " +
                                "'Vibration' as Type " +
                                " From TrendMultipleFromBinaryFunction (" + NodeId + ",null,null,1000,null)";
                    }

                    return await conn.QueryAsync<dynamic>(sql);
                }
            }
            catch (Exception ex)
            {
                throw new CustomException("Unable to Save Live Information, Please Contact Support!!!", "Error", true, ex);
            }

        }
        public async Task<dynamic> GetHistoryReports(int accId, int[] NodeId)
        {
            try
            {
                using (var conn = util.MasterCon())
                {
                    string accSql = "SELECT name FROM sys.databases where database_id = " + accId + ";";
                    string DBName = await conn.QueryFirstOrDefaultAsync<string>(accSql);

                    string sql1 = "USE " + DBName + "; SELECT count(*) as cnt from TrendSingle where IDPoint = " + NodeId + ";";

                    string sql = "";
                    string strStartDate = "2020-01-01";
                    string strEndDate = "2020-04-26";
                    if (conn.ExecuteScalar<int>(sql1) > 0)
                    {
                        sql = "USE " + DBName + "; SELECT TOP 1000 DATEDIFF(s,'1969-12-31 18:30:00',ReadingTime) as x," +
                            " Amp as y, 'Others' as Type FROM TrendSingle " +
                            " WHERE IDPoint IN ( " + String.Join(",", NodeId) + ") AND Amp>1 " +
                            " AND ReadingTime BETWEEN '" + strStartDate + "' AND '" + strEndDate + "' ORDER BY ReadingTime ASC;";
                    }
                    else
                    {
                        string SqlSelect, SqlFromWhere;

                        SqlSelect = "USE " + DBName + ";" +
                            "select DATEDIFF(s,'1969-12-31 18:30:00',ReadingTime) as x, CASE " +
                                " WHEN NumCh = 1 and NumValues = 5 THEN Ch1_F5Amp" +
                                " WHEN NumCh = 1 and NumValues = 4 THEN Ch1_F4Amp" +
                                " WHEN NumCh = 1 and NumValues = 3 THEN Ch1_F3Amp" +
                                " WHEN NumCh = 1 and NumValues = 2 THEN Ch1_F2Amp" +
                                " WHEN NumCh = 1 and NumValues = 1 THEN Ch1_F1Amp" +
                                " WHEN NumCh = 2 and NumValues = 5 THEN Ch2_F5Amp" +
                                " WHEN NumCh = 2 and NumValues = 4 THEN Ch2_F4Amp" +
                                " WHEN NumCh = 2 and NumValues = 3 THEN Ch2_F3Amp" +
                                " WHEN NumCh = 2 and NumValues = 2 THEN Ch2_F2Amp" +
                                " WHEN NumCh = 2 and NumValues = 1 THEN Ch2_F1Amp" +
                                " WHEN NumCh = 3 and NumValues = 5 THEN Ch3_F5Amp" +
                                " WHEN NumCh = 3 and NumValues = 4 THEN Ch3_F4Amp" +
                                " WHEN NumCh = 3 and NumValues = 3 THEN Ch3_F3Amp" +
                                " WHEN NumCh = 3 and NumValues = 2 THEN Ch3_F2Amp" +
                                " WHEN NumCh = 3 and NumValues = 1 THEN Ch3_F1Amp" +
                                " END AS y," +
                                //" CASE " +
                                //" WHEN NumCh = 1 and NumValues = 5 THEN Ch1_F5Alarm" +
                                //" WHEN NumCh = 1 and NumValues = 4 THEN Ch1_F4Alarm" +
                                //" WHEN NumCh = 1 and NumValues = 3 THEN Ch1_F3Alarm" +
                                //" WHEN NumCh = 1 and NumValues = 2 THEN Ch1_F2Alarm" +
                                //" WHEN NumCh = 1 and NumValues = 1 THEN Ch1_F1Alarm" +
                                //" WHEN NumCh = 2 and NumValues = 5 THEN Ch2_F5Alarm" +
                                //" WHEN NumCh = 2 and NumValues = 4 THEN Ch2_F4Alarm" +
                                //" WHEN NumCh = 2 and NumValues = 3 THEN Ch2_F3Alarm" +
                                //" WHEN NumCh = 2 and NumValues = 2 THEN Ch2_F2Alarm" +
                                //" WHEN NumCh = 2 and NumValues = 1 THEN Ch2_F1Alarm" +
                                //" WHEN NumCh = 3 and NumValues = 5 THEN Ch3_F5Alarm" +
                                //" WHEN NumCh = 3 and NumValues = 4 THEN Ch3_F4Alarm" +
                                //" WHEN NumCh = 3 and NumValues = 3 THEN Ch3_F3Alarm" +
                                //" WHEN NumCh = 3 and NumValues = 2 THEN Ch3_F2Alarm" +
                                //" WHEN NumCh = 3 and NumValues = 1 THEN Ch3_F1Alarm" +
                                //" END AS Alarm," +
                                //" CASE " +
                                //" WHEN NumCh = 1 and NumValues = 5 THEN Ch1_F5Warning" +
                                //" WHEN NumCh = 1 and NumValues = 4 THEN Ch1_F4Warning" +
                                //" WHEN NumCh = 1 and NumValues = 3 THEN Ch1_F3Warning" +
                                //" WHEN NumCh = 1 and NumValues = 2 THEN Ch1_F2Warning" +
                                //" WHEN NumCh = 1 and NumValues = 1 THEN Ch1_F1Warning" +
                                //" WHEN NumCh = 2 and NumValues = 5 THEN Ch2_F5Warning" +
                                //" WHEN NumCh = 2 and NumValues = 4 THEN Ch2_F4Warning" +
                                //" WHEN NumCh = 2 and NumValues = 3 THEN Ch2_F3Warning" +
                                //" WHEN NumCh = 2 and NumValues = 2 THEN Ch2_F2Warning" +
                                //" WHEN NumCh = 2 and NumValues = 1 THEN Ch2_F1Warning" +
                                //" WHEN NumCh = 3 and NumValues = 5 THEN Ch3_F5Warning" +
                                //" WHEN NumCh = 3 and NumValues = 4 THEN Ch3_F4Warning" +
                                //" WHEN NumCh = 3 and NumValues = 3 THEN Ch3_F3Warning" +
                                //" WHEN NumCh = 3 and NumValues = 2 THEN Ch3_F2Warning" +
                                //" WHEN NumCh = 3 and NumValues = 1 THEN Ch3_F1Warning" +
                                //" END AS Warning," +
                                //" CASE " +
                                //" WHEN NumCh = 1 and NumValues = 5 THEN Ch1_F5Status " +
                                //" WHEN NumCh = 1 and NumValues = 4 THEN Ch1_F4Status " +
                                //" WHEN NumCh = 1 and NumValues = 3 THEN Ch1_F3Status " +
                                //" WHEN NumCh = 1 and NumValues = 2 THEN Ch1_F2Status " +
                                //" WHEN NumCh = 1 and NumValues = 1 THEN Ch1_F1Status " +
                                //" WHEN NumCh = 2 and NumValues = 5 THEN Ch2_F5Status " +
                                //" WHEN NumCh = 2 and NumValues = 4 THEN Ch2_F4Status " +
                                //" WHEN NumCh = 2 and NumValues = 3 THEN Ch2_F3Status " +
                                //" WHEN NumCh = 2 and NumValues = 2 THEN Ch2_F2Status " +
                                //" WHEN NumCh = 2 and NumValues = 1 THEN Ch2_F1Status " +
                                //" WHEN NumCh = 3 and NumValues = 5 THEN Ch3_F5Status " +
                                //" WHEN NumCh = 3 and NumValues = 4 THEN Ch3_F4Status " +
                                //" WHEN NumCh = 3 and NumValues = 3 THEN Ch3_F3Status " +
                                //" WHEN NumCh = 3 and NumValues = 2 THEN Ch3_F2Status " +
                                //" WHEN NumCh = 3 and NumValues = 1 THEN Ch3_F1Status " +
                                //" END AS 'Status', " +
                                "'Vibration' as Type ";
                        foreach (int N in NodeId)
                        {

                            SqlFromWhere =
                                    " From TrendMultipleFromBinaryFunction (" + N + ",null,null,1000,null) " +
                                    " where ReadingTime BETWEEN '" + strStartDate + "' AND '" + strEndDate + "' ";
                            sql = sql + SqlSelect + SqlFromWhere + " UNION ALL ";

                        }
                        // sql =sql.TrimEnd(sql.Substring.Length,10)
                        sql = sql.Substring(sql.Length, 10);

                    }

                    return await conn.QueryAsync<dynamic>(sql);
                }
            }
            catch (Exception ex)
            {
                throw new CustomException("Unable to Save Live Information, Please Contact Support!!!", "Error", true, ex);
            }

        }


    }
}

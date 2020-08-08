using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class DashboardRepo
    {

        private readonly Utility util;
        readonly string JsonHeader = ""; // {\"ReportingServices\": removing this, since urgent delivery I am declaring as empty string.
        readonly string JsonFooter = ""; // } **** In Future we need to remove ****

        public DashboardRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetFaultReportByParam(DashboardReportViewModel drvm)
        {
            string sql = "";
            string sqlGroupByClause = " Group By ClientSiteId,ClientName,FaultCode Order by Faultcount Desc";
            string sqlWhereClause = " where ClientSiteId =" + drvm.ClientSiteId;

            if (drvm != null)
            {
                if ((drvm.ChartType == "pie" || drvm.ChartType == "bar") && drvm.WidgetCode == "WGT01")
                {
                    sql = "select top " + drvm.DataLimit + " ClientSiteId,ClientName,FaultCode,Count(*)as FaultCount from FaultReport ";

                }
                if (drvm.PlantName != null && drvm.PlantName != "ALL")
                {
                    string tempWhereClause = " and PlantName = '" + drvm.PlantName + "'";
                    sqlWhereClause = sqlWhereClause + tempWhereClause;
                }
                if (drvm.ChartType == "grid")
                {
                    sql = "select top " + drvm.DataLimit + " ClientSiteId,ClientName,PlantName,AssetName,FaultCode,Count(*) as FaultCount from FaultReport ";
                    sqlGroupByClause = " Group By ClientSiteId,ClientName,PlantName,AssetName,FaultCode Order by Faultcount Desc ";
                }
                if (drvm.ChartType == "viewmore")
                {
                    sql = "select ClientSiteId,ClientName,PlantName,MachineName,AssetName,FaultCode as FaultCount from FaultReport where ClientSiteId = " + drvm.ClientSiteId;
                }
                if (sql == "")
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, "Unable to prepare Query.");
                }
            }
            else
            {
                throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, "Unable to prepare Query.");
            }


            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql + sqlWhereClause + sqlGroupByClause));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetFaultReportDetail(int ClientSiteId)
        {
            string sql = "select ClientSiteId,ClientName,PlantName,MachineName,AssetName,FaultCode as FaultCount from FaultReport where ClientSiteId = " + ClientSiteId;

            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetPlantNameByClientSite(int ClientSiteId)
        {
            string sql = "select Distinct(PlantName) from FaultReport where ClientSiteId = " + ClientSiteId + " order by PlantName";

            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetFailureCauseDetail(FailureCauseReportDetail fcrd)
        {
            string sql = "dbo.[EAppHighchartsDemo]";
            var CountryJson = JsonHeader + JsonConvert.SerializeObject(fcrd.CountryId) + JsonFooter;
            var CostCentreJson = JsonHeader + JsonConvert.SerializeObject(fcrd.CostCentreId) + JsonFooter;
            var SectorJson = JsonHeader + JsonConvert.SerializeObject(fcrd.SectorId) + JsonFooter;
            var SegmentJson = JsonHeader + JsonConvert.SerializeObject(fcrd.SegmentId) + JsonFooter;
            var IndustryJson = JsonHeader + JsonConvert.SerializeObject(fcrd.IndustryId) + JsonFooter;
            var ClientSiteJson = JsonHeader + JsonConvert.SerializeObject(fcrd.ClientSiteId) + JsonFooter;
            var PlantAreaJson = JsonHeader + JsonConvert.SerializeObject(fcrd.PlantAreaId) + JsonFooter;

            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new {
                        fcrd.UserId,
                        fcrd.LanguageId,
                        CountryJson,
                        CostCentreJson,
                        SectorJson,
                        SegmentJson,
                        IndustryJson,
                        ClientSiteJson,
                        PlantAreaJson,
                        fcrd.ReportType

                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }
    }
}

using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using Newtonsoft.Json;


namespace EMaintanance.Repository
{
    public class HistoricalReportsRepo
    {
        private readonly Utility util;
        public HistoricalReportsRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> GetHistoricalReportsByStatus(int ClientSiteId, int PlantAreaId, int EquipmentId, int UnitId, string  SensorId, DateTime FromDate, DateTime? ToDate, string Status)
        {
            string ScheduleServicesJson = null;

            //if (ScheduleServices.Count > 0)
            //{
            //    string Header = "{\"ScheduleServices\": ";
            //    string Footer = "}";
            //    ScheduleServicesJson = Header + JsonConvert.SerializeObject(sv.ScheduleServices) + Footer;
            //}
            string text = SensorId;

            //String[] spearator = { "ObserverNodeId","ScheduleSetupId, ", "ObserverNodeName", "ScheduleServiceId", "Active" };
            //Int32 count = 2;

            //// using the method 
            //String[] strlist = text.Split(spearator, count,
            //       StringSplitOptions.RemoveEmptyEntries);
            string Sensorstr;
            string Sensorstr1;
            //foreach (String item in strlist)
            //{
            //   // Console.WriteLine(s);
            //    Sensorstr = item;
            //    Sensorstr1 = Sensorstr + ",";
            //}

            string s = SensorId;

            

            
            string stringString = SensorId;
            String separatortest;
            String separatortest1="";
            string[] stringSeparators = new string[] { "{\"ObserverNodeId\":" };
            string[] firstNames = stringString.Split(stringSeparators, StringSplitOptions.None);
            foreach (string firstName in firstNames)
            {
                separatortest =  firstName;
                string[] stringSeparators1 = new string[] { "ObserverNodeName" };
                string[] firstNames1 = separatortest.Split(stringSeparators1, StringSplitOptions.None);

                foreach (string firstName1 in firstNames1)
                {
                    separatortest = firstName1;
                    separatortest1 = separatortest + firstName1 + ",";
                }

               
               // string[] split = separatortest.Split('{','}');
               // string strsensorid1 = split[0].ToString();
                //foreach (string word in split)
                //{
                //    // textBox1.Text = word[0].ToString();
                //    Sensorstr = word[0].ToString();
                //    Sensorstr1 = Sensorstr + ",";
                //}

                //string[] stringSeparators1 = new string[] { "ObserverNodeName" };
                //string[] firstNames1 = separatortest.Split(stringSeparators1, StringSplitOptions.None);
                //foreach (string firstName1 in firstNames1)
                //{
                //    separatortest = firstName1;
                //    separatortest1 = separatortest + firstName1 + ",";

                //}

            }

            //listBox1.Items.Add(word);


            //char[] seperator = { ',', '}' };

            //string[] list = text.Split(seperator);

            //foreach (string item in list)
            //{

            //}

            //   string  Result = Sensorstr1();
            // string  Remove1 = Result.Substring(2, Result.Length); // Remove First { [
            // string  Remove2 = Remove1.SkipLast(Remove1.Length); // Remove Last ] }
            // string  split1 = Remove1.Split('},').ToString(); //Split By },
            //ScheduleServicesJson = Sensorstr1
            //   SensorId = Sensorstr1;
            //if (Sensorstr1 != null)
            //{
            //    string Header = "{\"ObserverNodeId\": ";
            //    string Footer = "}";
            //    ScheduleServicesJson = Header + JsonConvert.SerializeObject(Sensorstr1) + Footer;
            //}
            string sql = "dbo.OAppListHistoricalReports";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { ClientSiteId, PlantAreaId, EquipmentId, UnitId, SensorId, FromDate, ToDate, Status }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetEquipmentByPlant(int LanguageId, int plantId)
        {
            string sql = "SELECT DISTINCT EquipmentId,dbo.GetNameTranslated(EquipmentId," + LanguageId + ",'EquipmentName') as EquipmentName FROM EquipmentUnitSensor WHERE Active = 'Y' and PlantAreaId = " + plantId;
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

        public async Task<IEnumerable<dynamic>> GetHistoricalPlantByStatus(int LanguageId, int ClientSiteId)
        {
            string sql = "dbo.OAppListArea";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new { LanguageId, ClientSiteId}, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Data, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> GetHistoricalEquipmentByStatus(int LanguageId, int EquipmentId, int ClientSiteId, int RequestId, string Type, string Action, string Status)
        {
            string sql = "SELECT DISTINCT UnitId,dbo.ChangeToCamelCase(dbo.GetNameTranslated(UnitId,1,concat(unittype,'UnitName')))as UnitName FROM EquipmentUnitSensor WHERE Active = 'Y' and EquipmentId = " + EquipmentId;
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


        public async Task<IEnumerable<dynamic>> GetSensorByUnit(int LanguageId, int UnitId)
        {
            string sql = "SELECT DISTINCT ObserverNodeId,ObserverNodeName FROM EquipmentUnitSensor WHERE Active = 'Y' and UnitId = " + UnitId;
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


    }
}

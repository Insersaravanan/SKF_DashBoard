using Dapper;
using EMaintanance.Services;
using EMaintanance.Utils;
using EMaintanance.ViewModels;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.Repository
{
    public class ImagePlottingRepo
    {
        private readonly Utility util;

        public ImagePlottingRepo(IConfiguration configuration)
        {
            util = new Utility(configuration);
        }

        public async Task<IEnumerable<dynamic>> LoadPlottingDetail(ImagePlottingViewModel ipvm)
        {
            string sql = "dbo.EAppGetPlottingDetail";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        ipvm.PlotType,
                        ipvm.PlantAreaId,
                        ipvm.EquipmentId,
                        ipvm.UnitType,
                        ipvm.UnitId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Load Plotting Detail, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdate(ImagePlottingViewModel ipvm)
        {
            string sql = "dbo.EAppSaveSensorPlotting";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        ipvm.SensorPlotId,
                        ipvm.PlantAreaId,
                        ipvm.EquipmentId,
                        ipvm.UnitType,
                        ipvm.UnitId,
                        ipvm.UnitSensorId,
                        ipvm.PlotType,
                        ipvm.XPos,
                        ipvm.YPos,
                        ipvm.ImageWidth,
                        ipvm.ImageHeight,
                        ipvm.Active,
                        ipvm.UserId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> SaveOrUpdateAttachment(ImagePlottingAttachmentViewModel ipavm)
        {
            string sql = "dbo.EAppSavePlottingAttachment";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        ipavm.PlottingAttachId,
                        ipavm.PlantAreaId,
                        ipavm.EquipmentId,
                        ipavm.UnitType,
                        ipavm.UnitId,
                        ipavm.PlotType,
                        ipavm.FileName,
                        ipavm.LogicalName,
                        ipavm.PhysicalPath,
                        ipavm.Active,
                        ipavm.UserId

                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }

        public async Task<IEnumerable<dynamic>> DetetePlottingRAttachmentById(int AttachmentId, int PlottingId)
        {
            string sql = "dbo.EAppRemoveMapping";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        AttachmentId,
                        PlottingId
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }
        public async Task<IEnumerable<dynamic>> SavePlantGeoLocation(PlantGeoLocationViewModel pglvm)
        {
            string sql = "dbo.EAppSavePlantGeoLocation ";
            using (var conn = util.MasterCon())
            {
                try
                {
                    return await (conn.QueryAsync<dynamic>(sql, new
                    {
                        pglvm.PlantAreaId,
                        pglvm.LatPos,
                        pglvm.LongPos,
                    }, commandType: CommandType.StoredProcedure));
                }
                catch (Exception ex)
                {
                    throw new CustomException("Unable to Save Or Update, Please Contact Support!!!", "Error", true, ex);
                }
            }
        }
    }
}

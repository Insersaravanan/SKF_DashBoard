using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ImagePlottingViewModel
    {
        public int? SensorPlotId { get; set; }
        public int? PlantAreaId { get; set; }
        public int? EquipmentId { get; set; }
        public string UnitType { get; set; }
        public int? UnitId { get; set; }
        public int? UnitSensorId { get; set; }
        public string PlotType { get; set; }
        public string XPos { get; set; }
        public string YPos { get; set; }
        public int? ImageWidth { get; set; }
        public int? ImageHeight { get; set; }
        public string Active { get; set; }
        public int? UserId { get; set; }
    }

    public class RemoveMappingViewModel
    {
        public int AttachmentId { get; set; }
        public int PlottingId { get; set; }
    }

    public class PlantGeoLocationViewModel
    {
        public int PlantAreaId { get; set; }
        public decimal ?LatPos { get; set; }
        public decimal ?LongPos { get; set; }
    }
}

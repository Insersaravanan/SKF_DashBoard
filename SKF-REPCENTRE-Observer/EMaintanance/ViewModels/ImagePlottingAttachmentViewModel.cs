using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ImagePlottingAttachmentViewModel
    {

        public int? PlottingAttachId { get; set; }
        public int? PlantAreaId { get; set; }
        public int? EquipmentId { get; set; }
        public string UnitType { get; set; }
        public int? UnitId { get; set; }
        public string PlotType { get; set; }
        public string FileName { get; set; }
        public string LogicalName { get; set; }
        public string PhysicalPath { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }
    }
}

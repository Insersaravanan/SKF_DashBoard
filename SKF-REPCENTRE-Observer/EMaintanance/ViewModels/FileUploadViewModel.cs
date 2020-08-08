using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class FileUploadViewModel
    {
        public String OriginalFileName { get; set; }
        public String LogicalFileName { get; set; }
        public String PhysicalFilePath { get; set; }
        public String FileFormat { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class LeverageExportSearchViewModel
    {
        public DateTime? LeverageFromDate { get; set; }
        public DateTime? LeverageToDate { get; set; }
        public DateTime? FileFromDate { get; set; }
        public DateTime? FileToDate { get; set; }
        public int LanguageId { get; set; }
        public int CountryId { get; set; }
    }

}

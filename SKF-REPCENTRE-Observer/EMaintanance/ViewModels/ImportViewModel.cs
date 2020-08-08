using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class ImportViewModel
    {
        public string PType { get; set; }
        public string Flag { get; set; }
        public int UserId { get; set; }
        public int LanguageId { get; set; }
        [JsonProperty(PropertyName = "Detail")]
        public List<ImportDataViewModel> Datas { get; set; }
    }
}

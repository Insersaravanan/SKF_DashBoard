using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class EncodeNDecodeViewModel
    {
        public string Data { set; get; }
        public string Salt { set; get; }
        public string EncryptionPattern { set; get; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class JobStatusCommentsViewModel
    {
        public int CommentId { get; set; } // PrimaryId of Comments Table
        public string Type { get; set; } // Type will be Job, Equipment, UnitAnalysis
        public int TypeId { get; set; } // Type will be Job, Equipment, UnitAnalysis Id
        public int? StatusId { get; set; }
        public int? OldStatusId { get; set; }
        public string StatusName { get; set; }
        public string Comments { get; set; }
        public string Active { get; set; }
        public int? ReviewerId { get; set; }
        public int UserId { get; set; }
        public int? DatacollectionDone { get; set; }
        public int? ReportSent { get; set; }

        /*Start -  These variables are used for Saving Unit Analysis*/
        public int? JobEquipmentId { get; set; }
        public int? ServiceId { get; set; }
        public string UnitType { get; set; }
        public int? UnitId { get; set; }
        /*End -  These variables are used for Saving Unit Analysis*/

        /*Start -  These variables are used to capture Equipment Details*/
        public int? ConditionId { get; set; }
        public string EquipmentComment { get; set; }
        public DateTime? DataCollectionDate { get; set; }
        public DateTime? ReportDate { get; set; }
        public int IsWarningAccepted { get; set; } = 0;
        /*End -  These variables are used to capture Equipment Details*/

    }
}

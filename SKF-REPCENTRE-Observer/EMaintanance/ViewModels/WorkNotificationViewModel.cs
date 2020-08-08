using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace EMaintanance.ViewModels
{
    public class WorkNotificationUnitViewModel
    {
        public int WNUnitAnalysisId { get; set; }
        public int WNEquipmentId { get; set; }
        public decimal ActualRepairCost { get; set; }
        public decimal ActualOutageHours { get; set; }
        public int UserId { get; set; }
    }

    public class CancelWorkNotificationUnitViewModel
    {
        public int WNEquipmentId { get; set; }
        public int WNUnitAnalysisId { get; set; }
        public string CancelRemarks { get; set; }
    }

    public class WnEqOpportunityViewModel
    {
        public int WNOpportunityId { get; set; }
        public int WNEquipmentId { get; set; }
        public int EquipmentId { get; set; }
        public decimal ActualOutageHours { get; set; }
        public decimal ActualRepairCost { get; set; }
        public decimal TrueSavings { get; set; }
        public int FailureModeId { get; set; }
        public int FailureCauseId { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }
    }

    public class WnSearchViewModel
    {
        public int ClientSiteId { get; set; }
        public DateTime? FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public int LanguageId { get; set; }
        public int StatusId { get; set; }
    }

    public class WnFeedbackViewModel
    {
        public int WNEquipmentId { get; set; }
        public DateTime WNCompletionDate { get; set; }
        public string Feedback { get; set; }
        public decimal RiAmperage { get; set; }
        public int IsAccurate { get; set; }
        public int UserId { get; set; }
        //public string Result { get; set; }
        //public string ResultText { get; set; }
    }

    public class WnEquipmentAttachmentsViewModel
    {
        public int WNEquipmentAttachId { get; set; }
        public int WNEquipmentId { get; set; }
        public string FileName { get; set; }
        public string LogicalName { get; set; }
        public string PhysicalPath { get; set; }
        public string Active { get; set; }
        public int UserId { get; set; }
    }
}

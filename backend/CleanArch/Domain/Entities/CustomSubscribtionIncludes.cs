using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public class CustomSubscribtionIncludes
    {
        public int id { get; set; }
        
        public int? idSchedule { get; set; }
        public int? idRepeatType { get; set; }
        public int? idSubscriberType { get; set; }
        public bool? sendEmpty { get; set; }
        public DateTime? timeStart { get; set; }
        public DateTime? timeEnd { get; set; }
        public bool? monday { get; set; }
        public bool? tuesday { get; set; }
        public bool? wednesday { get; set; }
        public bool? thursday { get; set; }
        public bool? friday { get; set; }
        public bool? saturday { get; set; }
        public bool? sunday { get; set; }
        public int? dateOfMonth { get; set; }
        public int? weekOfMonth { get; set; }
        public bool? isActive { get; set; }
        public int? idDocument { get; set; }
        public DateTime? activeDateStart { get; set; }
        public DateTime? activeDateEnd { get; set; }
        public string body { get; set; }
        public string title { get; set; }
        public int idEmployee { get; set; }
        public int? idStructurePost { get; set; }

        public ScheduleType idScheduleNav { get; set; }
        public RepeatType? idRepeatTypeNav { get; set; }
        public SubscriberType? idSubscriberTypeNav { get; set; }
        public S_DocumentTemplate? idDocumentNav { get; set; }
        public SubscribtionContactType? idSubscribtionContactType { get; set; }

    }


}

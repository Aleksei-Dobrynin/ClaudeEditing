using System;

namespace Domain.Entities
{
    public class LegalRecordEmployee
    {
        public int id { get; set; }
        public bool isActive { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public int? id_record { get; set; }
        public int? id_structure_employee { get; set; }
    }
}
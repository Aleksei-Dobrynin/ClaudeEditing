using System;

namespace Infrastructure.Data.Models
{
    public class LegalActEmployeeModel
    {
        public int id { get; set; }
        public bool? isActive { get; set; }
        public DateTime? created_at { get; set; }
        public DateTime? updated_at { get; set; }
        public int? created_by { get; set; }
        public int? updated_by { get; set; }
        public int? id_act { get; set; }
        public int? id_structure_employee { get; set; }
    }
}
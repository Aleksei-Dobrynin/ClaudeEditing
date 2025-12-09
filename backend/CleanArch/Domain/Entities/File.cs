namespace Domain.Entities
{
    public class File : BaseLogDomain
    {
        public int id { get; set; }
        public string? name { get; set; }
        public string? path { get; set; }
        public byte[] body { get; set; }
    }

    public class FileHistoryLog : BaseLogDomain
    {
        public int id { get; set; }
        public string entity_name { get; set; }
        public int entity_id { get; set; }
        public string action { get; set; }
        public int file_id { get; set; }
    }

    public class FileSign
    {
        public int id { get; set; }
        public int file_id { get; set; }
        public int? employee_id { get; set; }
        public string? employee_fullname { get; set; }
        public int? structure_employee_id { get; set; }
        public string? structure_fullname { get; set; }
        public int[] post_ids { get; set; }
        public int? user_id { get; set; }
        public string? user_full_name { get; set; }
        public string? pin_user { get; set; }
        public string? pin_organization { get; set; }
        public string? sign_hash { get; set; }
        public long? sign_timestamp { get; set; }
        public DateTime? timestamp { get; set; }
        public string? file_type_name { get; set; }
        public int? file_type_id { get; set; }
        public int? cabinet_file_id { get; set; }
        public string? file_name { get; set; }
        public string? application_number { get; set; }
        public string? file_type { get; set; }
        public bool? is_called_out { get; set; }
    }

    public class FileSignInfo
    {
        public string? employee_fullname { get; set; }
        public string? structure_fullname { get; set; }
        public DateTime? timestamp { get; set; }
    }

    public class FilesSignInfo
    {
        public int service_document_id { get; set; }
        public int? file_id { get; set; }
        public int? employee_id { get; set; }
    }


    /// <summary>
    /// Доступная роль для подписи
    /// </summary>
    public class AvailableSigningRoleDto
    {
        /// <summary>
        /// ID должности
        /// </summary>
        public int PositionId { get; set; }

        /// <summary>
        /// Название должности
        /// </summary>
        public string PositionName { get; set; }

        /// <summary>
        /// ID отдела
        /// </summary>
        public int DepartmentId { get; set; }

        /// <summary>
        /// Название отдела
        /// </summary>
        public string DepartmentName { get; set; }

        /// <summary>
        /// ID записи в employee_in_structure
        /// </summary>
        public int StructureEmployeeId { get; set; }

        /// <summary>
        /// Документ уже подписан этой ролью
        /// </summary>
        public bool AlreadySigned { get; set; }

        /// <summary>
        /// Требуется подпись этой роли для согласования
        /// </summary>
        public bool IsRequired { get; set; }

        /// <summary>
        /// Роль активна (не завершена)
        /// </summary>
        public bool IsActive { get; set; }

        /// <summary>
        /// Дата начала работы в этой роли
        /// </summary>
        public DateTime DateStart { get; set; }

        /// <summary>
        /// Дата окончания работы в этой роли (если есть)
        /// </summary>
        public DateTime? DateEnd { get; set; }
    }
}


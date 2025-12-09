using Microsoft.AspNetCore.Mvc.RazorPages;
using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebApi.Dtos
{
    public class CreateFileForApplicationDocumentRequest
    {
        public int file_id { get; set; }
        public int document_id { get; set; }
        public int type_id { get; set; }
        public string? name { get; set; }
        public FileModel? document { get; set; }
    }

    public class UpdateFileForApplicationDocumentRequest
    {
        public int id { get; set; }
        public int file_id { get; set; }
        public int document_id { get; set; }
        public int type_id { get; set; }
        public string? name { get; set; }
        public FileModel document { get; set; }
    }

    public class FileModel
    {
        public IFormFile? file { get; set; }
        public string? name { get; set; }
    }

    public class FileExcelRequest
    {
        public int file_id { get; set; }
        public FileModel? document { get; set; }
        public string? bank_id { get; set; }
    }

    // Путь: backend/CleanArch/WebApi/Dtos/SignDocumentDto.cs
    // НОВЫЙ ФАЙЛ - создать этот файл

    namespace WebApi.Dtos
    {
        /// <summary>
        /// Запрос на подпись документа
        /// </summary>
        public class SignDocumentRequest
        {
            /// <summary>
            /// ID файла для подписи
            /// </summary>
            public int FileId { get; set; }

            /// <summary>
            /// ID загруженного документа приложения (опционально)
            /// </summary>
            public int? UplId { get; set; }

            /// <summary>
            /// PIN пользователя для ЭЦП
            /// </summary>
            public string Pin { get; set; }

            /// <summary>
            /// Код подтверждения для ЭЦП
            /// </summary>
            public string Code { get; set; }

            /// <summary>
            /// ID должности для подписи (опционально, если не указано - берется первая активная роль)
            /// </summary>
            public int? PositionId { get; set; }

            /// <summary>
            /// ID отдела для подписи (опционально, если не указано - берется первая активная роль)
            /// </summary>
            public int? DepartmentId { get; set; }
        }

        /// <summary>
        /// Ответ на запрос подписи документа
        /// </summary>
        public class SignDocumentResponse
        {
            /// <summary>
            /// ID созданной подписи
            /// </summary>
            public int SignId { get; set; }

            /// <summary>
            /// Успешность операции
            /// </summary>
            public bool Success { get; set; }

            /// <summary>
            /// Сообщение о результате
            /// </summary>
            public string Message { get; set; }
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
}

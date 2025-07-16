using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Domain.Entities
{
    public interface IPaymentRecord
    {
        DateTime PaymentDate { get; }
        string PaymentId { get; }
        string ContractNumber { get; }
        decimal Amount { get; }
    }
    
    public class PaymentRecord: IPaymentRecord
    {
        public int Number { get; set; } // №
        public string PaymentId { get; set; } // ID платежа
        public DateTime PaymentDate { get; set; } // Дата платежа (время)
        public string ContractNumber { get; set; } // Номер договора
        public string OrganizationName { get; set; } // ФИО или наименование организации
        public string INN { get; set; } // ИНН
        public string Department { get; set; } // Отдел
        public string DepartmentCode { get; set; } // Шифр отдела
        public decimal Amount { get; set; } // Сумма
    }

    public class PaymentRecordMbank: IPaymentRecord
    {
        public DateTime DataTime { get; set; } // ДАТА_И_ВРЕМЯ
        public string TransactionId { get; set; } // ID_ТРАНЗАКЦИИ
        public string Details { get; set; } // РЕКВИЗИТЫ
        public decimal Sum { get; set; } // СУММА
        public string Currency { get; set; } // ВАЛЮТА
        public string Status { get; set; } // СТАТУС
        public string Purpose { get; set; } // НАЗНАЧЕНИЕ
        public string CheckNumber { get; set; } // НОМЕР_ЧЕКА
        public DateTime PaymentDate => DataTime;
        public string PaymentId => TransactionId;
        public string ContractNumber => Details;
        public decimal Amount => Sum;
    }
}
using Domain.Entities;
using ExcelDataReader;
using System.Data;
using System.IO;

namespace Infrastructure.Utils
{
    public static class ExcelHelper
    {
        public static List<PaymentRecord> ReadPaymentRecords(MemoryStream ms)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            var paymentRecords = new List<PaymentRecord>();

            using (var reader = ExcelReaderFactory.CreateReader(ms))
            {
                var conf = new ExcelDataSetConfiguration
                {
                    ConfigureDataTable = _ => new ExcelDataTableConfiguration
                    {
                        UseHeaderRow = false
                    }
                };

                DataSet result = reader.AsDataSet(conf);
                DataTable table = result.Tables[0];
                foreach (DataRow row in table.Rows)
                {
                    try
                    {
                        PaymentRecord record = new PaymentRecord
                        {
                            Number = Convert.ToInt32(row[0]),
                            PaymentId = Convert.ToString(row[1]),
                            PaymentDate = DateTime.Parse(row[2].ToString()),
                            ContractNumber = row[3].ToString(),
                            OrganizationName = row[4].ToString(),
                            INN = Convert.ToString(row[5]),
                            Department = row[6].ToString(),
                            DepartmentCode = row[7].ToString(),
                            Amount = Convert.ToDecimal(row[8])
                        };
                        
                        paymentRecords.Add(record);
                    }
                    catch (Exception ex)
                    {
                        continue;
                    }
                }
            }
            return paymentRecords;
        }

        public static List<PaymentRecordMbank> ReadPaymentMbankRecords(MemoryStream ms)
        {
            System.Text.Encoding.RegisterProvider(System.Text.CodePagesEncodingProvider.Instance);
            var paymentMbankRecords = new List<PaymentRecordMbank>();

            using (var reader = ExcelReaderFactory.CreateReader(ms))
            {
                var conf = new ExcelDataSetConfiguration
                {
                    ConfigureDataTable = _ => new ExcelDataTableConfiguration
                    {
                        UseHeaderRow = false
                    }
                };

                DataSet result = reader.AsDataSet(conf);
                DataTable table = result.Tables[0];

                foreach (DataRow row in table.Rows)
                {
                    try
                    {
                        PaymentRecordMbank record = new PaymentRecordMbank
                        {
                            DataTime = DateTime.Parse(row[0].ToString()),
                            TransactionId = Convert.ToString(row[1]),
                            Details = Convert.ToString(row[2]),
                            Sum = Convert.ToDecimal(row[3]),
                            Currency = Convert.ToString(row[4]),
                            Status = Convert.ToString(row[5]),
                            Purpose = Convert.ToString(row[6]),
                            CheckNumber = Convert.ToString(row[7])
                        };

                        paymentMbankRecords.Add(record);
                    }
                    catch (Exception ex)
                    {
                        continue;
                    }
                }
            }
            return paymentMbankRecords;
        }
    }
}

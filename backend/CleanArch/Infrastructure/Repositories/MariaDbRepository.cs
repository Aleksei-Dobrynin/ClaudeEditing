using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using System.Xml.Linq;
using System.Text.Json;

namespace Infrastructure.Repositories
{
    public class MariaDbRepository : IMariaDbRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private bool hasMariaDbConnection;

        public MariaDbRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
            try
            {
                _dbConnection.Open();
                hasMariaDbConnection = true;
            }
            catch
            {
                hasMariaDbConnection = false;
            }
        }

        public async Task<int> AddReestr(Domain.Entities.Reestr domain)
        {
            try
            {
                // SQL-запрос для вставки данных и получения последнего вставленного ID
                var sql = @"
            INSERT INTO completed 
                (branch, uid, ymonth, cname, status) 
            VALUES 
                (@branch, @uid, @ymonth, @cname, @status);
            SELECT LAST_INSERT_ID();";

                // Выполняем запрос и получаем результат - последний вставленный ID
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add statement in mariadb", ex);
            }
        }

        public async Task<int> UpdateReestr(Domain.Entities.Reestr domain)
        {
            try
            {
                // SQL-запрос для вставки данных и получения последнего вставленного ID
                var sql = @"
                update completed 
                set ymonth = @ymonth, cname = @cname, status = @status 
                where id = @id
";

                // Выполняем запрос и получаем результат - последний вставленный ID
                var result = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add statement in mariadb", ex);
            }
        }

        public async Task<int> DeleteAppInReestr(int sid)
        {
            try
            {
                // SQL-запрос для вставки данных и получения последнего вставленного ID
                var sql = @"
                delete from completed_many
                where sid = @sid
";
                // Выполняем запрос и получаем результат - последний вставленный ID
                var result = await _dbConnection.ExecuteAsync(sql, new { sid }, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add statement in mariadb", ex);
            }
        }

        public async Task<int> DeletePayInReestr(int sid)
        {
            try
            {
                // SQL-запрос для вставки данных и получения последнего вставленного ID
                var sql = @"
                delete from completed_list
                where sid = @sid
";
                // Выполняем запрос и получаем результат - последний вставленный ID
                var result = await _dbConnection.ExecuteAsync(sql, new { sid }, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add statement in mariadb", ex);
            }
        }

        public async Task<int> AddAppInReestr(Domain.Entities.ReestrInApp domain)
        {
            try
            {
                // SQL-запрос для вставки данных и получения последнего вставленного ID
                var sql = @"
            INSERT INTO completed_many
                (id, sid, otd, sum) 
            VALUES 
                (@id, @sid, @otd, @sum);
            SELECT LAST_INSERT_ID();";

                // Выполняем запрос и получаем результат - последний вставленный ID
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add statement in mariadb", ex);
            }
        }

        public async Task<int> AddPaymentInReestr(Domain.Entities.PaymentInReestr domain)
        {
            try
            {
                // SQL-запрос для вставки данных и получения последнего вставленного ID
                var sql = @"
            INSERT INTO completed_list
                (branch, sid, cid, invoce, amount) 
            VALUES 
                (@branch, @sid, @cid, @invoce, @amount);
            SELECT LAST_INSERT_ID();";

                // Выполняем запрос и получаем результат - последний вставленный ID
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add statement in mariadb", ex);
            }
        }

        public async Task<int> Add(Domain.Entities.Statement domain)
        {
            try
            {
                // SQL-запрос для вставки данных и получения последнего вставленного ID
                var sql = @"
            INSERT INTO statements 
                (branch, inn, step, service, started, finished, issue, fact, realize, ticket, sid, workers, person, object, sms) 
            VALUES 
                (@branch, @inn, @step, @service, @started, @finished, @issue, @fact, @realize, @ticket, @sid, @workers, @person, @_object, @sms);
            SELECT LAST_INSERT_ID();";

                // Выполняем запрос и получаем результат - последний вставленный ID
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);

                var id = int.Parse(domain.app_number);

                //var sql2 = @"update branch set sid = " + (id + 1) + " where id = 101";
                //var result2 = await _dbConnection.ExecuteScalarAsync<int>(sql2, transaction: _dbTransaction);

                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add statement in mariadb", ex);
            }
        }

        public async Task Update(Domain.Entities.Statement domain)
        {
            try
            {
                var sql = @"UPDATE statements SET branch = @branch, inn = @inn, step = @step, service = @service, started = @started, finished = @finished, issue = @issue, fact = @fact, realize = @realize, ticket = @ticket, sid = @sid, 
    workers = @workers, person = @person, object = @object, sms = @sms WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Application", ex);
            }
        }


        public async Task UpdateWorkers(Domain.Entities.Statement domain)
        {
            try
            {
                var sql = @"UPDATE statements SET workers = @workers WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);

            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Application", ex);
            }
        }

        public async Task ChangeStepApplication(int statement_id, int step_id)
        {
            try
            {
                var sql = @"UPDATE statements SET step = @step_id WHERE id = @statement_id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { statement_id, step_id }, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update step statement in mariadb", ex);
            }
        }
        public bool HasMariaDbConnection()
        {
            return false;
            return this.hasMariaDbConnection;
        }

        public async Task<List<UserMariaDb>> GetEmployeesByEmail(string email)
        {
            try
            {
                // SQL-запрос для вставки данных и получения последнего вставленного ID
                var sql = @"
            SELECT * FROM users where email = @email";

                // Выполняем запрос и получаем результат - последний вставленный ID
                var result = await _dbConnection.QueryAsync<UserMariaDb>(sql, new { email }, transaction: _dbTransaction);
                return result.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get users from mariadb", ex);
            }
        }
        public async Task<Statement> GetLastAddedApplication()
        {
            try
            {
                var sql = @"
            SELECT * FROM statements ORDER BY id DESC LIMIT 1";

                var models = await _dbConnection.QueryAsync<Statement>(sql, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get last statement from mariadb", ex);
            }
        }
        public async Task<Statement> GetStatementById(int id)
        {
            try
            {
                var sql = @"
            SELECT * FROM statements WHERE id = @id LIMIT 1";

                var models = await _dbConnection.QueryAsync<Statement>(sql, new { id }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get last statement from mariadb", ex);
            }
        }

        public async Task<StContsing> GetStContSig(string sid)
        {
            try
            {
                var sql = @"
            SELECT * FROM st_contsing WHERE sid = @sid LIMIT 1";

                var models = await _dbConnection.QueryAsync<StContsing>(sql, new { sid }, transaction: _dbTransaction);
                return models.FirstOrDefault();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get last statement from mariadb", ex);
            }
        }

        public Dictionary<int, int> MapOtdel()
        {
            return new Dictionary<int, int>
        {
            { 224,  1},
//{ 209, 2},
{ 242, 3},
{ 223,  4},
{ 227, 5},
{ 252,  6},
{ 251,  7},
{ 237, 8},
{ 236, 9},
{ 221, 10},
{ 245, 11},
{ 228, 12},
{ 238, 13},
{ 244, 14},
{ 241, 15},
{ 240, 16},
{ 239, 16},
{ 232, 17},
{ 233, 18},
{ 234, 19},
{ 235, 20},
{ 247, 21},
{ 248, 22},
{ 249, 23},
{ 250, 24},
{ 246, 25},
{ 222, 26},
//{ 209, 27},
//{ 222, 28},
{ 253, 29},
{ 255, 30},
{ 256, 31},
        };
        }

        public async Task SyncPayment(string number, int structure_id, UserMariaDb user, List<application_payment> payments, application_payment payment)
        {
            try
            {
                if (number.Length == 5)
                {
                    number = "4" + number;
                }

                var otdel = 1;
                if (MapOtdel().ContainsKey(structure_id))
                {
                    otdel = MapOtdel()[structure_id];
                }

                var year = "2024";
                if (number.StartsWith("5"))
                    year = "2025";
                var folderPath = "/var/www/okno.gosstroy.gov.kg/docs/101/" + year + "/" + ("1012" + number) + "/txt";
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                if (!System.IO.File.Exists(folderPath + "/cost"))
                {
                    var lines = new List<string>();
                    foreach (var item in payments)
                    {
                        lines.Add(JsonSerializer.Serialize(new LogEntry
                        {
                            desc = item.description,
                            otdel = otdel.ToString() ?? "1",
                            time = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds(),
                            uid = user.id.ToString(),
                            user = user.surname + " " + user.name,
                            price = (decimal)item.sum * 100,
                        }));
                    }
                    System.IO.File.WriteAllLines(folderPath + "/cost", lines);
                }
                else
                {
                    var lines = new List<string>();
                    var line = JsonSerializer.Serialize(new LogEntry
                    {
                        desc = payment.description,
                        otdel = otdel.ToString() ?? "1",
                        time = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds(),
                        uid = user.id.ToString(),
                        user = user.surname + " " + user.name,
                        price = (decimal)payment.sum * 100,
                    });
                    lines.Add(line);
                    System.IO.File.AppendAllLines(folderPath + "/cost", lines);
                }



            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update step statement in mariadb", ex);
            }
        }

        public async Task SyncPaymentUpdate(string number, int structure_id, UserMariaDb user, List<application_payment> payments, application_payment payment)
        {
            try
            {
                if (number.Length == 5)
                {
                    number = "4" + number;
                }
                var year = "2024";
                if (number.StartsWith("5"))
                    year = "2025";
                var folderPath = "/var/www/okno.gosstroy.gov.kg/docs/101/" + year + "/" + ("1012" + number) + "/txt";
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var otdel = 1;
                if (MapOtdel().ContainsKey(structure_id))
                {
                    otdel = MapOtdel()[structure_id];
                }

                if (!System.IO.File.Exists(folderPath + "/cost"))
                {
                    var lines = new List<string>();
                    foreach (var item in payments)
                    {
                        lines.Add(JsonSerializer.Serialize(new LogEntry
                        {
                            desc = item.description,
                            otdel = otdel.ToString() ?? "1",
                            time = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds(),
                            uid = user.id.ToString(),
                            user = user.surname + " " + user.name,
                            price = (decimal)item.sum * 100,
                        }));
                    }
                    System.IO.File.WriteAllLines(folderPath + "/cost", lines);
                }
                else
                {

                    var lines = System.IO.File.ReadAllLines(folderPath + "/cost");
                    for (var i = 0; i < lines.Length; i++)
                    {
                        var entry = JsonSerializer.Deserialize<LogEntry>(lines[i]);
                        if (entry != null)
                        {
                            if (entry.uid == user.id.ToString() && entry.otdel == otdel.ToString())
                            {
                                entry.desc = payment.description;
                                entry.price = (decimal)payment.sum * 100;
                                entry.time = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds();
                                lines[i] = JsonSerializer.Serialize(entry);
                            }
                        }
                    }
                    System.IO.File.WriteAllLines(folderPath + "/cost", lines);
                }

            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update step statement in mariadb", ex);
            }
        }

        public async Task SyncPaymentDelete(string number, int structure_id, UserMariaDb user, List<application_payment> payments)
        {
            try
            {
                if (number.Length == 5)
                {
                    number = "4" + number;
                }
                var year = "2024";
                if (number.StartsWith("5"))
                    year = "2025";
                var folderPath = "/var/www/okno.gosstroy.gov.kg/docs/101/" + year + "/" + ("1012" + number) + "/txt";
                if (!Directory.Exists(folderPath))
                {
                    Directory.CreateDirectory(folderPath);
                }

                var otdel = 1;
                if (MapOtdel().ContainsKey(structure_id))
                {
                    otdel = MapOtdel()[structure_id];
                }

                if (!System.IO.File.Exists(folderPath + "/cost"))
                {
                    var lines = new List<string>();
                    foreach (var item in payments)
                    {
                        lines.Add(JsonSerializer.Serialize(new LogEntry
                        {
                            desc = item.description,
                            otdel = otdel.ToString() ?? "1",
                            time = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds(),
                            uid = user.id.ToString(),
                            user = user.surname + " " + user.name,
                            price = (decimal)item.sum * 100,
                        }));
                    }
                    System.IO.File.WriteAllLines(folderPath + "/cost", lines);
                }
                else
                {
                    var newLines = new List<string>();
                    var lines = System.IO.File.ReadAllLines(folderPath + "/cost");
                    for (var i = 0; i < lines.Length; i++)
                    {
                        var entry = JsonSerializer.Deserialize<LogEntry>(lines[i]);
                        if (entry != null)
                        {
                            if (entry.uid == user.id.ToString() && entry.otdel == otdel.ToString())
                            {
                                continue;
                            }
                            else
                            {
                                newLines.Add(lines[i]);
                            }
                        }
                    }
                    System.IO.File.WriteAllLines(folderPath + "/cost", newLines);
                }

            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update step statement in mariadb", ex);
            }
        }


        public async Task UpdateCost(int statement_id, double cost)
        {
            try
            {
                var statement = await GetStatementById(statement_id);
                var stCont = await GetStContSig(statement.sid);
                if (stCont == null)
                {
                    stCont = new StContsing();
                }
                stCont.cdate = new DateTimeOffset(DateTime.Now).ToUnixTimeSeconds();
                stCont.csum = (int)Math.Round(cost * 100, 0);
                stCont.sid = statement.sid;


                // SQL-запрос для вставки данных и получения последнего вставленного ID
                var sql = @"REPLACE INTO st_contsing (sid, cdate, csum) VALUES (@sid, @cdate, @csum)";

                // Выполняем запрос и получаем результат - последний вставленный ID
                var result = await _dbConnection.ExecuteAsync(sql, stCont, transaction: _dbTransaction);


            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add statement in mariadb", ex);
            }
        }

        public async Task UpdateCustomer(int id, string name)
        {
            try
            {
                // SQL-запрос для вставки данных и получения последнего вставленного ID
                var sql = @"
                update statements 
                set person = @name
                where id = @id";

                // Выполняем запрос и получаем результат - последний вставленный ID
                var result = await _dbConnection.ExecuteAsync(sql, new { id, name }, transaction: _dbTransaction);
            }
            catch (Exception ex)
            {
                //throw new RepositoryException("Failed to add statement in mariadb", ex);
            }
        }

        public class LogEntry
        {
            public long time { get; set; } // Unix timestamp
            public string uid { get; set; } // User ID
            public string user { get; set; } // User info, contains HTML
            public string otdel { get; set; } // Department ID
            public string desc { get; set; } // Description
            public decimal price { get; set; } // Price
        }

    }
}
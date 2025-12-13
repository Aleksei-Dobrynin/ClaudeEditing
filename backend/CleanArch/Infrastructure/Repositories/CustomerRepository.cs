using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using System.Globalization;
using FluentResults;
using Flurl;
using Flurl.Http;
using Infrastructure.FillLogData;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace Infrastructure.Repositories
{
    public class CustomerRepository : ICustomerRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;
        private readonly string _apiTundukClient;

        public CustomerRepository(IDbConnection dbConnection, IUserRepository userRepository, IConfiguration configuration)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
            _apiTundukClient = configuration.GetValue<string>("ExternalApi:TundukClient") ??
                               throw new ArgumentNullException(nameof(configuration), "API TundukClient not configured");
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<Customer>> GetAll()
        {
            try
            {
                var sql = @"SELECT customer.id, pin, is_organization, full_name, address, director, okpo, 
                                organization_type_id, organization_type.name as organization_type_name, 
                                payment_account, postal_code, ugns, bank, bik, registration_number
                            FROM customer left join organization_type on organization_type.id = customer.organization_type_id";
                var models = await _dbConnection.QueryAsync<Customer>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Customer", ex);
            }
        }
        public async Task<List<Customer>> GetAllBySearch(string text)
        {
            try
            {
                var sql = $@"SELECT customer.*, organization_type.name as organization_type_name
                FROM customer
                JOIN (
                    SELECT pin, MAX(id) AS max_id
                    FROM customer
                    GROUP BY pin
                ) t2 ON customer.pin = t2.pin AND customer.id = t2.max_id
                left join organization_type on organization_type.id = customer.organization_type_id
";

                if(text != null)
                {
                    sql += $@"WHERE customer.pin like '%{text.ToLower()}%' or LOWER(full_name) like '%{text.ToLower()}%'
";
                }
                sql += $@"limit 50;";

                var models = await _dbConnection.QueryAsync<Customer>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Customer", ex);
            }
        }

        public async Task<Customer> GetOneByID(int id)
        {
            try
            {
                var sql = @"SELECT customer.*, organization_type.name as organization_type_name FROM customer
                            left join organization_type on organization_type.id = customer.organization_type_id
                             WHERE customer.id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<Customer>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"Customer with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Customer", ex);
            }
        }

        public async Task<Customer> GetOneByPin(string pin, int customer_id)
        {
            try
            {
                if (customer_id > 0)
                {
                    var sql = @"SELECT * FROM customer WHERE pin=@Pin and id != @ID limit 1";
                    var model = await _dbConnection.QuerySingleOrDefaultAsync<Customer>(sql, new { Pin = pin, ID = customer_id }, transaction: _dbTransaction);
                
                    return model;
                } else {
                    var sql = @"SELECT * FROM customer WHERE pin=@Pin limit 1";
                    var model = await _dbConnection.QuerySingleOrDefaultAsync<Customer>(sql, new { Pin = pin }, transaction: _dbTransaction);
                
                    return model;
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Customer", ex);
            }
        }



        

        public async Task<int> Add(Customer domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Customer
                {
                    pin = domain.pin,
                    is_organization = domain.is_organization,
                    full_name = domain.full_name,
                    address = domain.address,
                    director = domain.director,
                    okpo = domain.okpo,
                    organization_type_id = domain.organization_type_id,
                    payment_account = domain.payment_account,
                    postal_code = domain.postal_code,
                    ugns = domain.ugns,
                    bank = domain.bank,
                    bik = domain.bik,
                    registration_number = domain.registration_number,
                    individual_name = domain.individual_name,
                    individual_secondname = domain.individual_secondname,
                    individual_surname = domain.individual_surname,
                    identity_document_type_id = domain.identity_document_type_id,
                    document_serie = domain.document_serie,
                    document_date_issue = domain.document_date_issue,
                    document_whom_issued = domain.document_whom_issued,
                    is_foreign = domain.is_foreign,
                    foreign_country = domain.foreign_country
                };
                await FillLogDataHelper.FillLogDataCreate(model, userId);
                var sql = @"INSERT INTO customer(pin, is_organization, full_name, address, director, okpo, 
                                organization_type_id, payment_account, postal_code, ugns, bank, bik, registration_number,
                                individual_name, individual_secondname, individual_surname, identity_document_type_id,
                                document_serie, document_date_issue, document_whom_issued, created_by, created_at,
                                updated_by, updated_at, is_foreign, foreign_country) 
                            VALUES (@pin, @is_organization, @full_name, @address, @director, @okpo, @organization_type_id,
                                    @payment_account, @postal_code, @ugns, @bank, @bik, @registration_number,
                                    @individual_name, @individual_secondname, @individual_surname, @identity_document_type_id,
                                    @document_serie, @document_date_issue, @document_whom_issued, @created_by, @created_at,
                                    @updated_by, @updated_at, @is_foreign, @foreign_country) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, model, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add Customer", ex);
            }
        }

        public async Task Update(Customer domain)
        {
            try
            {
                var userId = await UserSessionHelper.SetCurrentUserAsync(_userRepository, _dbConnection, _dbTransaction);

                var model = new Customer
                {
                    id = domain.id,
                    pin = domain.pin,
                    is_organization = domain.is_organization,
                    full_name = domain.full_name,
                    address = domain.address,
                    director = domain.director,
                    okpo = domain.okpo,
                    organization_type_id = domain.organization_type_id,
                    payment_account = domain.payment_account,
                    postal_code = domain.postal_code,
                    ugns = domain.ugns,
                    bank = domain.bank,
                    bik = domain.bik,
                    registration_number = domain.registration_number,
                    individual_name = domain.individual_name,
                    individual_secondname = domain.individual_secondname,
                    individual_surname = domain.individual_surname,
                    identity_document_type_id = domain.identity_document_type_id,
                    document_serie = domain.document_serie,
                    document_date_issue = domain.document_date_issue?.Date, 
                    document_whom_issued = domain.document_whom_issued,
                    is_foreign = domain.is_foreign,
                    foreign_country = domain.foreign_country
                };
                await FillLogDataHelper.FillLogDataUpdate(model, userId);
                var sql = @"UPDATE customer SET pin = @pin, is_organization = @is_organization, full_name = @full_name, 
                            updated_at = @updated_at, updated_by = @updated_by, address = @address, director = @director, okpo = @okpo, 
                            organization_type_id = @organization_type_id, payment_account = @payment_account, 
                            postal_code = @postal_code, ugns = @ugns, bank = @bank, bik = @bik, 
                            registration_number = @registration_number, individual_name = @individual_name, individual_secondname = @individual_secondname, individual_surname = @individual_surname, 
                            identity_document_type_id = @identity_document_type_id, document_serie = @document_serie,
                            document_date_issue = @document_date_issue, document_whom_issued = @document_whom_issued,
                            is_foreign =  @is_foreign, foreign_country = @foreign_country
                                WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, model, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update Customer", ex);
            }
        }

        public async Task<PaginatedList<Customer>> GetPaginated(int pageSize, int pageNumber, string orderBy, string? orderType)
        {
            try
            {
                var sql = "SELECT * FROM customer ";

                if (orderBy != "null" && orderType != "null" && orderBy != null && orderType != null)
                {
                    sql += @$"
ORDER BY {orderBy} {orderType}";
                }
                else
                {
                    sql += @$"
ORDER BY id desc";
                }
                sql += @$"
OFFSET @pageSize * @pageNumber Limit @pageSize";

                var models = await _dbConnection.QueryAsync<Customer>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM customer";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<Customer>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Customer", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM customer WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("Customer not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete Customer", ex);
            }
        }
        
        public async Task<Result<CompanyInfo>> findCompanyByPin(string pin)
        {
            try
            {
                var response = await _apiTundukClient
                    .AppendPathSegment("TundukClient")
                    .AppendPathSegment("GetCompanyByPin")
                    .SetQueryParam("pin", pin)
                    .GetStringAsync();

                var document = JsonConvert.DeserializeObject<CompanyInfo>(response);
                return Result.Ok(document);
            }
            catch (Exception ex)
            {
                return Result.Fail(new Error("Failed to send application data")
                    .WithMetadata("ErrorCode", "EXTERNAL_API_ERROR")
                    .WithMetadata("Details", ex.Message));
            }
        }
    }
}

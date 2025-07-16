using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Application.Exceptions;
using Application.Models;

namespace Infrastructure.Repositories
{
    public class StructureTemplatesRepository : IStructureTemplatesRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private IUserRepository _userRepository;

        public StructureTemplatesRepository(IDbConnection dbConnection, IUserRepository userRepository)
        {
            _dbConnection = dbConnection;
            _userRepository = userRepository;
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<StructureTemplates>> GetAllForStructure(int structure_id)
        {
            try
            {
                var sql = @"SELECT st.id, st.structure_id, st.template_id, SDT.name, SDT.description
                            FROM structure_templates as st
                            LEFT JOIN public.""S_DocumentTemplate"" SDT on st.template_id = SDT.id
                            WHERE st.structure_id = @structure_id";
                var models = await _dbConnection.QueryAsync<StructureTemplates>(sql, transaction: _dbTransaction);
                return models.ToList();
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureTemplates", ex);
            }
        }

        public async Task<StructureTemplates> GetOneByID(int id)
        {
            try
            {
                var sql = @"SELECT st.id, st.structure_id, st.template_id, SDT.name, SDT.description
                            FROM structure_templates as st
                            LEFT JOIN public.""S_DocumentTemplate"" SDT on st.template_id = SDT.id
                            WHERE st.id=@Id";
                var model = await _dbConnection.QuerySingleOrDefaultAsync<StructureTemplates>(sql, new { Id = id }, transaction: _dbTransaction);

                if (model == null)
                {
                    throw new RepositoryException($"StructureTemplates with ID {id} not found.", null);
                }

                return model;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureTemplates", ex);
            }
        }

        public async Task<int> Add(StructureTemplates domain)
        {
            try
            {
                domain.created_by = await _userRepository.GetUserID();
                domain.created_at = DateTime.Now;
                domain.updated_at = DateTime.Now;
                var sql = @"INSERT INTO structure_templates (structure_id, template_id, created_at, created_by, updated_at, updated_by) 
                            VALUES (@structure_id, @template_id, @created_at, @created_by, @updated_at, @updated_by) RETURNING id";
                var result = await _dbConnection.ExecuteScalarAsync<int>(sql, domain, transaction: _dbTransaction);
                return result;
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to add StructureTemplates", ex);
            }
        }

        public async Task Update(StructureTemplates domain)
        {
            try
            {
                domain.updated_by = await _userRepository.GetUserID();
                domain.updated_at = DateTime.Now;
                var sql = "UPDATE structure_templates SET structure_id = @structure_id, template_id = @template_id, updated_at = @updated_at, updated_by = @updated_by WHERE id = @id";
                var affected = await _dbConnection.ExecuteAsync(sql, domain, transaction: _dbTransaction);
                if (affected == 0)
                {
                    throw new RepositoryException("Not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to update StructureTemplates", ex);
            }
        }

        public async Task<PaginatedList<StructureTemplates>> GetPaginated(int pageSize, int pageNumber)
        {
            try
            {
                var sql = "SELECT * FROM structure_templates OFFSET @pageSize * (@pageNumber - 1) Limit @pageSize;";
                var models = await _dbConnection.QueryAsync<StructureTemplates>(sql, new { pageSize, pageNumber }, transaction: _dbTransaction);

                var sqlCount = "SELECT Count(*) FROM structure_templates";
                var totalItems = await _dbConnection.ExecuteScalarAsync<int>(sqlCount, transaction: _dbTransaction);

                var domainItems = models.ToList();

                return new PaginatedList<StructureTemplates>(domainItems, totalItems, pageNumber, pageSize);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get StructureTemplates", ex);
            }
        }

        public async Task Delete(int id)
        {
            try
            {
                var sql = "DELETE FROM structure_templates WHERE id = @Id";
                var affected = await _dbConnection.ExecuteAsync(sql, new { Id = id }, transaction: _dbTransaction);

                if (affected == 0)
                {
                    throw new RepositoryException("StructureTemplates not found", null);
                }
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to delete StructureTemplates", ex);
            }
        }
    }
}

using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using Newtonsoft.Json;

namespace Infrastructure.Repositories
{
    public class n8nRepository : In8nRepository
    {
        private readonly HttpClient _client;

        public n8nRepository(HttpClient client)
        {
            _client = client;
        }
        
        public async Task<List<n8nResponse>> Get(int application_id, string url)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, $"{url}?application_id={application_id}");
                var response = await _client.SendAsync(request);
                response.EnsureSuccessStatusCode();
                var jsonResponse = await response.Content.ReadAsStringAsync();
                return JsonConvert.DeserializeObject<List<n8nResponse>>(jsonResponse);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get n8n", ex);
            }
        }
        
        public void Run(int application_id, string url)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, $"{url}?application_id={application_id}");
                _client.SendAsync(request);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to run n8n", ex);
            }
        }
    }
}

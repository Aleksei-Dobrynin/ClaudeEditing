using System.Text.Json;
using Application.Models;
using Application.Repositories;
using Domain.Entities;
using FluentResults;
using Newtonsoft.Json;
using StackExchange.Redis;

namespace Application.UseCases
{
    public class SmejPortalUseCases
    {
        private readonly IUnitOfWork unitOfWork;
        private readonly IDatabase _redis;

        public SmejPortalUseCases(IUnitOfWork unitOfWork, IConnectionMultiplexer redis)
        {
            this.unitOfWork = unitOfWork;
            _redis = redis.GetDatabase();
        }

        public async Task<List<SmejPortalOrganization>> GetAllOrganizationData()
        {
            string cacheKey = "smej_portal:organizations";
            int ttlSeconds = 300;
            
            string cachedResult = await _redis.StringGetAsync(cacheKey);
            if (!string.IsNullOrEmpty(cachedResult))
            {
                var res = JsonConvert.DeserializeObject<List<SmejPortalOrganization>>(cachedResult);
                return res;
            }
            var list = await unitOfWork.SmejPortalApiRepository.GetAllOrganizationData();
            
            var serializeOptions = new JsonSerializerOptions { IgnoreNullValues = true };
            string serializedOutcome = System.Text.Json.JsonSerializer.Serialize(list.Value, serializeOptions);
            await _redis.StringSetAsync(cacheKey, serializedOutcome, TimeSpan.FromSeconds(ttlSeconds));
            return list.Value;
        } 
        
        public async Task<Result<List<SmejPortalApprovalRequest>>> GetByApplicationNumberApprovalRequestData(string number)
        {
            var list = await unitOfWork.SmejPortalApiRepository.GetByApplicationNumberApprovalRequestData(number);
            return list.Value;
        }
    }
}

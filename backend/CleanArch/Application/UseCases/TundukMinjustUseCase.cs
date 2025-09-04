using System.Text.Json;
using Application.Repositories;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using StackExchange.Redis;

namespace Application.UseCases;

public class TundukMinjustUseCase
{
    private readonly IMinjustRepository _minjustRepository;
    private readonly IDatabase _redis;
    private readonly IUnitOfWork unitOfWork;
    private readonly IConfiguration _configuration;

    public TundukMinjustUseCase(IMinjustRepository minjustRepository, IConnectionMultiplexer redis,
        IUnitOfWork unitOfWork, IConfiguration configuration)
    {
        _minjustRepository = minjustRepository;
        _redis = redis.GetDatabase();
        _configuration = configuration;
        this.unitOfWork = unitOfWork;
    }

    public Task<Customer> GetInfoByPin(string pin)
    {
        return _minjustRepository.GetInfoByPin(pin);
    }

    public async Task<List<TundukData>> GetDistricts()
    {
        var bishkekId = _configuration.GetSection("Tunduk:Bishkek").Get<int>();
        //TODO optimize
        var all = await unitOfWork.AddressUnitRepository.GetAteChildren(bishkekId);
        var districts = all.Select(x => new TundukData
        {
            id = x.id,
            name = x.name,
            name_kg = x.name_kg,
            type = x.type_id,
            code = x.code
        }).ToList();
        return districts;

        const string cacheKey = "tunduk:districts";
        var cached = await _redis.StringGetAsync(cacheKey);
        if (!cached.IsNullOrEmpty)
        {
            return JsonSerializer.Deserialize<List<TundukData>>(cached);
        }
        var response = await _minjustRepository.GetAteChildren(7402);
        var result = new List<TundukData>();
        foreach (var item in response.child)
        {
            result.Add(new TundukData
            {
                id = item.id,
                name = item.value,
                name_kg = item.valueKg,
                type = item.type,
                code = item.code
            });
        }
        var ttlSeconds = 1800;
        await _redis.StringSetAsync(
            cacheKey,
            JsonSerializer.Serialize(result, new JsonSerializerOptions { IgnoreNullValues = true }),
            TimeSpan.FromSeconds(ttlSeconds)
        );

        return result;
    }

    public async Task<List<TundukData>> GetAteChildren(int ateId)
    {
        //TODO optimize
        if (ateId == 0) return new List<TundukData>();

        var all = await unitOfWork.AddressUnitRepository.GetAteChildren(ateId);
        var children = all.Select(x => new TundukData
        {
            id = x.id,
            name = x.name,
            name_kg = x.name_kg,
            type = x.type_id,
            code = x.code
        }).ToList();
        return children;


        var cacheKey = $"tunduk:ateChildren:{ateId}";
        var cached = await _redis.StringGetAsync(cacheKey);
        if (!cached.IsNullOrEmpty)
        {
            return JsonSerializer.Deserialize<List<TundukData>>(cached);
        }
        var response = await _minjustRepository.GetAteChildren(ateId);
        var result = new List<TundukData>();
        foreach (var item in response.child)
        {
            result.Add(new TundukData
            {
                id = item.id,
                name = item.value,
                name_kg = item.valueKg,
                type = item.type,
                code = item.code
            });
        }
        var ttlSeconds = 1800;
        await _redis.StringSetAsync(
            cacheKey,
            JsonSerializer.Serialize(result, new JsonSerializerOptions { IgnoreNullValues = true }),
            TimeSpan.FromSeconds(ttlSeconds)
        );
        return result;
    }

    public async Task<TundukData> GetOneStreet(int id)
    {
        var street = await unitOfWork.StreetRepository.GetOneByID(id);
        var res = new TundukData
        {
            id = street.id,
            name = street.name,
            name_kg = street.name_kg,
            streetId = street.streetid ?? 0,
            address_unit_name = street.address_unit_name,
            address_unit_id = street.address_unit_id
        };
        return res;
    }
    public async Task<List<TundukData>> Search(string text, int ateId)
    {
        var bishkekId = _configuration.GetSection("Tunduk:Bishkek").Get<int>();
        if (ateId == 0) ateId = bishkekId;
        var streets = await unitOfWork.StreetRepository.Search(text,ateId);
        var res = streets.Select(x => new TundukData
        {
            id = x.id,
            name = x.name,
            name_kg = x.name_kg,
            streetId = x.streetid ?? 0,
            address_unit_name = x.address_unit_name,
            address_unit_id = x.address_unit_id
        }).ToList();
        return res;
    }

    public async Task<List<TundukData>> GetAllStreets()
    {
        var bishkekId = _configuration.GetSection("Tunduk:Bishkek").Get<int>();
        var streets = await unitOfWork.StreetRepository.GetAteStreets(bishkekId);
        var res = streets.Select(x => new TundukData
        {
            id = x.id,
            name = x.name,
            name_kg = x.name_kg,
            streetId = x.streetid ?? 0,
            address_unit_name = x.address_unit_name,
            address_unit_id = x.address_unit_id
        }).ToList();
        return res;

        var cacheKey = $"tunduk:allStreets";
        var cached = await _redis.StringGetAsync(cacheKey);
        if (!cached.IsNullOrEmpty)
        {
            return JsonSerializer.Deserialize<List<TundukData>>(cached);
        }
        var response = await _minjustRepository.GetAteStreets(7402);
        var result = new List<TundukData>();
        foreach (var item in response)
        {
            result.Add(new TundukData
            {
                id = item.id,
                name = item.name,
                name_kg = item.nameKg,
                streetId = item.streetId
            });
        }
        var ttlSeconds = 1800;
        await _redis.StringSetAsync(
            cacheKey,
            JsonSerializer.Serialize(result, new JsonSerializerOptions { IgnoreNullValues = true }),
            TimeSpan.FromSeconds(ttlSeconds)
        );
        return result;
    }

    public async Task<List<TundukData>> GetAteStreets(int ateId)
    {
        var streets = await unitOfWork.StreetRepository.GetAteStreets(ateId);
        var res = streets.Select(x => new TundukData
        {
            id = x.id,
            name = x.name,
            name_kg = x.name_kg,
            streetId = x.remote_id ?? 0,
            address_unit_name = x.address_unit_name,
            address_unit_id = x.address_unit_id
        }).ToList();
        return res;


        var cacheKey = $"tunduk:ateStreets:{ateId}";
        var cached = await _redis.StringGetAsync(cacheKey);
        if (!cached.IsNullOrEmpty)
        {
            return JsonSerializer.Deserialize<List<TundukData>>(cached);
        }
        var response = await _minjustRepository.GetAteStreets(ateId);
        var result = new List<TundukData>();
        foreach (var item in response)
        {
            result.Add(new TundukData
            {
                id = item.id,
                name = item.name,
                name_kg = item.nameKg,
                streetId = item.streetId
            });
        }
        var ttlSeconds = 1800;
        await _redis.StringSetAsync(
            cacheKey,
            JsonSerializer.Serialize(result, new JsonSerializerOptions { IgnoreNullValues = true }),
            TimeSpan.FromSeconds(ttlSeconds)
        );
        return result;
    }

    public async Task<TundukSearchAddressResponse> SearchAddress(int streetId, string? building, string? apartment, string? uch)
    {
        //var cacheKey = $"tunduk:searchAddress:{streetId}:{building}:{apartment}:{uch}";
        //var cached = await _redis.StringGetAsync(cacheKey);
        //if (!cached.IsNullOrEmpty)
        //{
        //    return JsonSerializer.Deserialize<TundukSearchAddressResponse>(cached);
        //}
        var response = await _minjustRepository.SearchAddress(streetId, building, apartment, uch);

        for (var i = 0; i < response.list.Count; i++)
        {
            response.list[i].id = i + 1;
        }

        //var ttlSeconds = 1800;
        //await _redis.StringSetAsync(
        //    cacheKey,
        //    JsonSerializer.Serialize(response),
        //    TimeSpan.FromSeconds(ttlSeconds)
        //);
        return response;
    }
}
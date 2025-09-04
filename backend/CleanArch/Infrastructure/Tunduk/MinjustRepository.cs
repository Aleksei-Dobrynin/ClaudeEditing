using System.Text.Json;
using Domain.Entities;
using Microsoft.Extensions.Configuration;
using Application.Repositories;
using Application.Exceptions;

namespace Infrastructure.Tunduk
{
    public class MinjustRepository : IMinjustRepository
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private const int TIMEOUT_SECONDS = 10;

        public MinjustRepository(IConfiguration configuration)
        {
            _configuration = configuration;
            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(TIMEOUT_SECONDS)
            };
        }

        public Task<Customer> GetInfoByPin(string pin)
        {
            var minjustData = _configuration.GetSection("Tunduk:Minjust").Get<List<Customer>>();

            if (minjustData == null)
            {
                return Task.FromResult<Customer>(null);
            }

            var entry = minjustData.FirstOrDefault(x => x.pin == pin);
            return Task.FromResult(entry);
        }

        public async Task<TundukAteChildren> GetAteChildren(int ateId)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Post,
                    "http://5.59.233.124:5789/r1/central-server/GOV/70000019/dkrpni-service/ateChildren?ate_id=" + ateId);
                request.Headers.Add("X-Road-Client", "central-server/GOV/70000086/ais-bga");

                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<TundukAteChildren>(json);
                return result;
            }
            catch (TaskCanceledException ex)
            {
                throw new ServiceUnavailableException(
                    "Сервис Тундук недоступен. Превышено время ожидания ответа.",
                    "Tunduk",
                    true);
            }
            catch (HttpRequestException ex)
            {
                throw new ServiceUnavailableException(
                    "Не удалось подключиться к сервису Тундук.",
                    "Tunduk",
                    false);
            }
        }

        public async Task<List<TundukAteStreets>> GetAteStreets(int ateId)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Post,
                    "http://5.59.233.124:5789/r1/central-server/GOV/70000019/dkrpni-service/ateStreets?ate_id=" + ateId);
                request.Headers.Add("X-Road-Client", "central-server/GOV/70000086/ais-bga");

                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<List<TundukAteStreets>>(json);
                return result;
            }
            catch (TaskCanceledException ex)
            {
                throw new ServiceUnavailableException(
                    "Сервис Тундук недоступен. Превышено время ожидания ответа.",
                    "Tunduk",
                    true);
            }
            catch (HttpRequestException ex)
            {
                throw new ServiceUnavailableException(
                    "Не удалось подключиться к сервису Тундук.",
                    "Tunduk",
                    false);
            }
        }

        public async Task<TundukSearchAddressResponse> SearchAddress(int streetId, string? building, string? apartment, string? uch)
        {
            try
            {
                var streetApi = _configuration.GetSection("Tunduk:StreetApi").Get<string>();
                var xRoadClient = _configuration.GetSection("Tunduk:XRoadClient").Get<string>();

                var request = new HttpRequestMessage(HttpMethod.Post,
                    streetApi + "?streetId=" + streetId + "&building=" + building + "&uchNum=" + uch);
                request.Headers.Add("X-Road-Client", xRoadClient);

                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                var result = JsonSerializer.Deserialize<TundukSearchAddressResponse>(json);
                return result;
            }
            catch (TaskCanceledException ex)
            {
                throw new ServiceUnavailableException(
                    "Сервис Тундук недоступен. Превышено время ожидания ответа.",
                    "Tunduk",
                    true);
            }
            catch (HttpRequestException ex)
            {
                throw new ServiceUnavailableException(
                    "Не удалось подключиться к сервису Тундук.",
                    "Tunduk",
                    false);
            }
        }
    }
}
using System.Data;
using Dapper;
using Domain.Entities;
using Application.Repositories;
using Infrastructure.Data.Models;
using Application.Exceptions;
using Application.Models;
using System;
using System.Text.RegularExpressions;
using System.Xml.Serialization;
using System.Text.Json;
using System.Globalization;

namespace Infrastructure.Repositories
{
    public class MapRepository : IMapRepository
    {
        private readonly IDbConnection _dbConnection;
        private IDbTransaction? _dbTransaction;
        private readonly HttpClient _httpClient;
        private const int TIMEOUT_SECONDS = 10;

        public MapRepository(IDbConnection dbConnection)
        {
            _dbConnection = dbConnection;
            _httpClient = new HttpClient
            {
                Timeout = TimeSpan.FromSeconds(TIMEOUT_SECONDS)
            };
        }

        public void SetTransaction(IDbTransaction dbTransaction)
        {
            _dbTransaction = dbTransaction;
        }

        public async Task<List<AddressInfo>> GetFlats(string propcode)
        {
            try
            {
                var code = propcode.Replace("-", "");
                var request = new HttpRequestMessage(HttpMethod.Get,
                    $"http://darek.kg/Map/GetFlats?propcode={code}&_dc={DateTime.Now.Ticks.ToString()}");

                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();

                var json = await response.Content.ReadAsStringAsync();
                MapDarekInfo root = JsonSerializer.Deserialize<MapDarekInfo>(json);
                return root.List.Select(feature => new AddressInfo
                {
                    Address = feature.Address.ToString(),
                    Propcode = feature.PropCode.ToString()
                }).ToList();
            }
            catch (TaskCanceledException ex)
            {
                throw new ServiceUnavailableException(
                    "Сервис Darek.kg недоступен. Превышено время ожидания ответа.",
                    "Darek.kg",
                    true);
            }
            catch (HttpRequestException ex)
            {
                throw new ServiceUnavailableException(
                    "Не удалось подключиться к сервису Darek.kg.",
                    "Darek.kg",
                    false);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Map darek", ex);
            }
        }

        public async Task<object> SearchAddressesByProp(string propcode)
        {
            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get,
                    $"http://darek.kg/Map/SearchAddressesByPropCodeWMS?_dc={DateTime.Now.Ticks.ToString()}&propcode={propcode}");

                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();

                var xml = await response.Content.ReadAsStringAsync();
                XmlSerializer serializer = new XmlSerializer(typeof(GetFeatureInfoResponse));
                using (StringReader reader = new StringReader(xml))
                {
                    var result = (GetFeatureInfoResponse)serializer.Deserialize(reader);

                    var resultData = result.Layers
                        .SelectMany(layer => layer.Features)
                        .Select(feature => new
                        {
                            Address = feature.Attributes.FirstOrDefault(a => a.Name == "address")?.Value,
                            Propcode = feature.Attributes.FirstOrDefault(a => a.Name == "propcode")?.Value,
                            Geometry = feature.Attributes.FirstOrDefault(a => a.Name == "geometry")?.Value
                        }).FirstOrDefault();

                    if (resultData != null && !string.IsNullOrEmpty(resultData.Geometry))
                    {
                        var coordinates3857 = ParseMultipolygon(resultData.Geometry);
                        var coordinates4326 = ConvertToLatLng(coordinates3857)
                            .Select<(double X, double Y), double[]>(point => new double[] { point.X, point.Y })
                            .ToList();

                        var data = new
                        {
                            resultData.Address,
                            resultData.Propcode,
                            Geometry = JsonSerializer.Serialize(coordinates4326),
                            Info = await GetFlats(propcode)
                        };
                        return data;
                    }
                    return null;
                }
            }
            catch (TaskCanceledException ex)
            {
                throw new ServiceUnavailableException(
                    "Сервис Darek.kg недоступен. Превышено время ожидания ответа.",
                    "Darek.kg",
                    true);
            }
            catch (HttpRequestException ex)
            {
                throw new ServiceUnavailableException(
                    "Не удалось подключиться к сервису Darek.kg.",
                    "Darek.kg",
                    false);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Map darek", ex);
            }
        }

        public async Task<List<AddressInfo>> SearchPropCodes(string propcode)
        {
            try
            {
                const int limit = 30;
                var request = new HttpRequestMessage(HttpMethod.Get,
                    $"http://darek.kg/Map/SearchPropCodes?start=0&limit={limit}&query={propcode}&_dc={DateTime.Now.Ticks.ToString()}&callback=stcCallback1009");

                var response = await _httpClient.SendAsync(request);
                response.EnsureSuccessStatusCode();

                var jsonResponse = await response.Content.ReadAsStringAsync();
                var cleanJson = jsonResponse.Replace("stcCallback1009(", "").TrimEnd(')', ';');
                MapDarekInfoList root = JsonSerializer.Deserialize<MapDarekInfoList>(cleanJson);

                return root.list.Select(feature => new AddressInfo
                {
                    Address = feature.address.ToString(),
                    Propcode = feature.code.ToString(),
                    Id = int.Parse(feature.propaddress_id.ToString())
                }).ToList();
            }
            catch (TaskCanceledException ex)
            {
                throw new ServiceUnavailableException(
                    "Сервис Darek.kg недоступен. Превышено время ожидания ответа.",
                    "Darek.kg",
                    true);
            }
            catch (HttpRequestException ex)
            {
                throw new ServiceUnavailableException(
                    "Не удалось подключиться к сервису Darek.kg.",
                    "Darek.kg",
                    false);
            }
            catch (Exception ex)
            {
                throw new RepositoryException("Failed to get Map darek", ex);
            }
        }

        public static List<(double X, double Y)> ParseMultipolygon(string multipolygon)
        {
            var points = new List<(double X, double Y)>();
            var polygonMatches = Regex.Matches(multipolygon, @"\(\((.*?)\)\)");

            foreach (Match match in polygonMatches)
            {
                var coordinates = match.Groups[1].Value.Replace("(", "");
                foreach (var pair in coordinates.Split(','))
                {
                    var coords = pair.Trim().Split(' ');
                    if (double.TryParse(coords[0], NumberStyles.Float, CultureInfo.InvariantCulture, out double x) && 
                        double.TryParse(coords[1], NumberStyles.Float, CultureInfo.InvariantCulture, out double y))
                    {
                        points.Add((x, y));  // Add the parsed coordinates
                    }
                    else
                    {
                        Console.WriteLine($"Failed to parse x: {coords[0]}, y: {coords[1]}");  // Debugging step
                    }
                }
            }
            return points;
        }
        
        public static List<(double Latitude, double Longitude)> ConvertToLatLng(List<(double X, double Y)> coordinates3857)
        {
            const double EarthRadius = 6378137;
            var coordinates4326 = new List<(double Latitude, double Longitude)>();

            foreach (var (x, y) in coordinates3857)
            {
                double longitude = (x / EarthRadius) * (180 / Math.PI);
                double latitude = (Math.Atan(Math.Exp(y / EarthRadius)) * 360 / Math.PI) - 90;
                coordinates4326.Add((latitude, longitude));
            }

            return coordinates4326;
        }
        
        
        
        
        
        
        
        
        
        
        
        [XmlRoot("GetFeatureInfoResponse")]
        public class GetFeatureInfoResponse
        {
            [XmlElement("BoundingBox")]
            public BoundingBox BoundingBox { get; set; }

            [XmlElement("Layer")]
            public List<Layer> Layers { get; set; }
        }

        public class BoundingBox
        {
            [XmlAttribute("CRS")]
            public string CRS { get; set; }

            [XmlAttribute("maxx")]
            public string MaxX { get; set; }

            [XmlAttribute("minx")]
            public string MinX { get; set; }

            [XmlAttribute("maxy")]
            public string MaxY { get; set; }

            [XmlAttribute("miny")]
            public string MinY { get; set; }

            [XmlAttribute("SRS")]
            public string SRS { get; set; }
        }

        public class Layer
        {
            [XmlAttribute("name")]
            public string Name { get; set; }

            [XmlElement("Feature")]
            public List<Feature> Features { get; set; }
        }

        public class Feature
        {
            [XmlAttribute("id")]
            public string Id { get; set; }

            [XmlElement("Attribute")]
            public List<Attribute> Attributes { get; set; }
        }

        public class Attribute
        {
            [XmlAttribute("name")]
            public string Name { get; set; }

            [XmlAttribute("value")]
            public string Value { get; set; }

            [XmlAttribute("type")]
            public string Type { get; set; }
        }
    }
}



using System.Text.Json.Serialization;
using Newtonsoft.Json;

namespace Infrastructure.Repositories;

public class MapDarekInfo
{
    [JsonPropertyName("list")]
    public List<Property> List { get; set; }
}

public class Property
{
    [JsonPropertyName("propaddress_id")]
    public int PropAddressId { get; set; }

    [JsonPropertyName("propcode")]
    public string PropCode { get; set; }

    [JsonPropertyName("address")]
    public string Address { get; set; }

    [JsonPropertyName("propforuse")]
    public string PropForUse { get; set; }

    [JsonPropertyName("oid")]
    public int? Oid { get; set; }

    [JsonPropertyName("feature")]
    public Feature Feature { get; set; }
}

public class Feature
{
    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("fid")]
    public int Fid { get; set; }

    [JsonPropertyName("properties")]
    public Properties Properties { get; set; }
}

public class Geometry
{
    [JsonPropertyName("type")]
    public string Type { get; set; }

    [JsonPropertyName("coordinates")]
    public List<List<List<List<double>>>> Coordinates { get; set; }
}

public class Properties
{
    [JsonPropertyName("oid")]
    public int Oid { get; set; }

    [JsonPropertyName("propcode")]
    public string PropCode { get; set; }

    [JsonPropertyName("address")]
    public string Address { get; set; }

    [JsonPropertyName("table")]
    public string Table { get; set; }
}

public class MapDarekInfoList
{
    [JsonProperty("totalCount")]
    public int totalCount { get; set; }

    [JsonProperty("list")]
    public List<Address> list { get; set; }
}

public class Address
{
    [JsonProperty("propaddress_id")]
    public int propaddress_id { get; set; }

    [JsonProperty("code")]
    public string code { get; set; }

    [JsonProperty("address")]
    public string address { get; set; }

    [JsonProperty("index")]
    public object index { get; set; }
}
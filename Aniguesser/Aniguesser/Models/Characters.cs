using System;
using System.Collections.Generic;
using System.IO;
using System.Text.Json;
using System.Text.Json.Serialization;

public class DevilFruitInfo
{
    [JsonPropertyName("name")]
    public string? Name { get; set; }
    [JsonPropertyName("type")]
    public string? Type { get; set;}
}
public class OPCharacter
{
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string? Name { get; set; }

    [JsonPropertyName("gender")]
    public string? Gender { get; set; }

    [JsonPropertyName("affiliation")]
    public string? Affiliation { get; set; }

    [JsonPropertyName("devilFruit")]
    public DevilFruitInfo? devilFruit { get; set; }

    [JsonPropertyName("haki")]
    public List<string> HakiTypes { get; set; }

    [JsonPropertyName("bounty")]
    public long? Bounty { get; set; }

    [JsonPropertyName("height")]
    public long? Height { get; set;}

    [JsonPropertyName("origin")]
    public string? Origin { get; set; }

    [JsonPropertyName("Arc")]
    public string? Arc { get; set; }

    

    

    

    

    public OPCharacter()
    {
        HakiTypes = new List<string>();
    }

    public override string ToString()
    {
        return Name ?? "Unknown Character";
    }

}

public class OPCharacterList
{
    [JsonPropertyName("anime")]
    public string? Anime { get; set; }

    [JsonPropertyName("characters")]
    public List<OPCharacter>? Characters { get; set; }
}

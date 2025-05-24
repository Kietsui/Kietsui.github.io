using System.Text.Json;
public class CharacterFileConverter
{
    public OPCharacterList ConvertCharacterJson(string filePath)
    {
        if (!File.Exists(filePath))
        {
            Console.WriteLine("File not found: " + filePath);
            return new OPCharacterList { Characters = new List<OPCharacter>() };
        }

        string json = File.ReadAllText(filePath);
        return JsonSerializer.Deserialize<OPCharacterList>(json);
    }
}

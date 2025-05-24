using System.Data.SQLite;
using System.Formats.Tar;

public class MainMenu
{
    string titleArt = @"
      ___        _                    _ _      
     / _ \      (_)                  | | |     
    / /_\ \_ __  _ _ __ ___   ___  __| | | ___ 
    |  _  | '_ \| | '_ ` _ \ / _ \/ _` | |/ _ \
    | | | | | | | | | | | | |  __/ (_| | |  __/
    \_| |_/_| |_|_|_| |_| |_|\___|\__,_|_|\___|
                                            
                                            
    ";
    public void StartGame()
    {
        Run();
    }

    public void Run()
    {
        ConsoleHelper.SetColor("Red");
        PrintTitle();

        Console.ResetColor();
        Menu();
    }

    public void PrintTitle()
    {
        ConsoleHelper.SetColor("Red");
        Console.WriteLine(titleArt);
    }

    public void Menu()
    {
        Console.WriteLine();
        Console.ResetColor();
        ConsoleHelper.SetColor("Yellow");
        Console.WriteLine("---Which gamemode would you like to play?---");

        ConsoleHelper.SetColor("Cyan");
        Console.WriteLine("1. Guess The Anime");
        Console.WriteLine("2. Guess The Character");

        ConsoleHelper.SetColor("DarkRed");
        Console.WriteLine("0. Quit");

        Console.WriteLine();
        string input = PlayerAnswer();

        ConsoleHelper.SetColor("Blue");
        if (input == "0") { Console.WriteLine("Goodbye!"); Environment.Exit(1); }
        if (input == "1") { GTA(); }
        if (input == "2") { GTC(); }

        Console.ResetColor();
    }

    // Guess The Anime stuff
    private void GTA()
    {
        ConsoleHelper.SetColor("DarkRed");
        Console.WriteLine("Nothing here yet.");
    }

    // Guess The Character anime list
    private void GTC()
    {
        ConsoleHelper.SetColor("Yellow");
        Console.WriteLine("---Choosen an Anime---");

        ConsoleHelper.SetColor("Cyan");
        Console.WriteLine("1. One Piece");
        Console.WriteLine("2. Naruto");
        Console.WriteLine("3. Bleach");
        Console.WriteLine("4. Sword Art Online");
        Console.WriteLine("5. Frieren");
        Console.Write("6. Solo Leveling");

        Console.WriteLine();
        Console.ResetColor();

        string input = PlayerAnswer();
        var converter = new CharacterFileConverter();

        switch (input)
    {
        case "1":
            var characterList = converter.ConvertCharacterJson(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DataFiles", "CharactersOnePiece.json"));
            var gameManager = new GameManager();
            gameManager.OnePieceGame(characterList);
            break;
        case "2":
            converter.ConvertCharacterJson(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DataFiles", "CharactersNaruto.json"));
            break;
        case "3":
            converter.ConvertCharacterJson(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DataFiles", "CharactersBleach.json"));
            break;
        case "4":
            converter.ConvertCharacterJson(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DataFiles", "CharactersSAO.json"));
            break;
        case "5":
            converter.ConvertCharacterJson(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DataFiles", "CharactersFrieren.json"));
            break;
        case "6":
            converter.ConvertCharacterJson(Path.Combine(AppDomain.CurrentDomain.BaseDirectory, "DataFiles", "CharactersSoloLeveling.json"));
            break;
        default:
            ConsoleHelper.SetColor("Red");
            Console.WriteLine("Invalid input. Please select a number from 1 to 6.");
            Console.ResetColor();
            break;
    }
    }


    // Choose game mode method
    private string PlayerAnswer()
    {
        Console.WriteLine();
        Console.ForegroundColor = ConsoleColor.Yellow;
        Console.WriteLine(" ---Enter game mode number--- ");

        Console.ForegroundColor = ConsoleColor.Green;
        Console.Write("Your Answer: ");
        Console.ForegroundColor = ConsoleColor.White;

        string? input = Console.ReadLine();

        Console.WriteLine();
        Console.ResetColor();

        while (string.IsNullOrWhiteSpace(input) || ContainsLetters(input))
        {
            Console.ForegroundColor = ConsoleColor.White;
            if (string.IsNullOrWhiteSpace(input))
            {
                Console.Write("Name cannot be empty. ");
                Console.ForegroundColor = ConsoleColor.Green;
                Console.Write("Please enter a valid number: ");
            }
            else
            {
                Console.Write("Name cannot contain letters. ");
                Console.ForegroundColor = ConsoleColor.Green;
                Console.Write("Please enter a valid number: ");
            }

            Console.ForegroundColor = ConsoleColor.White;
            input = Console.ReadLine();

            Console.ResetColor();
            Console.WriteLine();
        }

        return input;
    }

    private bool ContainsLetters(string input)
    {
        foreach (char c in input)
        {
            if (char.IsLetter(c))
            {
                return true;
            }
        }
        return false;
    }
}
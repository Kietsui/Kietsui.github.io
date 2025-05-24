public class GameManager
{
    public void OnePieceGame(OPCharacterList characterList)
    {
        var random = new Random();
        var characters = characterList.Characters;

        if (characters == null || characters.Count == 0)
        {
            Console.WriteLine("Character list is empty.");
            return;
        }

        var target = characters[random.Next(characters.Count)];
        Console.WriteLine($"[Debug] Target character: {target}");
        PlayGameLoopOnePiece(target, characters);
    }

    private void PlayGameLoopOnePiece(OPCharacter target, List<OPCharacter> allCharacters)
    {
        while (true)
        {
            Console.Write("Enter your guess (character name): ");
            string? guessName = Console.ReadLine()?.Trim();

            var guess = allCharacters.FirstOrDefault(c =>
                c.Name != null &&
                c.Name.Equals(guessName, StringComparison.OrdinalIgnoreCase));

            if (guess == null)
            {
                Console.WriteLine("Character not found. Try again.");
                Console.WriteLine();
                continue;
            }

            ShowFeedback(target, guess);

            if (guess.Name == target.Name)
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.WriteLine();
                Console.WriteLine("Correct! You guessed the character!");
                Console.ReadLine();
                Console.ResetColor();
                break;
            }
        }
    }

    private void ShowFeedback(OPCharacter target, OPCharacter guess)
    {
        CharacterComparator.ShowFeedback(target, guess);
    }
}
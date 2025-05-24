using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;

public static class CharacterComparator
{
    public static void ShowFeedback(OPCharacter target, OPCharacter guess)
    {
        Console.WriteLine();

        CompareGender(target.Gender, guess.Gender);
        CompareAffiliation(target.Affiliation, guess.Affiliation);
        CompareDevilFruitName(target.devilFruit, guess.devilFruit);
        CompareDevilFruitType(target.devilFruit, guess.devilFruit);
        CompareHaki(target.HakiTypes, guess.HakiTypes);
        CompareBounty(target.Bounty, guess.Bounty);
        CompareHeight(target.Height, guess.Height);
        CompareOrigin(target.Origin, guess.Origin);
        //CompareArc(target.Arc, guess.Arc);

        Console.WriteLine("----------------------------");
    }

    private static void CompareGender(string? targetGender, string? guessedGender)
    {
        ConsoleHelper.SetColor("Cyan");
        Console.Write("Gender: ");

        //if gender is different - red
        if (targetGender != guessedGender)
        {
            ConsoleHelper.SetColor("Red");
            Console.Write($"{guessedGender}");
        }
        else
        {
            ConsoleHelper.SetColor("Green");
            Console.Write(guessedGender);
        }

        Console.ResetColor();
        Console.WriteLine();
    }
    private static void CompareAffiliation(string? targetAffiliation, string? guessedAffiliation)
    {
        ConsoleHelper.SetColor("Cyan");
        Console.Write("Affiliation: ");

        // if Affiliation is same - green
        if (targetAffiliation == guessedAffiliation)
        {
            ConsoleHelper.SetColor("Green");
            Console.Write(guessedAffiliation);
        }
        //if Affiliation is different or null - red
        if (targetAffiliation != guessedAffiliation || targetAffiliation == null)
        {
            ConsoleHelper.SetColor("Red");
            Console.WriteLine(guessedAffiliation);
        }

        Console.ResetColor();
        Console.WriteLine();
    }
    private static void CompareDevilFruitName(DevilFruitInfo? targetFruit, DevilFruitInfo? guessedFruit)
    {
        ConsoleHelper.SetColor("Cyan");
        Console.Write("Devil Fruit Name: ");

        if (targetFruit?.Name == null && guessedFruit?.Name == null)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("None ✓");
        }
        else if (targetFruit?.Name == null)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write($"{guessedFruit?.Name ?? "Unknown"}");
        }
        else if (guessedFruit?.Name == null)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write("None");
        }
        else if (string.Equals(targetFruit.Name, guessedFruit.Name, StringComparison.OrdinalIgnoreCase))
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write($"{guessedFruit.Name} ✓");
        }
        else
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write($"{guessedFruit.Name}");
        }

        Console.ResetColor();
        Console.WriteLine();
    }
    private static void CompareDevilFruitType(DevilFruitInfo? targetFruit, DevilFruitInfo? guessedFruit)
    {
        ConsoleHelper.SetColor("Cyan");
        Console.Write("Devil Fruit Type: ");

        if (targetFruit?.Type == null && guessedFruit?.Type == null)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("None ✓");
        }
        else if (targetFruit?.Type == null)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write($"{guessedFruit?.Type ?? "Unknown"}");
        }
        else if (guessedFruit?.Type == null)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write("X");
        }
        else if (string.Equals(targetFruit.Type, guessedFruit.Type, StringComparison.OrdinalIgnoreCase))
        {
            Console.ForegroundColor = ConsoleColor.DarkYellow;
            Console.Write($"{guessedFruit.Type}");
        }
        else
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write($"{guessedFruit.Type} X");
        }

        Console.ResetColor();
        Console.WriteLine();
    }
    private static void CompareHaki(List<string>? targetHaki, List<string>? guessedHaki)
    {
        targetHaki ??= new List<string>();
        guessedHaki ??= new List<string>();

        bool targetHasHaki = targetHaki.Count > 0;
        bool guessHasHaki = guessedHaki.Count > 0;

        ConsoleHelper.SetColor("Cyan");
        Console.Write("Haki: ");

        if (!targetHasHaki && !guessHasHaki)
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("None");
        }
        else if (!targetHasHaki && guessHasHaki)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write(string.Join(", ", guessedHaki));
        }
        else if (targetHasHaki && !guessHasHaki)
        {
            Console.ForegroundColor = ConsoleColor.Red;
            Console.Write("None");
        }
        else
        {
            var matched = guessedHaki.Intersect(targetHaki).ToList();

            if (matched.Count == targetHaki.Count && guessedHaki.Count == targetHaki.Count)
            {
                Console.ForegroundColor = ConsoleColor.Green;
                Console.Write(string.Join(", ", guessedHaki));
            }
            else
            {
                Console.ForegroundColor = ConsoleColor.Yellow;
                Console.Write(string.Join(", ", guessedHaki));
            }
        }

        Console.ResetColor();
        Console.WriteLine();
    }
    private static void CompareBounty(long? targetBounty, long? guessedBounty)
    {
        ConsoleHelper.SetColor("Cyan");
        Console.Write("Bounty: ");

        // if both are null or zero - green
        if ((!targetBounty.HasValue || targetBounty == 0) &&
            (!guessedBounty.HasValue || guessedBounty == 0))
        {
            Console.ForegroundColor = ConsoleColor.Green;
            Console.Write("None ✓");
        }
        // if target has no bounty and guess has - red down arrow
        else if (!targetBounty.HasValue || targetBounty == 0)
        {
            ConsoleHelper.SetColor("Red");
            Console.Write($"{guessedBounty} ▼");
        }
        // if guess has no bounty and target does - red up arrow
        else if (!guessedBounty.HasValue || guessedBounty == 0)
        {
            ConsoleHelper.SetColor("Red");
            Console.Write("None ");
        }
        // exact match - green
        else if (guessedBounty == targetBounty)
        {
            ConsoleHelper.SetColor("Green");
            Console.Write($"{guessedBounty} ✓");
        }
        // guess too low - red up arrow
        else if (guessedBounty < targetBounty)
        {
            ConsoleHelper.SetColor("Red");
            Console.Write($"{guessedBounty} ");
        }
        // guess too high - red down arrow
        else
        {
            ConsoleHelper.SetColor("Red");
            Console.Write($"{guessedBounty} ▼");
        }

        Console.ResetColor();
        Console.WriteLine();
    }
    private static void CompareHeight(long? targetHeight, long? guessedHeight)
    {
        ConsoleHelper.SetColor("Cyan");
        Console.Write("Height: ");

        //
        if (targetHeight == guessedHeight)
        {
            ConsoleHelper.SetColor("Green");
            Console.Write($"{guessedHeight} cm");
        }
        // 
        else if (targetHeight < guessedHeight)
        {
            ConsoleHelper.SetColor("Red");
            Console.Write($"{guessedHeight} cm ▼");
        }
        //if 
        else
        {
            ConsoleHelper.SetColor("Red");
            Console.Write($"{guessedHeight} cm ▲");
        }
        

        Console.ResetColor();
        Console.WriteLine();
    }
    private static void CompareOrigin(string? targetOrigin, string? guessedOrigin)
    {
        ConsoleHelper.SetColor("Cyan");
        Console.Write("Origin: ");

        //if origin is different - red
        if (targetOrigin != guessedOrigin)
        {
            ConsoleHelper.SetColor("Red");
            Console.Write($"{guessedOrigin}");
        }
        else
        {
            ConsoleHelper.SetColor("Green");
            Console.Write(guessedOrigin);
        }

        Console.ResetColor();
        Console.WriteLine();
    }
    private static void CompareArc(string? targetArc, string? guessedArc)
    {

    }   
}

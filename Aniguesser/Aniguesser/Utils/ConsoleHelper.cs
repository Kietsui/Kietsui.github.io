public class ConsoleHelper
{
    public static void SetColor(string colorName)
    {
        if (Enum.TryParse(typeof(ConsoleColor), colorName, true, out var color))
        {
            Console.ForegroundColor = (ConsoleColor)color;
        }
        else
        {
            Console.WriteLine($"Invalid color: {colorName}");
        }
    }
}
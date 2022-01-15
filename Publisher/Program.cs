using StackExchange.Redis;
using System;

namespace Publisher
{
    class Program
    {
        static void Main(string[] args)
        {
            using (ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("127.0.0.1:6379"))
            {

                ISubscriber sub = redis.GetSubscriber();
                Console.WriteLine("please enter any character and exit to exit");
                string input;
                Console.WriteLine("Unesi autobus:");
                string channel = Console.ReadLine();
                do
                {
                    input = Console.ReadLine();
                    if (input == "change")
                    {
                        Console.WriteLine("Unesi novi autobus:");
                        channel = Console.ReadLine();
                        continue;
                    }
                    sub.Publish(channel, input);
                } while (input != "exit");
            }
        }
    }
}

using StackExchange.Redis;
using System;
using System.Threading.Tasks;

namespace ChatManager
{
    class Program
    {

        public static async Task Subsctibe()
        {
            using (ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("127.0.0.1:6379"))
            {
                ISubscriber sub = redis.GetSubscriber();

                sub.Subscribe("chatMessage", (channel, message) =>
                  Console.WriteLine(message)
                ) ;

                while(true)
                Console.ReadKey();
            }
            return;
        }


        public static void publishMessage(string user, string message)
        {
            using (ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("127.0.0.1:6379"))
            {
                ISubscriber sub = redis.GetSubscriber();         
                sub.Publish("charMessageReply", user+"##"+message);
            }
        }
        static void Main(string[] args)
        {
            Task.Run(Subsctibe);

            string text="";
            Console.WriteLine("Format:[id korisnika] [tekst poruke]");
            do
            {
                text = Console.ReadLine();
                string[] spl = text.Split(" ", 2);
                if (spl.Length < 2)
                {
                    Console.WriteLine("Nepravilan unos!");
                }
                publishMessage(spl[0], spl[1]);

            }
            while (text != "exit");
        }


       
    }
}

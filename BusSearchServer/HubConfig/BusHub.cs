using Microsoft.AspNetCore.SignalR;
using Neo4j.Driver;
using Neo4jClient;
using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusSearchServer.HubConfig
{
    public class BusHub : Hub
    {
        static private ISubscriber sub = null;

        public async Task SendMessage(string user, string message)
        {
            Console.WriteLine(user);

            using (ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("127.0.0.1:6379"))
            {
                ISubscriber sub = redis.GetSubscriber();
                sub.Publish("chatMessage", "Poruka od klijenta ID: " + user + ": " + message);
            }
        }

    }
}

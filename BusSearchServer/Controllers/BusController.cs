using BusSearchServer.HubConfig;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Neo4j.Driver;
using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using BusSearchServer.Controllers;

namespace BusSearchServer.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class BusController : ControllerBase
    {
        private IHubContext<BusHub> _hub;
        private static ISubscriber sub = null;
        private static FuncController f = new FuncController();
        public BusController(IHubContext<BusHub> hub)
        {
            _hub = hub;
        }

      //  [HttpGet]
        public IActionResult Get(string s)
        {
            if (sub!=null)
            {
                return Ok(new { Message = "Request Completed" });
            }
            using (ConnectionMultiplexer redis = ConnectionMultiplexer.Connect("127.0.0.1:6379"))
            {
                sub = redis.GetSubscriber();

                List<string> list =  getCityLines().Result;

                sub.Subscribe("charMessageReply", (channel, message) =>
                        {
                            string[] spl = message.ToString().Split("##",2);
                            _hub.Clients.All.SendAsync(spl[0], spl[1]);
                        }    
                    );

                foreach (string element in list)
                {
                    sub.Subscribe(element, (channel, message) => 
                      _hub.Clients.All.SendAsync(element, message.ToString())
                    );
                }
                Console.WriteLine("subscribed messages");
                Console.ReadKey();
            }
            return Ok(new { Message = "Request Completed" });
        }
      
        private  async Task<List<string>>getCityLines()
        {
            IDriver _driver = GraphDatabase.Driver("bolt://localhost", AuthTokens.Basic("neo4j", "bussearch"));
            IResultCursor cursor;
            using (var session = _driver.AsyncSession(new Action<SessionConfigBuilder>(target => { target.WithDatabase("bussearchdbms"); })))
            {
                cursor = await session.RunAsync(@"Match(c:City)-[r]-(l:Line) return c.name+l.name as name");
                return await cursor.ToListAsync(s => s["name"] as string);
            }
        }

    /*    [HttpGet]
        private async Task<int> getTime(string current, string end, string line)
        {
          //  string trenutna = "Mokranjceva";//iz redis
            IDriver _driver = GraphDatabase.Driver("bolt://localhost", AuthTokens.Basic("neo4j", "password"));
            IResultCursor cursor;
            string q1 = @"Match(n:Line{name:'" + line + "'})-[r]-(m:Station)" +
                       "where exists {Match(n1:Line{name:'" + line + "'})-[r1]-(m1:Station" +
                       "{name:'" + current + "'}) where  r.sn>r1.sn} " +
                       "and exists {Match(n1:Line{name:'" + line + "'})-[r1]-(m1:Station{name:'" + end + "'}) where  r.sn<r1.sn}return m.name as name";
            List<string> lista;
            string q = "";

            using (var session = _driver.AsyncSession(new Action<SessionConfigBuilder>(target => { target.WithDatabase("bussearchdbms"); })))
            {
                // Dictionary<string, object> parametri = new Dictionary<string, object> { { "grad", City }, { "stanica", Station } };
                //Console.WriteLine(q);

                cursor = await session.RunAsync(q1);
                lista = await cursor.ToListAsync(s => s["name"].As<string>());
                lista.Insert(0, current);
                lista.Add(end);
                for (int i = 0; i < lista.Count - 1; i++)
                {
                    if (i < (lista.Count - 2))
                    {
                        q += "MATCH(:Station{ name:'" + lista[i] + "'})-[r] - (: Station {name: '" + lista[i + 1] + "'})RETURN r.time AS time UNION ALL ";
                    }
                    else
                    {
                        q += "MATCH(:Station{ name:'" + lista[i] + "'})-[r] - (: Station{name: '" + lista[i + 1] + "'}) RETURN r.time AS time";
                    }
                }
                cursor = await session.RunAsync(q);
                List<int> l = await cursor.ToListAsync(s => s["time"].As<int>());
                return l.Sum();
            }
        }*/
    }
}

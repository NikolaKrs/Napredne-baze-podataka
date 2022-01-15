using BusSearchServer.HubConfig;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Neo4j.Driver;
using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BusSearchServer.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class FuncController : ControllerBase
    { 
        public FuncController() { }

        [HttpGet]
        [Route("getcities")]
        public async Task<string> getCities()
        {
            IDriver _driver = GraphDatabase.Driver("bolt://localhost", AuthTokens.Basic("neo4j", "bussearch"));
            IResultCursor cursor;
            using (var session = _driver.AsyncSession(new Action<SessionConfigBuilder>(target => { target.WithDatabase("bussearchdbms"); })))
            {    
                cursor = await session.RunAsync(@"MATCH(n:City) RETURN n as p");
                Console.WriteLine( );
                return JsonConvert.SerializeObject(await cursor.ToListAsync(s => s["p"].As<INode>().Properties));
            }
        }

        [HttpGet]
        [Route("getCityLines")]
        public async Task<string> getBusLines(string City)
        {
            IDriver _driver = GraphDatabase.Driver("bolt://localhost", AuthTokens.Basic("neo4j", "bussearch"));
            IResultCursor cursor;
            using (var session = _driver.AsyncSession(new Action<SessionConfigBuilder>(target => { target.WithDatabase("bussearchdbms"); })))
            {
                Dictionary<string, object> parametri = new Dictionary<string, object> { { "grad", City } };
                cursor = await session.RunAsync(@"MATCH (:City {name: $grad})--(l:Line)RETURN l as p", parametri);
                return JsonConvert.SerializeObject(await cursor.ToListAsync(s => s["p"].As<INode>().Properties));
            }
        }
        [HttpGet]
        [Route("getCityLineStations")]
        public async Task<string> getStations(string City, string Line)
        {
            IDriver _driver = GraphDatabase.Driver("bolt://localhost", AuthTokens.Basic("neo4j", "bussearch"));
            IResultCursor cursor;
            using (var session = _driver.AsyncSession(new Action<SessionConfigBuilder>(target => { target.WithDatabase("bussearchdbms"); })))
            {
                Dictionary<string, object> parametri = new Dictionary<string, object> { { "grad", City }, { "linija", Line } };
                cursor = await session.RunAsync(@"MATCH (:City {name: $grad})--(l:Line{ name: $linija})--(s:Station) RETURN s as p", parametri);
                return JsonConvert.SerializeObject(await cursor.ToListAsync(s => s["p"].As<INode>().Properties));
            }
        }
        [HttpGet]
        [Route("getCityStations")]
        public async Task<string> getCityStations(string City)
        {
            IDriver _driver = GraphDatabase.Driver("bolt://localhost", AuthTokens.Basic("neo4j", "bussearch"));
            IResultCursor cursor;
            using (var session = _driver.AsyncSession(new Action<SessionConfigBuilder>(target => { target.WithDatabase("bussearchdbms"); })))
            {
                Dictionary<string, object> parametri = new Dictionary<string, object> { { "grad", City } };
                cursor = await session.RunAsync(@"MATCH (:City {name: $grad})--(l:Line)--(s:Station) RETURN s as p", parametri);
                return JsonConvert.SerializeObject(await cursor.ToListAsync(s => s["p"].As<INode>().Properties));
            }
        }
        [HttpGet]
        [Route("getStationLines")]
        public async Task<string> getStationsLines(string City, string Station)
        {
            IDriver _driver = GraphDatabase.Driver("bolt://localhost", AuthTokens.Basic("neo4j", "bussearch"));
            IResultCursor cursor;
            using (var session = _driver.AsyncSession(new Action<SessionConfigBuilder>(target => { target.WithDatabase("bussearchdbms"); })))
            {
                Dictionary<string, object> parametri = new Dictionary<string, object> { { "grad", City }, { "stanica", Station } };
                cursor = await session.RunAsync(@"MATCH (c:City {name: $grad})--(l:Line)--(s:Station{name:$stanica}) RETURN l as p", parametri);
                return JsonConvert.SerializeObject(await cursor.ToListAsync(s => s["p"].As<INode>().Properties));
            }
        }
        [HttpGet]
        [Route("getStationTimes")]
        public async Task<string> getStationTimes(string City, string Line)
        {
            IDriver _driver = GraphDatabase.Driver("bolt://localhost", AuthTokens.Basic("neo4j", "bussearch"));
            IResultCursor cursor;
            using (var session = _driver.AsyncSession(new Action<SessionConfigBuilder>(target => { target.WithDatabase("bussearchdbms"); })))
            {
                Dictionary<string, object> parametri = new Dictionary<string, object> { { "grad", City }, { "linija", Line } };
                cursor = await session.RunAsync(@"MATCH(c:City{name: $grad})-[cr]-(l:Line{name: $linija})-[r]-(m:Station)-[r1]->(m1:Station)-[r2]-(l:Line{name: $linija})
                     return  m.name as start,r1.time as time order by r2.sn
                     union Match(c: City{ name: $grad})-[cr]-(l1: Line{ name: $linija})-[r5] - (s5: Station) < -[r6] - (s6: Station)
                     return s5.name as start, 0 as time order by r5.sn desc limit 1"
                    ,parametri);
                return JsonConvert.SerializeObject(await cursor.ToListAsync(el=> el.Values));
            }
        }

       /* [HttpGet]
        [Route("getTime")]
        public async Task<int> getTime(string end, string line)
        {
            string trenutna = "Mokranjceva";//iz redis
            IDriver _driver = GraphDatabase.Driver("bolt://localhost", AuthTokens.Basic("neo4j", "bussearch"));
            IResultCursor cursor;
            string q1 = @"Match(n:Line{name:'" + line + "'})-[r]-(m:Station)" +
                       "where exists {Match(n1:Line{name:'" + line + "'})-[r1]-(m1:Station" +
                       "{name:'" + trenutna + "'}) where  r.sn>r1.sn} " +
                       "and exists {Match(n1:Line{name:'" + line + "'})-[r1]-(m1:Station{name:'" + end + "'}) where  r.sn<r1.sn}return m.name as name";
            List<string> lista;
            string q = "";

            using (var session = _driver.AsyncSession(new Action<SessionConfigBuilder>(target => { target.WithDatabase("bussearchdbms"); })))
            {
                cursor = await session.RunAsync(q1);
                lista = await cursor.ToListAsync(s => s["name"].As<string>());
                lista.Insert(0, trenutna);
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

        [HttpGet]
        [Route("createCity")]
        public async Task<IActionResult> createCity(string City, double lat, double lng)
        {
            IDriver _driver = GraphDatabase.Driver("bolt://localhost", AuthTokens.Basic("neo4j", "bussearch"));
            IResultCursor cursor;
            using (var session = _driver.AsyncSession(new Action<SessionConfigBuilder>(target => { target.WithDatabase("bussearchdbms"); })))
            {
                Dictionary<string, object> parametri = new Dictionary<string, object> { { "grad", City }, { "_lat", lat }, { "_lng", lng } };
                cursor = await session.RunAsync(@"Create (c:City{name:$grad,lat:$_lat,lng:$_lng}) return c.name as name", parametri);
                Console.WriteLine(City);
                if (((await cursor.ToListAsync(s => s["name"] as string)).Count > 0))
                {
                    return Ok(200);
                }
                else
                {
                    return BadRequest();
                }
            }
        }

        [HttpGet]
        [Route("createStation")]
        public async Task<IActionResult> createStation(string City, string stationPrevious, string stationNew,double lat,double lng, string Line, int t1, int t2)
        {
            IDriver _driver = GraphDatabase.Driver("bolt://localhost", AuthTokens.Basic("neo4j", "bussearch"));
            IResultCursor cursor;
            using (var session = _driver.AsyncSession(new Action<SessionConfigBuilder>(target => { target.WithDatabase("bussearchdbms"); })))
            {
                Dictionary<string, object> parametri = new Dictionary<string, object> { { "grad", City }, { "linija", Line }, { "stanicaPrethodna", stationPrevious }, { "novaStanica", stationNew }, { "vreme1", t1 }, { "vreme2", t2 },{ "lat", lat}, { "lng", lng} };
                if (stationPrevious == "Nema")
                { 
                    Console.WriteLine("Nema");
                    cursor = await session.RunAsync(@"match(c:City{name:$grad})-[r]-(l:Line{name:$linija})
                                                    create(l) -[m: HAS{ sn: 1}]->(s: Station{ name: $novaStanica,lat: $lat,lng: $lng})
                                                    return s.name as name",parametri);
                }
                 else
                    cursor = await session.RunAsync(@"MATCH (c:City{name:$grad})-[g]-(l:Line)-[r]-(m:Station)
                                                where m.name=$stanicaPrethodna and l.name=$linija
                                                with r.sn as rb,l as linija,m as prethodna

                                                Create (linija)-[r:HAS{sn:rb+1}]->(ss:Station{name:$novaStanica,lat:$lat,lng:$lng})<-[p:TIME{time:$vreme1}]-(prethodna)
                                                with linija,rb,ss as nova,prethodna

                                                match(linija)-[r1]-(k:Station)
                                                where r1.sn=rb+1 and k.name<>$novaStanica
                                                Create(nova) -[r2: TIME{ time:$vreme2}]->(k)
                                                with linija,rb,nova,prethodna,k as sledeca

                                                match(prethodna)-[r]-(sledeca)
                                                delete r
                                                with linija,rb,nova

                                                MATCH(linja) -[r] - (m: Station)
                                                where r.sn > rb and m.name<> nova.name
                                                set r.sn = r.sn + 1 
                                                return nova.name as name limit 1 
                                                union MATCH(n:Station{name:$novaStanica}) 
                                                return n.name as name", parametri);


               
                if (((await cursor.ToListAsync(s => s["name"] as string)).Count > 0))
                {
                    return Ok(200);
                }
                else
                {
                    return BadRequest();
                }
            }
        }


    }
}

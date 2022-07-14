# Realtime-bus-tracking---Demo-project
Technologies Neo4J, Redis, Angular, .NET

The project is a realtime bus tracking app.

The client part of the application is resolute in Angular. Enables the user interface and communicates with the backend application.
Realtime communication is done with socketIO library, which enables automatic updating of data on the page.

The service that serves the client application is written in Node-js. Implements the SocketIO library by which it sends data to the client.
It communicates with the Neo4J graph base, where cities, stations and buses are guarded as noodles, a line forms as moves in a graph that has a time dimension.
It is also implementing a redis database to demonstrate the publish-subscriber mechanism. It makes live chat with the dispatcher and push notations.

The project also includes a .NET application that simulates the movement of buses. It sends realtime coordinates using the SIgnalR library.
This project is incomplete because it was made as a demo.

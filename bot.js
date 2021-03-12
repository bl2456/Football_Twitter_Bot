const footballConfig = require('./api-football-config.js');
const fetch = require("node-fetch");
//`${game.teams.home.name} ${game.score.fulltime.home}-${game.score.fulltime.away} ${game.teams.away.name}`



const runBot = async () =>{
    let data = await fetch("https://v3.football.api-sports.io/fixtures?league=3&season=2020&date=2021-03-11&timezone=America/New_York", {
        method: "GET",
        headers: footballConfig
    });
    let res = await data.json();
    console.log(res);
    res.response.forEach(game => {
        console.log(`${game.teams.home.name} ${game.score.fulltime.home}-${game.score.fulltime.away} ${game.teams.away.name}`);
    });

    
}

runBot();
const Twit = require('twit')
const footballConfig = require('./api-football-config.js');
const fetch = require("node-fetch");
//`${game.teams.home.name} ${game.score.fulltime.home}-${game.score.fulltime.away} ${game.teams.away.name}`
const config = require('./config.js');

const ucl = 2;
const uel = 3;
const prem = 39;

const season = 2020;

let T = new Twit(config);

let tweet = '';

const getData = async (league,season,date) =>{
    console.log('inside getData');
    let data = await fetch(`https://v3.football.api-sports.io/fixtures?league=${league}&season=${season}&date=${date}&timezone=America/New_York`, {
        method: "GET",
        headers: footballConfig
    });
    console.log('made get request');
    let res = await data.json();
    console.log(res);
    return res.response;
}

const getFixtures = async() => {
    let todayDate = new Date().toISOString().slice(0,10);
    //let todayDate ='2021-03-13';
    console.log('inside getFixtures');
    prem_fixtures = await getData(prem, season, todayDate);
    //console.log(url_fixtures);
    //delaying b/c api recommends that i make 1 request per minute max
    await delay(60000);
    ucl_fixtures = await getData(ucl, season, todayDate);
    await delay(60000);
    uel_fixtures = await getData(uel, season, todayDate);
    return [ucl_fixtures, uel_fixtures, prem_fixtures];
}

async function tweetFixtures(games){
    for (let i = 0; i < games.length; i++) {
        let game = games[i];
        tweet = '';
        let league = game.league.name;
        let time = new Date(game.fixture.date);
        let hour = addZero(time.getHours());
        let minute = addZero(time.getMinutes());
        let referee = game.fixture.referee;
        let stadium = game.fixture.venue.name;
        let location = game.fixture.venue.city;
        tweet += `${game.teams.home.name} vs. ${game.teams.away.name}\n\nLeague: ${league}\nTime: ${hour}:${minute} EST\nVenue: ${stadium}\nLocation: ${location}\nReferee: ${referee}\n`;
        console.log("about to tweet");
        T.post('statuses/update', { status: tweet }, tweeted);
        console.log("going into minute delay");
        await delay(60000);
    }
    console.log('getting out of tweetFixtures');
}

const fixtures = async() =>{
    [ucl_fixtures, uel_fixtures, prem_fixtures] = await getFixtures();
    console.log('inside fixtures');
    if (prem_fixtures.length !== 0){
        await tweetFixtures(prem_fixtures);
    }
    if (ucl_fixtures.length !== 0){
        await tweetFixtures(ucl_fixtures);
    }
    if (uel_fixtures.length !== 0){
        await tweetFixtures(uel_fixtures);
    }
}

function tweeted(error, data, response){
    if(error){
        console.log(error);
    }
    else {
        console.log("what an amazing bot, here's your latesting tweet " + data.text);
    }
}

const delay = (time) => {
    return new Promise(res => {
      setTimeout(res,time);
    });
}

function addZero(i) {
    if (i < 10) {
      i = "0" + i;
    }
    return i;
}

fixtures();
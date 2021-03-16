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

const tweetResults = async (games, leagueName, hashtag) =>{
    tweet =  `${leagueName} Full-Time Results: \n \n`;
    games.forEach(game => {
        tweet += `${game.teams.home.name} ${game.score.fulltime.home}-${game.score.fulltime.away} ${game.teams.away.name}\n`;
    });
    tweet += `\n#${hashtag}`;
    console.log(tweet);
    T.post('statuses/update', { status: tweet }, tweeted);
    await delay(60000);
}

function tweeted(error, data, response){
    if(error){
        console.log(error);
    }
    else {
        console.log("what an amazing bot, here's your latesting tweet " + data.text);
    }
}

const results = async() =>{
    [ucl_fixtures, uel_fixtures, prem_fixtures] = await getFixtures();
    console.log('inside results');
    if (prem_fixtures.length !== 0){
        await tweetResults(prem_fixtures, 'English Premier League', 'EPL');
    }
    if (ucl_fixtures.length !== 0){
        await tweetResults(ucl_fixtures, 'Uefa Champions League', 'UCL');
    }
    if (uel_fixtures.length !== 0){
        await tweetResults(uel_fixtures, 'Uefa Europa League', 'UEL');
    }
}

const delay = (time) => {
    return new Promise(res => {
      setTimeout(res,time);
    });
}

results();

import * as dotenv from 'dotenv'
import * as http from 'node:http'
import nodeFetch from 'node-fetch'
import { faker } from '@faker-js/faker';
dotenv.config()

if (!globalThis.fetch === undefined){
    // @ts-ignore
    globalThis.fetch = nodeFetch;
}

/**
 * 
 * @typedef {{ 
 * coord?: { 
 * lon: number, 
 * lat: number 
 * }, 
 * weather?: Array<{ 
 * id: number, 
 * main: string, 
 * description: string, 
 * icon: string 
 * }>, 
 * base?: string, 
 * main?: { 
 * temp: number, 
 * feels_like: number, 
 * temp_min: number, 
 * temp_max: number,
 * pressure: number, 
 * humidity: number, 
 * sea_level: number, 
 * grnd_level: number
 * }, 
 * visibility?: number, 
 * wind?: { 
 * speed: number, 
 * deg: number 
 * }, 
 * clouds?: { 
 * all: number 
 * }, 
 * dt?: number,
 * sys?: {
 * type: number, 
 * id: number, 
 * country: string, 
 * sunrise: number,
 * sunset: number 
 * }, 
 * timezone?: number, 
 * id?: number,
 * name?: string, 
 * cod: number 
 * message?: string
 * }} OpenWeatherMapResponse
 */


/**
 * 
 * @param {string} city 
 * @returns {Promise<OpenWeatherMapResponse>}
 */




async function  getWeatherForCity(city){
    const OPENWEATHER_API_KEY = process.env.WEATHER_API_KEY
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`)
    const json = await response.json()
    return json
}


/**
 * 
 * @param {Date | number | string} date 
 * @param {Intl.DateTimeFormatOptions} [options]
 * @returns {string}
 */

function formatDate(date, options){
    date = new Date(date)
    /**
     * @type {Intl.DateTimeFormatOptions}
     */
    options ={
        timeStyle: 'short',
        ...options

    }
    return new Intl.DateTimeFormat('en-US', options).format(date)
}

const app = async (request, response) => {
    const city = faker.location.city()
    const weather = await getWeatherForCity(city)
    response.writeHead(200, {'content-type' : 'text/html'})
    response.end(`<!DOCTYPE html>
    <html lang="en">
        <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <title>Friendly Forecast</title>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16'><text x='0' y='14'>🌈</text></svg>">
        <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.0.0/dist/css/bootstrap.min.css" integrity="sha384-Gn5384xqQ1aoWXA+058RXPxPg6fy4IWvTNh0E263XmFcJlSAwiGgFAW/dAiS6JXm" crossorigin="anonymous">
        <link rel="stylesheet" href="style.css">
        </head>
        
        <body>
            <main>
                <h1>${city}</h1>
                <h2>Current weather for ${city} on ${formatDate(weather.dt)}</h2>
                ${weather.cod !== 200 ? `<p>${weather.message}</p>` : 
                `
                <p>
                    <img src="https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png" alt="${weather.weather[0].description}">
                </p>
                <table>
                    <tr>
                        <th align="left">Temperature</th>
                        <td align="left">${weather.main.temp} ℃</td>
                    </tr>
                    <tr>
                        <th align="left">Feels Like</th>
                        <td align="left">${weather.main.feels_like} ℃</td>
                    </tr>
                    <tr>
                        <th align="left">Min</th>    
                        <td align="left">${weather.main.temp_min} ℃</td>            
                    </tr>
                    <tr>
                        <th align="left">Max</th>
                        <td align="left">${weather.main.temp_max} ℃</td>
                    </tr>
                    <tr>
                        <th align="left">Humidity</th>
                        <td align="left">${weather.main.humidity}</td>
                    </tr>
                    <tr>
                        <th align="left">Wind Speed</th>
                        <td align="left">${weather.wind.speed}</td>
                    </tr>
                    <tr>
                        <th align="left">Cloudiness</th>
                        <td align="left">${weather.clouds.all}</td>
                    </tr>
                    <tr>
                        <th align="left">Sunrise</th>
                        <td align="left">${formatDate(weather.sys.sunrise * 1000)}</td>
                    </tr>
                    <tr>
                        <th align="left">Sunset</th>
                        <td align="left">${formatDate(weather.sys.sunset * 1000)}</td>
                    </tr>
                </table>`}
            </main>     
        </body>
        </html>`)
}

http.createServer(app).listen(3000, () => {
    console.log('Server running at http://localhost:3000/')
})
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
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}`)
    const json = await response.json()
    return json
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

        </head>
        
        <body>
            <h1>Hello World from ${city}</h1>
            ${weather.cod !== 200 ? `<p>${weather.message}</p>` : 
            `<pre>${JSON.stringify(weather, null, 2)}</pre>`}
            
        </body>
    </html>`)
}

http.createServer(app).listen(3000, () => {
    console.log('Server running at http://localhost:3000/')
})
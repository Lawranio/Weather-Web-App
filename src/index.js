import React, { useCallback } from 'react'
import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

import cloudyImage from './assets/cloudy.png';
import sunImage from './assets/sun.png';
import fogImage from './assets/fog.png';
import drizzleImage from './assets/drizzle.png';
import rainImage from './assets/rain.png';
import thunderstormImage from './assets/thunderstorm.png';
import snowImage from './assets/snowy.png';

const API_KEY = 'your api key here';

/**
 * Функция для запроса к API
 * @returns json
 */
async function weatherAPIcall(city) {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`);
    if (!response.ok) alert('Ошибка API');

    return response.json();
};

/**
 * Конвертор времени из unix в 24-часовой формат
 * @param unixTime 
 * @returns HH:MM
 */
function getTime(unixTime) {
    const date = new Date(unixTime * 1000);

    const hours = date.getUTCHours().toString().padStart(2, '0');
    const minutes = date.getUTCMinutes().toString().padStart(2, '0');

    return `${hours}:${minutes}`;
};

/**
 * Конвертор даты из unix в обычный формат
 * @param unixDate 
 * @returns date-month-year
 */
function getFullDate(unixDate) {
    const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
    ];
    const date = unixDate.getUTCDate();
    const month = unixDate.getUTCMonth();
    const year = unixDate.getUTCFullYear();
    return `${date}-${months[month]}-${year}`;
}

/**
 * Компонент
 * @param feels_like
 * @returns html
 */
const RealFeel = ({feels_like}) => {
    return (
        <div id="card">
            <span>Real Feel</span>
            <span>{feels_like}°C</span>
        </div>
    );
};

/**
 * Компонент
 * @param humidity
 * @returns html
 */
const Humidity = ({humidity}) => {
    return (
        <div id="card">
            <span>Humidity</span>
            <span>{humidity}%</span>
        </div> 
    );
};

/**
 * Компонент
 * @param pressure
 * @returns html
 */
const Pressure = ({pressure}) => {
    return (
        <div id="card">
            <span>Pressure</span>
            <span>{pressure} mmHg</span>
        </div>
    );
};

/**
 * Компонент
 * @param visibility
 * @returns html
 */
const Visibility = ({visibility}) => {
    return (
        <div id="card">
            <span>Visibility</span>
            <span>{visibility} km</span>
        </div>
    );
};

/**
 * Компонент
 * @param speed
 * @returns html
 */
const Wind = ({speed}) => {
    return (
        <div id="card">
            <span>Wind</span>
            <span>{speed} m/sec</span>
        </div>
    );
};

/**
 * Компонент
 * @param sunrise
 * @returns html
 */
const Sunrise = ({sunrise}) => {
    return (
        <div id="card">
            <span>Sunrise Time</span>
            <span>{sunrise}</span>
        </div>
    );
};

/**
 * Компонент
 * @param sunset
 * @returns html
 */
const Sunset = ({sunset}) => {
    return (
        <div id="card">
            <span>Sunset Time</span>
            <span>{sunset}</span>
        </div>
    );
};

/**
 * Компонент со ссылкой
 */
const Copyright = () => {
    return (
        <a id="card" href="https://openweathermap.org" target="_blank" rel="noreferrer">
            &copy; Open Weather
        </a>
    );
};

/**
 * Основной компонент для рендера
 * Содержит в себе все генерируемые компоненты
 * @returns html
 */
const Weather = () => {
    const [weather, setWeather] = useState(null);
    const [city, setCity] = useState('Moscow');
    const [fetch, setFetch] = useState(true);
    const [icon, setIcon] = useState('');

    const icons = {
        Thunderstorm: thunderstormImage,
        Drizzle: drizzleImage,
        Rain: rainImage,
        Fog: fogImage,
        Haze: fogImage,
        Mist: fogImage,
        Dust: fogImage,
        Sand: fogImage,
        Ash: fogImage,
        Squall: fogImage,
        Tornado: fogImage,
        Clear: sunImage,
        Clouds: cloudyImage,
        Snow: snowImage,  
    };

    const days = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
    ];

    const fetchWeather = useCallback(async () => {
        if (!city) return;

        const data = await weatherAPIcall(city);
        setWeather(data);
        setIcon(data?.weather[0]?.main);
        setFetch(false);
    }, [city]);

    useEffect(() => {
        if (fetch) fetchWeather();
        
    }, [fetch, fetchWeather]);

    return (
        <div id="content">
            <div id="location">
                <div id="field">
                    <input id="input"
                           type="text" 
                           value={city} 
                           onChange={(e) => setCity(e.target.value)}>
                    </input>

                    <button id="search" onClick={() => setFetch(true)}></button>
                </div>
                <img id="image" src={icons[icon]} alt={`${icon}`}></img>
                <span id="temp">{Math.trunc(weather?.main?.temp)}°C</span>
                <span id="description">{weather?.weather[0]?.description.replace(/\b\w/g, char => char.toUpperCase())}</span>
                <hr id="line"></hr>
                <span id="description">{getTime(Date.now() / 1000 + weather?.timezone)}</span>
                <span id="description">{getFullDate(new Date(Date.now() + weather?.timezone * 1000))}</span>
                <span id="description">{days[new Date(Date.now() + weather?.timezone * 1000).getUTCDay()]}</span>
            </div>

            <div id="weather">
                <RealFeel 
                    feels_like={Math.trunc(weather?.main?.feels_like)}
                />
                <Humidity
                    humidity={weather?.main?.humidity}
                />
                <Pressure
                    pressure={Math.trunc(weather?.main?.pressure / 1.333)}
                />
                <Visibility
                    visibility={Math.trunc(weather?.visibility / 1000)}
                />
                <Wind
                    speed={Math.trunc(weather?.wind?.speed)}
                />
                <Sunrise
                    sunrise={getTime(weather?.sys?.sunrise + weather?.timezone)}
                />
                <Sunset
                    sunset={getTime(weather?.sys?.sunset + weather?.timezone)}
                />
                <Copyright/>
            </div>
        </div>
    );
};

const weather = <Weather/>;
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(weather);
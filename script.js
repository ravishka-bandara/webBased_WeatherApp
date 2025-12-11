// API configuration for weather data

const API_KEY = '';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

//DOM elements

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('wind-speed');
const feelsLike = document.getElementById('feels-like');
const sunTimes = document.getElementById('sun-times');
const currentDate = document.getElementById('current-date');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const loading = document.getElementById('loading');
const unitButtons = document.querySelectorAll('.unit-btn');


//global varieables

let currentUnit = 'celcius';
let currentData = null;

//weather icons mapping

const weatherIcons ={
    '01':'fas fa-sun',  //sky clear
    '02':'fas fa-cloud-sun', //clouds
    '03':'fas fa-cloud', //brocken clouds
    '04':'fas fa-cloud', //broke clouds
    '09':'fas fa-cloud-rain', //shower rain
    '10':'fas fa-cloud-sun-rain', //rain
    '11':'fas fa-bolt', //thunderstrom
    '13':'far fa-snowflake', //snow
    '50':'fas fa-smog' //mistt
};

// iniializee

document.addEventListener('DOMContentLoaded',() =>{
    updateDate();
    setDefaultCity();
    setupEventListners();
});

//default city on loading

async function setDefaultCity(){
    await getweather('Anuradhapura');
}

//update current date

function updateDate(){
    const now = new Date();
    const options = {
        weekday: 'long',
        year:'numeric',
        month:'long',
        day:'numeric'
    };
    currentDate.textContent = now.toLocaleDateString('en-US',options);
}

// setup event listners

function setupEventListners(){
    searchBtn.addEventListener('click',handleSearch);
    cityInput.addEventListener('keypress',(e) =>{
        if (e.key === 'Enter') handleSearch();
    });

    locationBtn.addEventListener('click',getWeatherByLocation);

    unitButtons.forEach(button =>{
        button.addEventListener('click',() =>{
            changeTemperatureUnit(button.dataset.unit);
        });
    });
}

// handle search

async function handleSearch(){
    const city = cityInput.ariaValueMax.trim();
    if (!city){
        showError('please enter a city name');
        return;
    }

    await getweather(city);
}


// API configuration for weather data

const API_KEY = '8f627812f69ce10e809beb5273aab4c3';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

//DOM elements

const cityInput = document.getElementById('city-input');
const searchBtn = document.getElementById('search-btn');
const locationBtn = document.getElementById('location-btn');
const cityName = document.getElementById('city-name');
const temperature = document.getElementById('temperature');
const weatherIcon = document.getElementById('weather-icon');
const weatherDescription = document.getElementById('weather-description');
const humidity = document.getElementById('Humidity');
const windSpeed = document.getElementById('wind-speed');
const feelsLike = document.getElementById('feels-like');
const sunTimes = document.getElementById('sun-times');
const currentDate = document.getElementById('current-date');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const loading = document.getElementById('loading');
const unitButtons = document.querySelectorAll('.unit-btn');


//global varieables

let currentUnit = 'celsius';
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
    const city = cityInput.value.trim();
    if (!city){
        showError('please enter a city name');
        return;
    }

    await getweather(city);
}

// get weather by city names

async function getweather(city){
    try{
        showLoading();
        hideError();

        const response = await fetch(
            `${BASE_URL}?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok){
            throw new Error('city not found');
        }

        const data = await response.json();
        currentData = data;
        displayWeather(data);
        updateBackground(data.weather[0].main.toLowerCase());

    } catch (error){
        showError(error.message);
    } finally  {
        hideLoading();
    }
}

//get weather by users location 

function getWeatherByLocation(){
    if (!navigator.geolocation){
        showError('geolocation is not support by your browser');
        return;
    }

    showLoading();
    hideError();

    navigator.geolocation.getCurrentPosition(
        async (position) =>{
            try{
                const {latitude, longitude} = position.coords;
                const response = await fetch(
                    `${BASE_URL}?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`
                );

                if (!response.ok) throw new Error('location not found');

                const data = await response.json();
                currentData = data;
                displayWeather(data);
                updateBackground(data.weather[0].main.toLowerCase());
                cityInput.value = data.name;
            }catch (error){
                showError('unable to get weather for your geo location');
            } finally{
                hideLoading();
            }
        },
        (error) =>{
            hideLoading();
            showError('please enable locaion access');
        }
    );
}

//display weather data

function displayWeather(data){
    const {name, sys, main, weather, wind} = data;

    //city country
    cityName.textContent = `${name},${sys.country}`;

    //temperature
    const tempCelcius = Math.round(main.temp);
    const tempFahrenheit = Math.round((tempCelcius * 9/5)+32);
    const feelsLikeC = Math.round(main.feels_like);
    const feelsLikeF = Math.round((feelsLikeC * 9/5)+32);

    temperature.textContent = `${tempCelcius}°C`;
    feelsLike.textContent = `${feelsLikeC}°C`;


    //weather icon and description

    const weatherCode = weather[0].icon.substring(0, 2);
    weatherIcon.innerHTML = `<i class="${weatherIcons[weatherCode] || 'fas fa-cloud'}"></i>`;
    weatherDescription.textContent = weather[0].description;

    //other details

    humidity.textContent = `${main.humidity}%`;
    windSpeed.textContent = `${Math.round(wind.speed *3.6)} km/h`; // convert m/s to km/h

    //sunrise and sunset

    const sunrise = new Date(sys.sunrise * 1000).toLocaleTimeString([], {hour: '2-digit',minute:
        `2-digit`
    });
    const sunset = new Date(sys.sunset * 1000).toLocaleTimeString([], {hour: `2-digit`,minute: `2-digit`});
    sunTimes.textContent = `${sunrise} / ${sunset}`;


    //store converted values

    currentData.tempCelcius = tempCelcius;
    currentData.tempFahrenheit = tempFahrenheit;
    currentData.feelsLikeC = feelsLikeC;
    currentData.feelsLikeF = feelsLikeF;

}

// change temperature unit

function changeTemperatureUnit(unit){
    if (unit === currentUnit || !currentData) return;

    currentUnit = unit;

    //update active button

    unitButtons.forEach(button =>{
        button.classList.toggle('active',button.dataset.unit === unit);
    });

    //update tmperature

    if(unit === 'celsius'){
        temperature.textContent = `${currentData.tempCelcius}°C`;
        feelsLike.textContent = `${currentData.feelsLikeC}°C`;
    } else{
        temperature.textContent = `${currentData.tempFahrenheit}°F`;
        feelsLike.textContent = `${currentData.feelsLikeF}°F`;
    }
}

// update background based on weather

function updateBackground(weatherCondition){
    const body = document.body;
    body.className = ''; //remove all classes
    body.classList.add(weatherCondition);
}

//show loading spinner animation

function showLoading(){
    loading.style.display = 'block';
}

//hide loading spinner

function hideLoading(){
    loading.style.display = 'none';
}

//show error message

function showError(message){
    errorText.textContent = message;
    errorMessage.style.display = 'flex';
    setTimeout(hideError, 5000);
}

//hide error message

function hideError(){
    errorMessage.style.display = 'none';
}

//name in footer

document.getElementById('Ravishka-bandara').textContent = 'Ravishka-bandara';
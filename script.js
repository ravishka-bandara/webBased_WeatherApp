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


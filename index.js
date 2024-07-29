const userTab = document.querySelector(".selfWeather");
const searchTab = document.querySelector(".search-input");
const userContainer = document.querySelector(".weather-box");
let City = "Pune";


const grantAccessContainer = document.querySelector(".permission-container");
const searchForm = document.querySelector("[searchForm]");

const loadingScreen = document.querySelector(".weather-loading-container");
const userInfoContainer = document.querySelector(".information-container");
const errorFound = document.querySelector(".error-msg");


const conditionCurrent = document.querySelector(".condition-current");

let currentTab = userTab;
const API_KEY = "f1d62bbd44389e63e638e3a2114bf14f";

currentTab.classList.add("current-container");
grantAccessContainer.classList.add("active");
// sub switching 

const switchTab = (clickedTab)=>{
    if(clickedTab!=currentTab){
      currentTab.classList.remove("current-container"); 
      currentTab = clickedTab;
      currentTab.classList.add("current-container");
    
    if(!searchForm.classList.contains("active")){ 
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.remove("active");
      searchForm.classList.add("active");
    }

    else{
      searchForm.classList.remove("active");
      userInfoContainer.classList.remove("active");
      grantAccessContainer.classList.add("active");
      getFromeSessionStorage(); 

    }
  }


}

searchTab.addEventListener("click" , ()=>{
  switchTab(searchTab);
});

userTab.addEventListener("click" , ()=>{
   switchTab(userTab);
});


// check if cordinates are already present in session storage

function getFromeSessionStorage(){
   const localCoordinates = sessionStorage.getItem("location-cor");
   if(localCoordinates == false ){
    grantAccessContainer.classList.add("active");
   }
   else{
    const coordinates = JSON.parse(localCoordinates);
    fetchUserWeatherInfo(coordinates);
   }
}

async function fetchUserWeatherInfo(coordinates){
  const {lat , lon}  = coordinates;
  // make grantcontainer invisible
  grantAccessContainer.classList.remove("active");
  // make loader visible
  loadingScreen.classList.add("active");

  // api call
  try{
     const res = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}`);
     const data = await res.json();  

     loadingScreen.classList.remove("active"); //ab muje data milgaya hai remove krdo loadingse
     if(grantAccessContainer.classList.contains("active")){
      grantAccessContainer.classList.remove("active");
     }
     userInfoContainer.classList.add("active");
     errorFound.classList.remove("active");
     City = data;

     renderWeatherInfo(data);

  }
  catch(err){
   loadingScreen.classList.remove("active");
  }
}

let flag = true;

const tempChoose = document.querySelector("[temp-unit]");

tempChoose.addEventListener('click' , ()=>{
  if(flag){
      flag = false;
      tempChoose.innerText = "Kelvin";
  }else{
    flag = true;
    tempChoose.innerText = "Celsius";
  }
  renderWeatherInfo(City);

  
})


function renderWeatherInfo(weatherInfo){
   const cityName = document.querySelector("[CityName]");
   const countryIcon = document.querySelector("[countryIcon]");
   const desc = document.querySelector("[weatherDesc]");
   const weatherIcon = document.querySelector("[weatherIcon]");
   const temp = document.querySelector("[temperature]");
   const windspeed = document.querySelector("[windspeed]");
   const humidity = document.querySelector("[humidity]");

   const cloudiness = document.querySelector("[cloudiness]");
   const feelsLike = document.querySelector("[feelLike]");
   const MaxTemp = document.querySelector("[tempMax]");
   const MinTemp = document.querySelector("[tempMin]");


   cityName.innerText = weatherInfo?.name;
   countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
   desc.innerText = weatherInfo?.weather?.[0]?.description;
   weatherIcon.src=`https://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;

console.log(flag+ + " ");
if(flag){
   temp.innerText = Math.round(weatherInfo?.main?.temp- 273.15 ) + " °C";
  //  console.log(weatherInfo?.main?.feels_like)
   feelsLike.innerText = Math.round(weatherInfo?.main?.feels_like- 273.15 ) + " °C";
   MaxTemp.innerText = Math.round(weatherInfo?.main?.temp_max- 273.15 ) + " °C";
   MinTemp.innerText = Math.round(weatherInfo?.main?.temp_min- 273.15 ) + " °C";
  

}else{
  temp.innerText = (weatherInfo?.main?.temp) + " °K";

   feelsLike.innerText = (weatherInfo?.main?.feels_like) + " °K";
   MaxTemp.innerText = (weatherInfo?.main?.temp_max) + " °K";
   MinTemp.innerText = (weatherInfo?.main?.temp_min) + " °K";
}

   windspeed.innerText = weatherInfo?.wind?.speed + " m/s";
   humidity.innerText = weatherInfo?.main?.humidity + " %";
   cloudiness.innerText = weatherInfo?.clouds?.all + " %";

}


function getLocation(){
  console.log("hei");
  if(navigator.geolocation){
    console.log("enter");
    navigator.geolocation.getCurrentPosition(showPosition);
  }
  else{
    alert("no location ");
  }
}

function showPosition(position){
  console.log("position -> ");
  const userCoordinates = {
    lat : position.coords.latitude , 
    lon: position.coords.longitude ,
  }
  console.log(userCoordinates);
  sessionStorage.setItem("location-cor" , JSON.stringify(userCoordinates));
  fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("[data-grantAccess]");

grantAccessButton.addEventListener("click" , getLocation);

const searchInput = document.querySelector("[data-searchInput]");

searchForm.addEventListener("click" , (e)=>{
  e.preventDefault();
  let cityName = searchInput.value;

  if(cityName==="") return;
  else{

    fetchSearchWeatherInfo(cityName);
  }
});

async function fetchSearchWeatherInfo(city){

  loadingScreen.classList.add("active");
  userInfoContainer.classList.remove("active");
  grantAccessContainer.classList.remove("active");

  try{
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}`
    );
    const data = await response.json();

    if(data.cod == '404'){
      errorFound.classList.add("active");
      loadingScreen.classList.remove("active");
      return;
    }
    loadingScreen.classList.remove("active");
    errorFound.classList.remove("active");
    userInfoContainer.classList.add("active");
    City=data;
    renderWeatherInfo(data)
  }
  catch(er){
    alert(er);
  }

}

setInterval(()=>{
  renderWeatherInfo(City);
} , 50000);
const NASA_API_KEY = "MC6imZtS4FciZ35gh4WzEtgHNWFK61EtdBMSEaV9";
const BASE_URL = "https://api.nasa.gov/planetary/apod"; 

//https://api.nasa.gov/planetary/apod?date=${date}&api_key=${NASA_API_KEY}

const img_container = document.querySelector("#current-image-container");
const main_container = document.querySelector("#main-container");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const searchHistoryList = document.getElementById("search-history");
const ele_h2 = document.querySelector("#ele_h2");
const ele_exp = document.querySelector("#ele_exp");

async function GetAPIData(date){
    try{
        const response = await fetch(`${BASE_URL}?date=${date}&api_key=${NASA_API_KEY}`);
        if (!response.ok){
            if(response.status === 404){
                console.log("No image found for this date.");
                throw new Error("Unable to fetch data");
            }else{
                throw new Error("Unable to fetch data");
            }
        }

        const data = await response.json();
        //console.log(data);

        img_container.innerHTML = `
            <img src="${data.url}" alt="${data.title}" style="max-width:100%;">`;
        
        ele_h2.innerHTML = data.title;
        ele_exp.innerHTML = data.explanation;
        

    }catch(error){
        img_container.innerHTML = `<p>Error: ${error.message}</p>`;
    }
}

function getCurrentImageOfTheDay(){
    //This function should fetch the data for the current date from the NASA API and display it in the UI. 
    // This function runs when the page loads.

    //https://api.nasa.gov/planetary/apod?date=${date}&api_key=${NASA_API_KEY}

    const currentDate = new Date().toISOString().split("T")[0];
    // const currentDate = '2025-10-01';
    GetAPIData(currentDate);
}


async function getImageOfTheDay(date){
    //This function should fetch the data for the selected date from the NASA API and display it in the UI. 
    
    const response1 = GetAPIData(date);
    // It should also save the date to local storage 
    saveSearch(date);

    //and also show it in the search history unordered list
    addSearchToHistory();
}

function saveSearch(date){
    //This function should save a date to local storage. 
    //Need to just save the dates in an array.
    let history = JSON.parse(localStorage.getItem("searches")) || [];

    if(!history.includes(date)){
        history.push(date);
    }

    localStorage.setItem("searches", JSON.stringify(history));
}

function addSearchToHistory(){
    //This function should add the date to the search history list in the Ui
    //Need to get the searches array from localstorage 
    const history = JSON.parse(localStorage.getItem("searches")) || [];

    // and display it as an unordered list in the ui. 
    searchHistoryList.innerHTML = "";
    history.forEach(date => {
        const li = document.createElement("li");
        li.textContent = date;
        // When a user clicks on the specific list item, Need to fetch the data for that specific date all over again 
        // and show it in the black div.
        li.addEventListener("click", ()=>{
            getImageOfTheDay(date);
        });
        searchHistoryList.appendChild(li);
    });
    
}

//1: Today: Image of the Day
window.addEventListener("DOMContentLoaded",getCurrentImageOfTheDay);

//2: Get image of the day by search
searchForm.addEventListener("submit", (event) => {
    event.preventDefault();
    //console.log(searchInput.value);
    const date = searchInput.value;
    getImageOfTheDay(date);
});
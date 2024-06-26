let key = "mnU7PRdaf2gluSAkQ8xlLfohe4Jrr4B8MzEq69i7";

let searchHistory = localStorage.getItem("searchHistory")
  ? JSON.parse(localStorage.getItem("searchHistory"))
  : [];

// Data fetcher funtion
async function fecthData(url) {
  let res = await fetch(url);
  let data = await res.json();
  return data;
}

// get Image of function
async function getImageOfTheDay(url) {
  let data = await fecthData(url);
  updateUi(data);
}

// UI Updater function
function updateUi(data) {
  let title = data?.title;
  let date = data?.date;
  let imgSrc = data?.url ? data?.url : data?.hdurl;
  let mediaType = data?.media_type;
  let mediaContent;
  if (mediaType === "video") {
    mediaContent = `
                    <div class="mb-4">
                        <iframe src="${imgSrc}" class="w-full h-64 md:h-96 rounded-lg shadow" frameborder="0" allowfullscreen></iframe>
                    </div>
                `;
  } else {
    mediaContent = `
                    <div class="mb-4">
                        <img src="${imgSrc}" alt="${title}" title="${title}" class="w-full h-auto rounded-lg shadow object-cover object-center">
                    </div>
                `;
  }
  document.querySelector("#output-sec").innerHTML = `
    <div class="mb-4">
        <span class="text-2xl font-bold text-gray-300">${title}</span>
        <span class="text-xs font-extralight text-gray-400 mx-1 mt-1">${date}</span>
    </div>
    ${mediaContent}
    <div>
        <p class="text-gray-300 text-justify">${data?.explanation}</p>
    </div>
    `;
}

// Default date setter function in input tag
function setCurrentDate() {
  let today = new Date().toISOString().split("T")[0];
  document.querySelector("#custom-date").value = today;
  document.querySelector("#custom-date").max = today;
}

// Calling The Required Functions when DOM Loaded
document.addEventListener("DOMContentLoaded", () => {
  setCurrentDate();
  let inputDate = document.querySelector("#custom-date").value;
  let url = `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${inputDate}`;
  getImageOfTheDay(url);
  updateHistoryUi(searchHistory);
});

// Save Search History
function saveSearch(date) {
  if (!searchHistory.includes(date)) {
    searchHistory.push(date);
    localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
    updateHistoryUi(searchHistory);
  }
}

// Handling Custom Search
document.querySelector("#search").addEventListener("click", (e) => {
  e.preventDefault();
  let inputDate = document.querySelector("#custom-date").value;
  let url = `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${inputDate}`;
  saveSearch(inputDate);
  getImageOfTheDay(url);
});

// Search History UI Updating function
function updateHistoryUi(searchHistory) {
  let prevSearchDev = document.querySelector("#previous-search");
  if (searchHistory.length === 0) {
    prevSearchDev.innerHTML = `
    <div class="text-gray-300 text-center">
        <p class="text-lg font-bold">No Previous Search</p>
    </div>
    `;
  } else {
    prevSearchDev.innerHTML = "";
    prevSearchDev.innerHTML += `
    <div class="text-center mb-4">
        <p class="text-lg font-bold text-gray-300">Previous Searches</p>
    </div>
    <div class="flex flex-wrap justify-center space-x-2">
        ${searchHistory
          .map(
            (history) => `
                <p class="bg-gray-200 text-blue-600 font-medium px-4 py-2 rounded-full my-2 shadow cursor-pointer flex items-center space-x-2 transition-all duration-200" onclick="addSearchToHistory('${history}')">
                    ${history}
                    <span class="text-red-600 ml-2 cursor-pointer hover:text-red-800 transition-all duration-200" onclick="removeFromHistory(event, '${history}')">X</span>
                </p>
                `
          )
          .join(" ")}
    </div>
    `;
  }
}

// Search from history
function addSearchToHistory(history) {
  let url = `https://api.nasa.gov/planetary/apod?api_key=${key}&date=${history}`;
  getImageOfTheDay(url);
}

// Removing History
function removeFromHistory(event, history) {
  event.stopPropagation();
  searchHistory = searchHistory.filter((date) => date !== history);
  localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
  updateHistoryUi(searchHistory);
}

const dropdownButton = document.getElementById("button-dropdown");
const dropdownContent = document.getElementById("dropdown-content");
const inputSearch = document.getElementById("search-input");
const firstResult = document.getElementById("first-result");
const suggestBlock = document.getElementById("search-suggest");
const mainGetUrl = "api.giphy.com/v1/gifs/search";
const apiKey = "wfb4bluWYWrK0DTU75QBPfJBHd9aEKk4";


/// querys

const searchQuery = await fetch(mainGetUrl,{
    method : "GET",
    headers:{
        "api_key": apiKey,
        "q": inputSearch.value
    }
});
const response = await searchQuery.json();

//actions

dropdownButton.addEventListener("click", () => { 
    if(dropdownContent.style.display === "flex") {
        dropdownContent.style.display = "none";
    } else {
        dropdownContent.style.display = "flex";
    }
});
inputSearch.addEventListener("input", () => {
  if (inputSearch.value !== "") {
    suggestBlock.style.display = "flex";
  } else {
    suggestBlock.style.display = "none";
  }
});

firstResult.addEventListener("click", () => {
    firstResult.classList.add("button-active");
})
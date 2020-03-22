const dropdownButton = document.getElementById("button-dropdown");
const dropdownContent = document.getElementById("dropdown-content");
const inputSearch = document.getElementById("search-input");
const buttonSearch = document.getElementById("search-button");
const firstResult = document.getElementById("first-result");
const suggestBlock = document.getElementById("search-suggest");
const suggestGifsBlock = document.getElementById("suggest-gifs");
const mainGetUrl = "https://api.giphy.com/v1/gifs/search";
const trendGetUrl = "https://api.giphy.com/v1/gifs/trending";
const apiKey = "wfb4bluWYWrK0DTU75QBPfJBHd9aEKk4";

/// querys

const Search = async () => {
  const searchQuery = await fetch(
    `${mainGetUrl}?api_key=${apiKey}&q=${inputSearch.value}&limit=${4}`,
    {
      method: "GET"
    }
  );
  const response = await searchQuery.json();
  console.log(response);
  response.data.map(obj => {
    let gifBlock = document.createElement("div");
    let gifImage = document.createElement("img");
    gifImage.setAttribute("src", obj.images.downsized_large.url);
    gifBlock.append(gifImage);
    suggestGifsBlock.appendChild(gifBlock);
  });
};

const Trends = async () => {
  const trendsQuery = await fetch(
    `${trendGetUrl}?api_key=${apiKey}&limit=${24}`,
    {
      method: "GET"
    }
  );
  const trendsQueryResult = await trendsQuery.json();
  const suggestQuery = trendsQueryResult.data.splice(0, 4);
  suggestQuery.map(obj => {
    let gifBlock = document.createElement("div");
    let gifImage = document.createElement("img");
    gifImage.setAttribute("src", obj.images.downsized_large.url);
    gifBlock.append(gifImage);
    suggestGifsBlock.appendChild(gifBlock);
  });
};

Trends();
//actions

dropdownButton.addEventListener("click", () => {
  if (dropdownContent.style.display === "flex") {
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
});

buttonSearch.addEventListener("click", () => {
  Search();
});

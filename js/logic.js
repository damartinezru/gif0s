const constants = {
  mainGetUrl: "https://api.giphy.com/v1/gifs/search",
  trendGetUrl: "https://api.giphy.com/v1/gifs/trending",
  apiKey: "wfb4bluWYWrK0DTU75QBPfJBHd9aEKk4"
};

const dropdownElementsRequested = {
  dropdownButtons: document.getElementsByClassName("dropdown-buttons"),
  dropdownContent: document.getElementById("dropdown-content"),
  similarSearchResultsContainer: document.getElementById("search-suggest")
};

const searchBoxElementsRequested = {
  searchInput: document.getElementById("search-input"),
  searchButton: document.getElementById("search-button")
};

const suggestElementsRequested = {
  suggestContainer: document.getElementById("suggest"),
  suggestGifContainer: document.getElementById("suggest-gifs")
};

const trendElementsRequested = {
  trendContainer: document.getElementById("trends"),
  trendGifContainer: document.getElementById("trends-gifs")
};

const resultElementsRequested = {
  resultTags: document.getElementById("tags"),
  resultContainer: document.getElementById("results"),
  resultGifContainer: document.getElementById("result-gifs"),
  resultInputBox: document.getElementsByClassName("input-box-gifs")[2]
};

/// Querys

const firstLoad = async () => {
  const searchQuery = await fetch(
    `${constants.trendGetUrl}?api_key=${constants.apiKey}&limit=${26}`,
    {
      method: "GET"
    }
  );
  const searchResult = await searchQuery.json();
  let suggestData = searchResult.data.slice(0, 4);
  searchResult.data.splice(0, 4);
  CreateGifs(suggestElementsRequested.suggestGifContainer, suggestData, false);
  CreateGifs(trendElementsRequested.trendGifContainer, searchResult.data, true);
};

firstLoad();

const Search = async buttonSelected => {
  resultElementsRequested.resultGifContainer.innerHTML = "";
  dropdownElementsRequested.similarSearchResultsContainer.style.display =
    "none";
  suggestElementsRequested.suggestContainer.style.display = "none";
  trendElementsRequested.trendContainer.style.display = "none";
  resultElementsRequested.resultContainer.style.display = "block";

  if (buttonSelected) {
    searchBoxElementsRequested.searchInput.value = buttonSelected.value;
  }
  const searchQuery = await fetch(
    `${constants.mainGetUrl}?api_key=${constants.apiKey}&q=${
      searchBoxElementsRequested.searchInput.value
    }&limit=${25}`,
    {
      method: "GET"
    }
  );
  const response = await searchQuery.json();
  resultElementsRequested.resultInputBox.value = buttonSelected.value;
  CreateGifs(resultElementsRequested.resultGifContainer, response.data, true);
  debugger
  CreateResultTags(response.data,resultElementsRequested.resultTags); 
};

const InputActive = async inputValue => {
  if (inputValue.value !== "" && inputValue.value !== null) {
    dropdownElementsRequested.similarSearchResultsContainer.innerHTML = "";
    searchBoxElementsRequested.searchButton.childNodes[1].src =
      "../assets/lupa.svg";
    // searchButton.classList.add("button-active");

    const searchWordGif = await fetch(
      `${constants.mainGetUrl}?api_key=${constants.apiKey}&q=${
        inputValue.value
      }&limit=${4}`,
      {
        method: "GET"
      }
    );
    const responseGifs = await searchWordGif.json();
    const inputWords = responseGifs.data.splice(0, 3);
    inputWords.map(gifObject => {
      if (gifObject.title !== "") {
        let inputButton = document.createElement("input");
        inputButton.setAttribute("type", "button");
        inputButton.setAttribute("onclick", `Search(this)`);
        let titulo = gifObject.title.slice(0, gifObject.title.indexOf("GIF"));
        dropdownElementsRequested.similarSearchResultsContainer.appendChild(
          inputButton
        );
        inputButton.value = titulo;
      }
    });
    dropdownElementsRequested.similarSearchResultsContainer.style.display =
      "flex";
  } else {
    dropdownElementsRequested.similarSearchResultsContainer.style.display =
      "none";
  }
};

//Create block elements

const CreateGifs = (block, data, noHeader) => {
  data.map((gifObject, i) => {
    const base = {
      gifContainer: document.createElement("div"),
      gifHeader: document.createElement("span"),
      gifHeaderIcon: document.createElement("img"),
      gifHeaderText: document.createElement("h4"),
      gifImage: document.createElement("img"),
      gifAnchor: document.createElement("a"),
      gifButton: document.createElement("button"),
      gifFooter: document.createElement("h4")
    };
    // gif image
    base.gifImage.setAttribute("src", gifObject.images.downsized_large.url);
    base.gifButton.innerText = "Ver más...";

    if (noHeader) {
      CreateCustomWidth(gifObject, base.gifContainer, i, data);
      CreateFooterTags(base.gifFooter, gifObject.title, base.gifContainer.style.gridColumn);
      base.gifContainer.append(base.gifFooter);
    } else {
      CreateHeaderTags(base.gifHeader, base.gifHeaderText, gifObject.title);
      CreateCloseButton(base.gifHeader, base.gifHeaderIcon, base.gifAnchor);
      base.gifContainer.append(base.gifHeader);
      base.gifContainer.append(base.gifButton);
    }
    // append
    base.gifContainer.append(base.gifImage);
    block.appendChild(base.gifContainer);
  });
};

//actions

const CreateHeaderTags = (block, textBlock, title) => {
  let gifTags = title.split(" ");
  let smallTitle = gifTags.splice(0, gifTags.indexOf("GIF")).join("");
  textBlock.innerText = `#${smallTitle}`;
  block.append(textBlock);
  return block;
};

const CreateFooterTags = (block, title, imageWidth) => {
  let gifTags = title.split(" ");
  gifTags.splice(gifTags.indexOf("GIF"), 1);
  gifTags.splice(gifTags.indexOf("by"), 1);
  gifTags.map(tg => {
    block.innerText = block.innerText.concat(`#${tg} `);
  });
  console.log(imageWidth);
  block.style.width = `${imageWidth}px`;
};

const CreateCloseButton = (block, iconBlock, anchorBlock) => {
  iconBlock.setAttribute("src", "../assets/close.svg");
  iconBlock.setAttribute("role", "button");
  iconBlock.appendChild(anchorBlock);
  block.append(iconBlock);
  return iconBlock;
};

const CreateResultTags = (data,block) => {
  debugger;
  let firstTags = data.slice(0,4);
  console.log(firstTags);
  firstTags.map((tg) => {
     let tag = tg.title.split(" ").join("").splice(tg.title.indexOf("GIF"));
     console.log(tag);
     let buttonTag = document.createElement("button");
     buttonTag.innerText = tag;
     buttonTag.setAttribute("onclick", "Search()");
     buttonTag.classList.add("tag-button");
     block.append(buttonTag);
  })
}

const CreateCustomWidth = (gifObject, gifBlock, index, data) => {
  let gifWidth = Number(gifObject.images.downsized_large.width);
  let beforeGifWidth =
    index - 1 !== -1 ? Number(data[index - 1].images.downsized_large.width) : 0;
  let afterGifWidth =
    index + 1 !== data.length + 1
      ? Number(data[index + 1].images.downsized_large.width)
      : 0;

  if (beforeGifWidth >= 500 && afterGifWidth >= 500) {
    gifBlock.style.gridColumn = "span 2";
  }
  if (gifWidth >= 500) {
    gifBlock.style.gridColumn = "span 2";

  }
};

const OpenThemeDropdown = () => {
  let buttons = dropdownElementsRequested.dropdownButtons[0].getElementsByTagName(
    "button"
  );
  if (dropdownElementsRequested.dropdownContent.style.display === "flex") {
    dropdownElementsRequested.dropdownContent.style.display = "none";
    buttons[0].classList.remove("button-selected");
    buttons[1].classList.remove("button-selected");
  } else {
    dropdownElementsRequested.dropdownContent.style.display = "flex";
    buttons[0].classList.add("button-selected");
    buttons[1].classList.add("button-selected");
  }
};

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

const TrendFetch = async () => {
  const searchQuery = await fetch(
    `${constants.trendGetUrl}?api_key=${constants.apiKey}&limit=${12}`,
    {
      method: "GET"
    }
  );
  const searchResult = await searchQuery.json();
  return searchResult;
};

const SearchFetch = async (inputValue, limit) => {
  const searchQuery = await fetch(
    `${constants.mainGetUrl}?api_key=${constants.apiKey}&q=${inputValue}&limit=${limit}`,
    {
      method: "GET"
    }
  );
  const response = await searchQuery.json();
  return response;
};

///

const FirstLoad = async () => {
  CheckStylesheet();
  const searchResult = await TrendFetch();
  let suggestData = searchResult.data.slice(0, 4);
  searchResult.data.splice(0, 4);
  CreateGifs(suggestElementsRequested.suggestGifContainer, suggestData, false);
  CreateGifs(trendElementsRequested.trendGifContainer, searchResult.data, true);
};

const Search = async (buttonSelected, hasHash) => {
  resultElementsRequested.resultGifContainer.innerHTML = "";
  dropdownElementsRequested.similarSearchResultsContainer.style.display =
    "none";
  suggestElementsRequested.suggestContainer.style.display = "none";
  trendElementsRequested.trendContainer.style.display = "none";
  resultElementsRequested.resultContainer.style.display = "block";

  if (buttonSelected) {
    if (hasHash) {
      let noTag = buttonSelected.innerText.split("#");
      noTag.splice(noTag.indexOf(""), 1).join("");
      searchBoxElementsRequested.searchInput.value = noTag[0];
      resultElementsRequested.resultInputBox.value = noTag[0];
    } else {
      searchBoxElementsRequested.searchInput.value = buttonSelected.value;
      resultElementsRequested.resultInputBox.value = buttonSelected.value;
    }
  }
  const response = await SearchFetch(
    searchBoxElementsRequested.searchInput.value,
    8
  );
  CreateResultTags(response.data, resultElementsRequested.resultTags);
  CreateGifs(resultElementsRequested.resultGifContainer, response.data, true);
};

const InputActive = async inputValue => {
  if (inputValue.value !== "" && inputValue.value !== null) {
    dropdownElementsRequested.similarSearchResultsContainer.innerHTML = "";
    searchBoxElementsRequested.searchButton.childNodes[1].src =
      "../assets/lupa.svg";
    const responseGifs = await SearchFetch(inputValue.value, 4);
    CreateSuggestSearchBox(responseGifs);
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
      gifFooter: document.createElement("div"),
      gifFooterText: document.createElement("h4")
    };
    base.gifContainer.setAttribute("class", "container");
    // gif image
    base.gifImage.setAttribute("src", gifObject.images.downsized_large.url);
    //
    AssignButtonValue(gifObject.title, base.gifButton);

    if (noHeader) {
      CreateCustomWidth(gifObject, base.gifContainer, i, data);
      CreateFooterTags(base.gifFooter, base.gifFooterText, gifObject.title);
    } else {
      CreateHeaderTags(base.gifHeader, base.gifHeaderText, gifObject.title);
      CreateCloseButton(base.gifHeader, base.gifHeaderIcon, base.gifAnchor);
      base.gifContainer.append(base.gifHeader);
      base.gifContainer.append(base.gifButton);
    }
    // append
    base.gifContainer.append(base.gifImage);
    if (noHeader) {
      base.gifContainer.append(base.gifFooter);
    }
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

const AssignButtonValue = (title, gifButton) => {
  gifButton.innerText = "Ver más...";
  gifButton.value = title;
  gifButton.setAttribute("onclick", "Search(this)");
};

const CreateFooterTags = (block, textBlock, title) => {
  let gifTags = title.split(" ");
  gifTags.splice(gifTags.indexOf("GIF"), 1);
  gifTags.splice(gifTags.indexOf("by"), 1);
  if (gifTags.length > 3) {
    gifTags.splice(4);
  }
  gifTags.map(tg => {
    textBlock.innerText = textBlock.innerText.concat(`#${tg} `);
  });
  block.setAttribute("class", "footerTag");
  block.append(textBlock);
};

const CreateCloseButton = (block, iconBlock, anchorBlock) => {
  iconBlock.setAttribute("src", "../assets/close.svg");
  iconBlock.setAttribute("role", "button");
  iconBlock.appendChild(anchorBlock);
  block.append(iconBlock);
  return iconBlock;
};

const CreateResultTags = (data, block) => {
  block.innerHTML = "";
  let firstTags = data.slice(0, 2);
  console.log(firstTags);
  firstTags.map(tg => {
    let tagArray = tg.title.split(" ");
    let tag = tagArray.splice(0, tagArray.indexOf("GIF"));
    tag.map(word => {
      let buttonTag = document.createElement("button");
      buttonTag.innerText = `#${word}`;
      buttonTag.setAttribute("onclick", "Search(this,true)");
      buttonTag.classList.add("tag-button");
      block.append(buttonTag);
    });
  });
};

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

const CreateSuggestSearchBox = response => {
  const inputWords = response.data.splice(0, 3);
  inputWords.map(gifObject => {
    if (gifObject.title !== "") {
      let inputButton = document.createElement("input");
      inputButton.setAttribute("type", "button");
      inputButton.setAttribute("onclick", `Search(this)`);
      let description = gifObject.title.slice(
        0,
        gifObject.title.indexOf("GIF")
      );
      dropdownElementsRequested.similarSearchResultsContainer.appendChild(
        inputButton
      );
      inputButton.value = description;
    }
  });
};

const OpenThemeDropdown = () => {
  let buttons = dropdownElementsRequested.dropdownButtons[0].getElementsByTagName(
    "button"
  );
  console.log(dropdownElementsRequested.dropdownContent.style.display);
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

const SelectTheme = isDay => {
  if (isDay) {
    ChangeTheme(true);
    sessionStorage.setItem("theme", "light");
  } else {
    ChangeTheme();
    sessionStorage.setItem("theme", "dark");
  }
};

const ChangeTheme = (isDay, isRecordPage) => {
  let styleSheet = document.getElementsByTagName("link");
  let logo = document.getElementById("logo");
  let camera = document.getElementById("camera-icon");
  if (isDay) {
    styleSheet[0].href = "../styles/style-home-light.css";
    logo.setAttribute("src", "../assets/gifOF_logo.png");
    if (isRecordPage) {
      camera.setAttribute("src", "../assets/camera.svg");
    }
    dropdownElementsRequested.dropdownContent.style.display = "none";
  } else {
    styleSheet[0].href = "../styles/style-home-dark.css";
    logo.setAttribute("src", "../assets/gifOF_logo_dark.png");
    if (isRecordPage) {
      camera.setAttribute("src", "../assets/camera_light.svg");
    }
    dropdownElementsRequested.dropdownContent.style.display = "none";
  }
};

const OpenDialogMyGifs = button => {
  let buttonsDropdown = dropdownElementsRequested.dropdownButtons[0].getElementsByTagName(
    "button"
  );
  buttonsDropdown[0].classList.remove("button-selected");
  buttonsDropdown[1].classList.remove("button-selected");
  button.classList.add("button-selected");

  window.location = "../pages/record-gifs.html";
};

const CheckStylesheet = isRecordPage => {
  let theme = sessionStorage.getItem("theme");
  if (theme === "light") {
    ChangeTheme(true,isRecordPage);
  } else {
    ChangeTheme(false,isRecordPage);
  }
};

let myGifs = {
  myGifBlock: document.getElementById("my-section-gifs"),
  myGifSection: document.getElementById("my-section"),

};

const OpenMyGifos = () => {
  let local = localStorage.getItem("myGifos");
  console.log(myGifs);
  if (local) {
    CreateMyGifs(myGifs.myGifBlock, JSON.parse(local));
    if (myGifs.myGifSection) {
      myGifs.myGifSection.style.display = "block";
    }
  }
};

const CreateMyGifs = (block, data) => {
  data.map(gifObject => {
    const base = {
      gifContainer: document.createElement("div"),
      gifImage: document.createElement("img")
    };
    base.gifContainer.setAttribute("class", "container");
    // gif image
    base.gifImage.setAttribute("src", gifObject.images.downsized_large.url);

    // append
    base.gifContainer.append(base.gifImage);
    block.appendChild(base.gifContainer);
  });
};

OpenMyGifos();

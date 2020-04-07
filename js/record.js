const constrainsUrls = {
  mainGetUrl: "https://api.giphy.com/v1/gifs",
  uploadUrl: "https://upload.giphy.com/v1/gifs",
  apiKey: "wfb4bluWYWrK0DTU75QBPfJBHd9aEKk4"
};
let commonElements = {
  recordHeader: document.getElementById("record-header"),
  timer: document.getElementById("timer"),
  firstButtonBlock: document.getElementById("record-buttons"),
  secondButtonBlock: document.getElementById("recording-buttons"),
  thirdButtonBlock: document.getElementById("upload-buttons"),
  fourthButtonBlock: document.getElementById("cancel-button"),
  loadingBlock: document.getElementById("loading")
};
let dialogs = {
  infoDialog: document.getElementById("dialog"),
  gifDialog: document.getElementById("dialog-record"),
  resultDialog: document.getElementById("dialog-result"),
  gifDialogContent: document.getElementById("dialog-record-content")
};

let headerText = {
  firstText: "Un Chequeo Antes De Empezar",
  secondText: "Capturando Tu Guifo",
  thirdText: "Vista Previa",
  fourthText: "Subiendo Guifo"
};

let timerInstance = new easytimer.Timer();
const video = document.getElementById("video-element");
const imagePreview = document.getElementById("preview");
let camera;
let record;
let blob;
const constrains = {
  audio: false,
  video: {
    width: { max: 832 },
    height: { max: 434 }
  }
};

const recordObject = stream => {
  return RecordRTC(stream, {
    type: "gif",
    frameRate: 1,
    quality: 10,
    width: 360,
    hidden: 240,
    disablelogs: true,
    timeSlice: 1000
  });
};

const OpenCamera = callback => {
  CheckThemeIcons();
  HideOpenContainers();
  navigator.mediaDevices
    .getUserMedia(constrains)
    .then(stream => {
      camera = stream;
      video.srcObject = camera;
      if (callback) {
        callback(camera);
      }
    })
    .catch(console.error);
};

const HideOpenContainers = () => {
  let navButtons = document.getElementById("initial-buttons");
  navButtons.style.display = "none";
  myGifs.myGifSection.style.display = "none";
  dialogs.infoDialog.style.display = "none";
  dialogs.gifDialog.style.display = "block";
};

const StartRecording = () => {
  StartTimer();
  ChangeElements();
  OpenCamera(camera => {
    record = recordObject(camera);
    record.startRecording();
    record.camera = camera;
  });
};

const StopRecording = () => {
  video.style.display = "none";
  imagePreview.style.display = "block";
  timerInstance.stop();
  record.stopRecording(() => {
    blob = record.getBlob();
    imagePreview.src = URL.createObjectURL(record.getBlob());
    record.camera.stop();
    record.destroy();
  });
  ChangeElements(false, true);
};

const ChangeElements = (captureRepeat, isReady) => {
  if (captureRepeat) {
    commonElements.recordHeader.innerText = headerText.firstText;
    commonElements.firstButtonBlock.style.display = "flex";
    commonElements.thirdButtonBlock.style.display = "none";
    commonElements.timer.style.visibility = "hidden";
    imagePreview.removeAttribute("style");
    imagePreview.removeAttribute("src");
    video.removeAttribute("style");
    OpenCamera();
  } else {
    commonElements.recordHeader.innerText = headerText.secondText;
    commonElements.firstButtonBlock.style.display = "none";
    commonElements.secondButtonBlock.removeAttribute("style");
    commonElements.secondButtonBlock.style.display = "flex";
    commonElements.timer.style.visibility = "visible";

    if (isReady) {
      commonElements.recordHeader.innerText = headerText.thirdText;
      commonElements.secondButtonBlock.style.display = "none";
      commonElements.thirdButtonBlock.style.display = "flex";
    }
  }
};

const StartTimer = () => {
  let timerInputBox = document.getElementById("timer-input");
  timerInstance.start();
  timerInstance.addEventListener("secondsUpdated", function() {
    timerInputBox.setAttribute(
      "value",
      timerInstance.getTimeValues().toString()
    );
  });
};

const UploadGif = async () => {
  OpenChargeDialog();
  data = new FormData();
  data.append("file", blob, "myGifO.gif");
  let responseUpload = await fetch(
    `${constrainsUrls.uploadUrl}?api_key=${constrainsUrl.apiKey}`,
    {
      method: "POST",
      body: data
    }
  )
    .then(response => {
      return response.json();
    })
    .then(response => {
      SaveGifLocalStorageElements(response.data.id);
    })
    .catch(e => {
      console.error(e);
    });
  return responseUpload;
};

const SaveGifLocalStorageElements = async id => {
  let responseSave = await fetch(
    `${constrainsUrls.mainGetUrl}/${id}?api_key=${constrainsUrl.apiKey}`,
    {
      method: "GET"
    }
  )
    .then(response => {
      return response.json();
    })
    .then(response => {
      let URI = response.data.images.downsized.url;
      let myGifos = [];
      document.getElementById("copyUrl").setAttribute("value", URI);
      let StorageElements = localStorage.getItem("myGifos");
      if (StorageElements) {
        myGifos = JSON.parse(StorageElements);
        myGifos.push(response.data);
        localStorage.setItem("myGifos", JSON.stringify(myGifos));
      } else {
        console.log(response);
        myGifos.push(response.data);
        localStorage.setItem("myGifos", JSON.stringify(myGifos));
      }
      setTimeout(() => {
        OpenResultDialog();
      }, 500);
    })
    .catch(e => {
      console.error(e);
    });
  return responseSave;
};

const CancelGifSave = () => {
  window.location = "./record-gifs.html";
};

const DownloadGif = () => {
  invokeSaveAsDialog(blob, "myGifO.gif");
};

const OpenChargeDialog = () => {
  imagePreview.style.display = "none";
  video.style.display = "none";
  commonElements.loadingBlock.style.display = "flex";
  commonElements.recordHeader.innerText = headerText.fourthText;
  commonElements.thirdButtonBlock.style.display = "none";
  commonElements.secondButtonBlock.style.display = "flex";
  commonElements.secondButtonBlock.style.visibility = "hidden";
  commonElements.fourthButtonBlock.style.display = "flex";
  commonElements.timer.style.display = "none";
};

const OpenResultDialog = () => {
  
    let image = document.getElementById("result-preview");
    let imageGif = JSON.parse(localStorage.getItem("myGifos"));
    dialogs.gifDialogContent.style.display = "none";
    image.setAttribute(
      "src",
      imageGif[imageGif.length - 1].images.downsized_large.url
    );
    dialogs.resultDialog.style.display = "grid";
    OpenMyGifos();
  
};

const CopyToClipboard = () => {
  let value = document.getElementById("copyUrl").getAttribute("value");
  navigator.clipboard
    .writeText(value)
    .then(() => {
      alert("Texto copiado a clipboard");
    })
    .catch(e => {
      console.error(e);
    });
};

const Back = () => {
  window.location = "./record-gifs.html";
};

const CheckThemeIcons = () => {
  let camera = document.getElementById("camera-icon");
  let record = document.getElementById("recording-icon");
  let session = sessionStorage.getItem("theme");
  if (session === "light") {
    camera.setAttribute("src", "../assets/camera.svg");
    record.setAttribute("src", "../assets/recording_dark.svg");
  } else {
    camera.setAttribute("src", "../assets/camera_light.svg");
    record.setAttribute("src", "../assets/recording.svg");
  }
};

const constrainsUrls = {
  mainGetUrl: "https://api.giphy.com/v1/gifs",
  uploadUrl: "https://upload.giphy.com/v1/gifs",
  apiKey: "wfb4bluWYWrK0DTU75QBPfJBHd9aEKk4"
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
  let dialogBlock = document.getElementById("dialog");
  let dialogRecord = document.getElementById("dialog-record");
  let myGifSection = document.getElementById("my-section");
  let navButtons = document.getElementById("initial-buttons");
  navButtons.style.display = "none";
  myGifSection.style.display = "none";
  dialogBlock.style.display = "none";
  dialogRecord.style.display = "block";
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

const ChangeElements = (isRepeat, isReady) => {
  let header = document.getElementById("record-header");
  let timer = document.getElementById("timer");
  let firstButtonBlock = document.getElementById("record-buttons");
  let secondButtonBlock = document.getElementById("recording-buttons");
  let thirdButtonBlock = document.getElementById("upload-buttons");

  if (isRepeat) {
    header.innerText = "Un Chequeo Antes De Empezar";
    firstButtonBlock.style.display = "flex";
    thirdButtonBlock.style.display = "none";
    timer.style.visibility = "hidden";
    imagePreview.removeAttribute("style");
    imagePreview.removeAttribute("src");
    video.removeAttribute("style");
    OpenCamera();
  } else {
    header.innerText = "Capturando Tu Guifo";
    firstButtonBlock.style.display = "none";
    secondButtonBlock.style.display = "flex";
    timer.style.visibility = "visible";

    if (isReady) {
      secondButtonBlock.style.display = "none";
      thirdButtonBlock.style.display = "flex";
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
      method: "GET",
    }
  )
    .then(response => {
      return response.json();
    })
    .then(response => {
      console.log(response);
      let URI = response.data.images.downsized.url;
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
      OpenResultDialog();
    })
    .catch(e => {
      console.error(e);
    });
    return responseSave;
};

const DownloadGif = () => {
  console.log("Funcionando ");
  invokeSaveAsDialog(blob, "myGifO.gif");
};

const OpenChargeDialog = () => {
  let header = document.getElementById("record-header");
  let loading = document.getElementById("loading");
  let uploadButtonBlock = document.getElementById("upload-buttons");
  let cancelButtonBlock = document.getElementById("cancel-button");
  let timer = document.getElementById("timer");
  imagePreview.style.display = "none";
  video.style.display = "none";
  loading.style.display = "flex";
  header.innerText = "Subiendo Guifo";
  uploadButtonBlock.style.display = "none";
  cancelButtonBlock.style.display = "flex";
  timer.style.display = "none";
}

const OpenResultDialog = () => {
  let dialogRecord = document.getElementById("dialog-record-content");
  let result = document.getElementById("dialog-result");
  dialogRecord.style.display = "none";
  result.style.display = "grid";
}
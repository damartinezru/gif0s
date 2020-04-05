const video = document.getElementById("video-element");
const imagePreview = document.getElementById("preview");
let camera;
let record;

const constrains = {
    audio: false,
    video: {
      width: { max: 832 },
      height: { max: 434 }
    }
  };

const recordObject = (stream) => {
    return RecordRTC(stream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        disablelogs: true,
        timeSlice: 1000,
        // onGifPreview: (camera) => {
        //   imagePreview.src = camera;
        // }
      });
}

const OpenCamera = (callback) => {  
    HideOpenContainers();
    navigator.mediaDevices.getUserMedia(constrains)
    .then(stream => {
      camera = stream;
      video.srcObject = camera;
      if(callback) {
        callback(camera);
      }
    })
    .catch(console.error);
}

const HideOpenContainers = () => {
  let dialogBlock = document.getElementById("dialog");
  let dialogRecord = document.getElementById("dialog-record");
  let myGifSection = document.getElementById("my-section");
  let navButtons = document.getElementById("initial-buttons");
  navButtons.style.display = "none";
  myGifSection.style.display = "none";
  dialogBlock.style.display = "none";
  dialogRecord.style.display = "block";
}

const StartRecording = () => {
  ChangeElements();
    OpenCamera((camera) => {
      record = recordObject(camera);
      record.startRecording();
      record.camera = camera;
    })
}

const StopRecording = () => {
  video.style.display = "none";
  imagePreview.style.display = "block";
  record.stopRecording(() => {
    console.log('gif0 '+ bytesToSize(record.getBlob().size));
    console.log('gifO' + record.getBlob());
    imagePreview.src = URL.createObjectURL(record.getBlob());
    record.camera.stop();
    record.destroy();
  })
}

const ChangeElements = () => {
  let imageButton = document.getElementById("camera-icon");
  let captureButton = document.getElementById("capture");

  captureButton.innerHTML = "Listo";
  captureButton.setAttribute("onclick", "StopRecording()")
  imageButton.setAttribute("src", "../assets/recording.svg");
}
const video = document.createElement("video");
const recordBlock = document.getElementsByClassName("dialog-record-content")[0];
let camera;

const constrains = {
    audio: false,
    video: {
      width: { max: 640 },
      height: { max: 480 }
    }
  };

const recordObject = () => {
    return RecordRTC(stream, {
        type: "gif",
        frameRate: 1,
        quality: 10,
        width: 360,
        hidden: 240,
        disablelogs: true,
        timeSlice: 1000
      });
}

const openCamera = () => {  
    window.location = "./record-gifs.html";
    navigator.mediaDevices
    .getUserMedia(constrains)
    .then(stream => {
      camera = stream;
      video.srcObject = camera;
    })
    .catch(console.error);
    recordBlock.appendChild(video);
}
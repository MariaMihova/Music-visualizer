// let audio = new Audio();
console.log("script started");
const audio: HTMLMediaElement = document.querySelector("audio")!;
const audioFile = document.querySelector("#audioFile")!;
audioFile.addEventListener("change", setAudio);
// audio.src = "./sounds/explosion5.wav";
const audioCtx = new AudioContext();

const container = document.querySelector("#container")!;
const canvas = document.querySelector("canvas")!;
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const ctx: CanvasRenderingContext2D = canvas.getContext("2d")!;

let audioSource: MediaElementAudioSourceNode;
let analyser: AnalyserNode;

// container.addEventListener("click", () => play(audio));
audioSource = audioCtx.createMediaElementSource(audio);
function play() {
  console.log("play funck");
  audio.play();
  analyser = audioCtx.createAnalyser();
  audioSource.connect(analyser);
  analyser.connect(audioCtx.destination); //default audio output device
  analyser.fftSize = 512;
  const bufferLength = analyser.frequencyBinCount; // this is half the value of fftSize 64 => 32
  const dataArray: Uint8Array = new Uint8Array(bufferLength);

  const barWtdth: number = canvas.width / 2 / bufferLength; // the width of a single bar in visualizer
  let barHeight: number;
  let x: number; //horizontal x cordinate

  function animate() {
    x = 0;
    ctx.clearRect(0, 0, canvas.width, canvas.height); //it take four arguments specifying which part of canves we want to clear
    analyser.getByteFrequencyData(dataArray);
    for (let i = 0; i < bufferLength; i++) {
      barHeight = dataArray[i] * 3;

      ctx.save(); //creates save point to which after calling ctx.restore the canvas will be restored
      ctx.translate(canvas.width / 2, canvas.height / 2); // transalate sets center of the canves
      ctx.rotate((i * (Math.PI * 4)) / bufferLength); // golden ration form
      //   ctx.rotate((i + (Math.PI * 2)) / bufferLength);// cercle

      //using rbg colors
      const red = (i * barHeight) / 100;
      const green = i / 2;
      const blue = barHeight / 2;
      ctx.fillStyle = `rgb(${blue}, ${green}, ${red})`;

      //using hue colors
      //   const hue = i;
      //   ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
      ctx.fillRect(0, 0, barWtdth, barHeight);
      x += barWtdth;
      ctx.restore();
    }
    //linial visualizer
    // for (let i = 0; i < bufferLength; i++) {
    //   barHeight = dataArray[i] * 2;
    //   const red = (i * barHeight) / 100;
    //   const green = i / 2;
    //   const blue = barHeight / 2;
    //   ctx.fillStyle = `rgb(${green}, ${blue}, ${red})`;
    //   ctx.fillRect(x, canvas.height - barHeight, barWtdth, barHeight);
    //   x += barWtdth;
    // }

    requestAnimationFrame(animate);
  }
  animate();
}

function setAudio() {
  console.log("set audio file");
  const files = this.files;
  const audio: HTMLMediaElement = document.querySelector("audio")!;
  audio.src = URL.createObjectURL(files[0]); //takes whatever we pass to it and convert it into a string 64 bit uints
  audio.load(); //updates the audio element after changing the src ot other settings
  play();
}

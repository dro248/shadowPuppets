let video = document.getElementsByTagName('video')[0]
let timelineElement = document.getElementById("timeline")
let timelineContainer = document.getElementById("timelineContainer")
let zoom = 1.0
let duration = 0.0
let refreshLoop = undefined
let MOUSEOVER = false
let last_known_mouseX = 0

// fit canvas to window when it loads and resizes
window.onload = function(){
  resizeTimeline(timelineElement, window, zoom)

  // when video is ready, get time duration (in seconds)
  setInterval(() => {
    if (video.readyState > 0){
      duration = video.duration
      console.log("duration: " + duration)

      // exit setInterval loop
      clearInterval(true)
    }
  }, 100)
}

window.onresize = function(){
  resizeTimeline(timelineElement, window, zoom)
}

timelineElement.addEventListener('mouseover', (event) => {
  MOUSEOVER = true
  refreshTimeline(timeline, event)
})

timelineElement.addEventListener('mouseout', (event) => {
  MOUSEOVER = false
  refreshTimeline(timelineElement)
})

timelineElement.addEventListener('mousewheel', (event) => {
  zoom = (!event.shiftKey) ? scrollHandler(event.wheelDelta, zoom) : zoom;

  resizeTimeline(timelineElement, window, zoom)
})

timelineElement.addEventListener('mousemove', (event) => {
  refreshTimeline(timelineElement)
})

timelineElement.addEventListener('click', (event) => {
  let ratio = event.x / timelineElement.width;
  video.currentTime = duration * ratio;
  refreshTimeline(timelineElement, event)
})

video.addEventListener('play', (event) => {
  console.log("you clicked play")
  REFRESH = true

  refreshLoop = setInterval(function(){
    refreshTimeline(timelineElement, event)
  }, 25)
})

video.addEventListener('pause', (event) => {
  console.log("you clicked PAUSE")
  clearInterval(refreshLoop)
})




function clearTimeline(timeline){
  let context = timeline.getContext('2d')
  context.clearRect(0,0, timeline.width, timeline.height)
}



function resizeTimeline(timeline, browser_window, zoomFactor){
  timeline.width = browser_window.innerWidth * zoomFactor;
  timelineElement.height = "100";
}

function scrollHandler(scrollDelta, zoom){
  // zoom in
  if (scrollDelta > 0 && zoom < 16.0){
    return zoom * 1.25;
  }
  // zoom out
  else if (scrollDelta < 0 && zoom > 1.0){
    return zoom / 1.25;
  }
  return zoom;
}

function drawRuler(timeline, context){
  // draw 100 lines perfectly proportioned
  let step = timeline.width / 100.0;

  for (let i = 0; i < 100; i++){
    context.beginPath();
    context.moveTo(step * i, 0);
    context.lineTo(step * i, 10);
    context.stroke();
  }
}

function drawProgressBar(timeline, duration, currentTime){
  let context = timeline.getContext("2d")
  let topLeftX = 0,
      topLeftY = 0,
      bottomRightX = timeline.width * (currentTime / duration),
      bottomRightY = 100
  context.fillStyle = "lightblue"
  context.fillRect(topLeftX, topLeftY, bottomRightX, bottomRightY)
}

function drawScrubline(timeline, event){
  // Update last_known_mouseX
  last_known_mouseX = (event) ? event.x : last_known_mouseX;

  let context = timeline.getContext("2d")
  context.beginPath();
  context.moveTo(last_known_mouseX, 0);
  context.lineTo(last_known_mouseX, timeline.height);
  context.strokeStyle = 'purple';
  context.stroke();
}

function refreshTimeline(timeline){
  clearTimeline(timeline)
  drawProgressBar(timeline, duration, video.currentTime)
  if (MOUSEOVER){
    drawScrubline(timeline, event)
  }

}
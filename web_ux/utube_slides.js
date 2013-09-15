//Ahmed Hefny
//Carnegie Mellon University

//Sep 11, 2013

var ytPlayer;
var indexDiv;
var slideDiv;
var currentSlide = -1;
var currentSegment = -1;	//Indicates the closest past or current slide that is visible in the index
		
var slideList;
var slideTupleWidth = 4;
var numSlides = 0; 

var activeStyle="background-color: #222222; color: #FFFFFF";
var inactiveStyle="background-color: #FFFFFF; color: #000000";
var utubeWidth = 640;
var utubeHeight = 480;

function setVideoDims(width, height) {
	utubeWidth = width;
	utubeHeight = height;
}

function setIndexStyle(activeStyleString, inactiveStyleString) {
	activeStyle=activeStyleString;
	inactiveStyle=inactiveStyleString;
}

//Initializes and starts player
//Parameters:
//	videoId: Video Id in youtube
//	slideConfig: A list that specifies slide configation. Each slide is specified by four elements (in order):
//      	* Display time (in seconds)
//      	* Image path
//      	* Label in the index
//      	* Indentation level in the index (Set to 0 in order not to in the index) [Currently 2 levels are supported]
//	utubeDivId: Id of HTML DIV element to display YouTube player
//	slideDivId: Id of HTML DIV element to display slides
//	indexDivId: Id of HTML DIV element to display the index
function initYoutubeAndSlides(videoId, slideConfig
	, utubeDivId, slideDivId, indexDivId) {
	slideList = slideConfig;
	numSlides = slideList.length/slideTupleWidth;
	var params = { allowScriptAccess: "always" };
	var atts = { id: "myytplayer__AH13" };
	swfobject.embedSWF("http://www.youtube.com/v/" + videoId + "?enablejsapi=1&playerapiid=ytplayer&version=3",
                        utubeDivId, utubeWidth, utubeHeight, "8", null, null, params, atts);

	indexDiv = indexDivId;
	slideDiv = slideDivId;
}

function onYouTubePlayerReady(playerId) {
	ytPlayer = document.getElementById("myytplayer__AH13");
	buildIndex();
	ytPlayer.playVideo();
	window.setInterval(updateState, 200);
	updateState();
}

function buildIndex() {
	var indexHTML = "";

	for(var i = 0; i < numSlides; i++) {
		var offset = i * slideTupleWidth;
		if(slideList[offset + 3] > 0) {
			var indentation = " &nbsp;&nbsp;&nbsp;";
			if(slideList[offset + 3] > 1) {indentation += "&nbsp;&nbsp;&nbsp;&nbsp;- ";}			

			indexHTML += "<div id=\"slides_idx_" + i + "\" onclick=\"gotoSlide(" + i + ")\" style=\"" + inactiveStyle + "\">"
				+ "[" + formatTime(slideList[offset]) + "]" + indentation
				+ slideList[offset+2]  +  "</div>";
		}
	}

	document.getElementById(indexDiv).innerHTML = indexHTML;
}

function updateState() {
	var playerTime = ytPlayer.getCurrentTime();
	newSlide = 0;
	newSegment = 0;
	while(newSlide < numSlides-1 && slideList[(newSlide+1)*slideTupleWidth] <= playerTime) {
		newSlide++;
		if(slideList[(newSlide)*slideTupleWidth + 3] > 0) {newSegment = newSlide;}
	}

	if(newSlide != currentSlide) {
		var imageFile = slideList[newSlide*slideTupleWidth + 1];
		document.getElementById(slideDiv).innerHTML = "<img src=\"" + imageFile + "\" width=100% height=100%  />";
		currentSlide = newSlide;
	}

	if(newSegment != currentSegment) {
		document.getElementById("slides_idx_" + newSegment).setAttribute("style", activeStyle);
		if(currentSegment != -1) {
			document.getElementById("slides_idx_" + currentSegment).setAttribute("style", inactiveStyle);
		}

		document.getElementById("slides_idx_" + newSegment).scrollIntoView();
		currentSegment = newSegment;
	}
}		

function gotoSlide(slideId) {
	ytPlayer.seekTo(slideList[slideId * slideTupleWidth], true);
	updateState();
}

function formatTime(timeInSeconds)
{
	var out="";
	timeInSeconds = timeInSeconds;
	var hours = Math.floor(timeInSeconds / 3600);
	var minutes = Math.floor((timeInSeconds % 3600) / 60);
	var seconds = Math.floor(timeInSeconds % 60);
	return hours + ":" + Math.floor(minutes/10) + minutes%10 + ":" + Math.floor(seconds/10) + seconds%10;
}


var imgPath = "images/";
var contentPath = "content/"
var images = {
	"case": "case.png",
	"gpu": "graphicsCard.png",
	"cpu": "cpu.png",
	"ram": "ram.png",
	"motherboard": "mobo.png",
	"hdd": "hdd.png",
	"psu": "psu.png"
}
var names = {
	"case": "case",
	"gpu": "graphics card",
	"cpu": "processor",
	"ram": "ram card",
	"motherboard": "motherboard",
	"hdd": "hard drive",
	"psu": "power supply"
}
function initMain(){
	createLinks();
}
function createLinks(){
	var parts =  document.getElementsByClassName("part");
	var holder = document.getElementById("partsWrapper");
	var newParts = [];
	for(var i = 0; i < parts.length; i++){
		var newLink = document.createElement("A");
		newLink.className ="partLink";
		newLink.href = "content.html#" + parts[i].id;
		newLink.appendChild(parts[i].cloneNode(true));
		newParts.push(newLink);
	}
	holder.innerHTML ="";
	for(var i = 0; i < newParts.length; i++){
		holder.appendChild(newParts[i]);
	}
	
}
function initContent(){
	changeTitle();
	loadImage();
	loadContent();
}
function loadImage(){
	var urlId = location.hash.slice(1);
	var newImg = document.createElement("IMG");
	newImg.id ="mainImg";
	newImg.src = imgPath + images[urlId];
	document.getElementById("imageHolder").appendChild(newImg);
}
function changeTitle(){
	var urlId = location.hash.slice(1);
	document.getElementsByTagName("header")[0].children[0].innerHTML = "What does a " + names[urlId] + " do?";
}
function loadContent(){
	var urlId = location.hash.slice(1);
	var newFrame = document.createElement("IFRAME");
	newFrame.className = "content";
	newFrame.src = contentPath+urlId+".html";
	document.body.appendChild(newFrame);
}
function initEmbed(){
	loadSlide();
}
function loadSlide(){
	w3.slideshow(".slide",3000);
}
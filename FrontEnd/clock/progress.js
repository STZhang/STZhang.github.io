function firstRow() {
	document.getElementById("col2.1").style.background = "linear-gradient(to bottom, #265649 , #95efcb)";
	document.getElementById("col2.2").style.background = "linear-gradient(to bottom, #9ab3ac , #d0f8e8)";
	document.getElementById("col2.3").style.background = "linear-gradient(to bottom, #9ab3ac , #d0f8e8)";
	document.getElementById("col2.4").style.background = "linear-gradient(to bottom, #9ab3ac , #d0f8e8)";
	document.getElementById("content2.1").style.overflowY = "scroll";
	document.getElementById("content2.2").style.overflowY = "hidden";
	document.getElementById("content2.3").style.overflowY = "hidden";
	document.getElementById("content2.4").style.overflowY = "hidden";
	document.getElementById("col1.1").style.color = "#525153";
	document.getElementById("col1.2").style.color = "#ffffff";
	document.getElementById("col1.3").style.color = "#ffffff";
	document.getElementById("col1.4").style.color = "#ffffff";
	document.getElementById("link").style.color = "#2EC186";
	document.getElementById("rightpiece").style.color = "#265649";
}

function secondRow() {
	document.getElementById("col2.1").style.background = "linear-gradient(to bottom, #9ab3ac , #d0f8e8)";
	document.getElementById("col2.2").style.background = "linear-gradient(to bottom, #265649 , #95efcb)";
	document.getElementById("col2.3").style.background = "linear-gradient(to bottom, #9ab3ac , #d0f8e8)";
	document.getElementById("col2.4").style.background = "linear-gradient(to bottom, #9ab3ac , #d0f8e8)";
	document.getElementById("content2.2").style.overflowY = "scroll";
	document.getElementById("content2.1").style.overflowY = "hidden";
	document.getElementById("content2.3").style.overflowY = "hidden";
	document.getElementById("content2.4").style.overflowY = "hidden";
	document.getElementById("col1.2").style.color = "#525153";
	document.getElementById("col1.1").style.color = "#ffffff";
	document.getElementById("col1.3").style.color = "#ffffff";
	document.getElementById("col1.4").style.color = "#ffffff";
	document.getElementById("link").style.color = "#265649";
	document.getElementById("rightpiece").style.color = "#265649";
}

function thirdRow() {
	document.getElementById("col2.1").style.background = "linear-gradient(to bottom, #9ab3ac , #d0f8e8)";
	document.getElementById("col2.2").style.background = "linear-gradient(to bottom, #9ab3ac , #d0f8e8)";
	document.getElementById("col2.3").style.background = "linear-gradient(to bottom, #265649 , #95efcb)";
	document.getElementById("col2.4").style.background = "linear-gradient(to bottom, #9ab3ac , #d0f8e8)";
	document.getElementById("content2.3").style.overflowY = "scroll";
	document.getElementById("content2.1").style.overflowY = "hidden";
	document.getElementById("content2.2").style.overflowY = "hidden";
	document.getElementById("content2.4").style.overflowY = "hidden";
	document.getElementById("col1.3").style.color = "#525153";
	document.getElementById("col1.2").style.color = "#ffffff";
	document.getElementById("col1.1").style.color = "#ffffff";
	document.getElementById("col1.4").style.color = "#ffffff";
	document.getElementById("link").style.color = "#265649";
	document.getElementById("rightpiece").style.color = "#265649";
}

function fourthRow() {
	document.getElementById("col2.1").style.background = "linear-gradient(to bottom, #9ab3ac , #d0f8e8)";
	document.getElementById("col2.2").style.background = "linear-gradient(to bottom, #9ab3ac , #d0f8e8)";
	document.getElementById("col2.3").style.background = "linear-gradient(to bottom, #9ab3ac , #d0f8e8)";
	document.getElementById("col2.4").style.background = "linear-gradient(to bottom, #265649 , #95efcb)";
	document.getElementById("content2.4").style.overflowY = "scroll";
	document.getElementById("content2.1").style.overflowY = "hidden";
	document.getElementById("content2.2").style.overflowY = "hidden";
	document.getElementById("content2.3").style.overflowY = "hidden";
	document.getElementById("col1.4").style.color = "#525153";
	document.getElementById("col1.2").style.color = "#ffffff";
	document.getElementById("col1.3").style.color = "#ffffff";
	document.getElementById("col1.1").style.color = "#ffffff";
	document.getElementById("link").style.color = "#265649";
	document.getElementById("rightpiece").style.color = "#2EC186";
}

var modal = document.getElementById('myModal');
var popup = document.getElementById('rightpiece');
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal 
popup.onclick = function() {
    modal.style.display = "block";
}

span.onclick = function() {
    modal.style.display = "none";
}

window.onclick = function(event) {
    if (event.target == modal) {
        modal.style.display = "none";
    }
}
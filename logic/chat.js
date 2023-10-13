var friendNameContainer = document.getElementById("friend-name")



var friendDetails = sessionStorage.getItem('chatMate').split(".")
var friendID = friendDetails[0]

friendNameContainer.innerHTML = friendDetails[1] + " " + friendDetails[2]


// web socket
const socket = io()
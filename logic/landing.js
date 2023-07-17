var communitySection = document.getElementById("community")


//fetch all registered users from api
var userData
var serverResponse

fetch("http://localhost:3000/users", {
        method: 'GET',
    })
    .then((response) => {
           serverResponse = response

           return response.json()
        })
        .then(jsonResponse => {
            userData = jsonResponse

            if (serverResponse.status === 200){
                communitySection.innerHTML = ' '

                for(var profile of userData["allUsers"]){

                    communitySection.innerHTML += `<div class="profile">
                        <div class="image-wrap">
                            <img src="../assets/images/test.jpg" alt="" class="img">
                        </div>
                        <div class="details">
                            <span class="span">${ profile.name }</span>
                            <span class="span">${ profile.location }</span>
                            <span class="span">${ profile.interests }</span>
                        </div>
                    <\div>`
                } 
            }
        })
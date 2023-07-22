var communitySection = document.getElementById("community")
var usernameSection = document.getElementById("user-name")
var logoutButton = document.getElementById("logout")
var logoutError = document.getElementById("logout-error")



//access and refresh tokens
var accessToken = sessionStorage.getItem('accessToken')
var refreshToken = sessionStorage.getItem('refreshToken')

if (!accessToken){
    window.location.href = "../markup/landing.html"
}



//login session management
function sessionManagement(accessToken){
    var accessToken_decoded = jwt_decode(accessToken)

    var loginDuration = accessToken_decoded.exp - accessToken_decoded.iat //in seconds

    var elapseTime = Date.now() + loginDuration

    if(!sessionStorage.getItem('expiration')){
        sessionStorage.setItem('expiration', elapseTime)
    }

}

sessionManagement(accessToken)


setInterval(function(){
    if (Date.now() >= sessionStorage.getItem('expiration')){
        //new access token using the refresh token

                //wipe off 'expiration' in sessionStorage

                //pass it to sessionManagement



        //no new access token using the refresh token

                //log user out

    }
}, 1000)




//fetch: user profile details, friends, sent friend requests, received friend requests
var userDetails
var userDetailsResponse

var userDetailsHeader = new Headers()
userDetailsHeader.append('x-access-token', accessToken)

fetch("http://localhost:3000/userDetails", {
        method: 'GET',
        headers: userDetailsHeader
    })
    .then((response) => {
            userDetailsResponse = response

            return response.json()
        })
        .then(jsonResponse => {
            userDetails = jsonResponse
            
            if (userDetailsResponse.status === 200){
                const {
                    name,
                    photo,
                    friends,
                    sentFriendRequests,
                    receivedFriendRequests
                } = userDetails.details
    
                usernameSection.innerHTML = `${name}`
            }
        })







//fetch all registered users from api
var userData
var userDataResponse

fetch("http://localhost:3000/users", {
        method: 'GET',
    })
    .then((response) => {
           userDataResponse = response

           return response.json()
        })
        .then(jsonResponse => {
            userData = jsonResponse

            if (userDataResponse.status === 200){
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




var logoutHeader = new Headers()
logoutHeader.append('x-refresh-token', refreshToken)

logoutButton.addEventListener("click", function(){

    //invalidate refresh token in api
    fetch("http://localhost:3000/auth/logout", {
        method: 'POST',
        headers: logoutHeader
    })
    .then((response) => {
        if (response.status === 200) {
            //wipe off tokens
            sessionStorage.removeItem('accessToken')
            sessionStorage.removeItem('refreshToken')


            window.location.href = "../markup/landing.html"

        } else {
            //error - could not logout
            logoutError.innerHTML = 'there was an error logging out, try again later'
            logoutError.style.color = 'white'
            logoutError.style.backgroundColor = 'red'
            logoutError.style.padding = '7px'
            logoutError.style.fontSize = '13px'
            logoutError.style.display = 'inline-block'
            logoutError.style.marginTop = '30px'
            logoutError.style.marginLeft = '2.5%'
        }
    })

})
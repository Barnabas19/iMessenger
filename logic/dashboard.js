var communitySection = document.getElementById("community")
var usernameSection = document.getElementById("user-name")
var logoutButton = document.getElementById("logout")
var logoutError = document.getElementById("logout-error")
var sessionExpired = document.getElementById("session-expired")
var sentList = document.getElementById("sent-list")



//access and refresh tokens
var accessToken = sessionStorage.getItem('accessToken')
var refreshToken = sessionStorage.getItem('refreshToken')

if (!accessToken){  //no access token
    window.location.href = "../markup/landing.html"
}



//logout a user
var logoutHeader = new Headers()
logoutHeader.append('x-refresh-token', refreshToken)

function logout(){
    //invalidate refresh token in api
    fetch("http://localhost:3000/auth/logout", {
        method: 'POST',
        headers: logoutHeader
    })
    .then((response) => {
        if (response.status === 200) {
            //wipe off tokens on frontend
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
}

logoutButton.addEventListener("click", logout)




//login session management
// function sessionManagement(accessToken){
//     var accessToken_decoded = jwt_decode(accessToken)

//     var loginDuration = accessToken_decoded.exp - accessToken_decoded.iat //in seconds
//     console.log(loginDuration)

//     var elapseTime = (Date.now() * 1000) + loginDuration
//     console.log(elapseTime)

//     if(!sessionStorage.getItem('expiration')){
//         sessionStorage.setItem('expiration', elapseTime)
//     }

// }

// sessionManagement(accessToken)


// var accesstokenHeader = new Headers()
// accesstokenHeader.append('refresh-token', refreshToken)

// var getTokenResponse

// setInterval(function(){
//     if ((Date.now() * 1000) >= sessionStorage.getItem('expiration')){

//         console.log(Date.now() * 1000)
//         //get new access token using the refresh token
//         fetch("http://localhost:3000/auth/accesstoken", {
//             method: 'GET',
//             headers: accesstokenHeader
//         })
//         .then(response => {
//             getTokenResponse = response

//             return response.json()
//         })
//         .then(jsonResponse => {
//             if(getTokenResponse.status === 200){   //new access token retrieved

//                 //wipe off 'expiration' in sessionStorage
//                 sessionStorage.removeItem('expiration')

//                 //replace access token and refresh token in sessionStorage
//                 sessionStorage.removeItem('accessToken')
//                 sessionStorage.removeItem('refreshToken')
//                 sessionStorage.setItem('accessToken', jsonResponse.accessToken)
//                 sessionStorage.setItem('refreshToken', refreshToken)


//                 //refresh page
//                 window.location.reload()


//             } else {    //no new access token retrieved
                
//                 //session expired. Log user out
//                 sessionExpired.innerHTML = 'session expired...logging you out'
//                 sessionExpired.style.color = 'white'
//                 sessionExpired.style.backgroundColor = 'yellow'
//                 sessionExpired.style.padding = '7px'
//                 sessionExpired.style.fontSize = '13px'
//                 sessionExpired.style.display = 'inline-block'
//                 sessionExpired.style.marginTop = '30px'
//                 sessionExpired.style.marginLeft = '2.5%'

//                 setTimeout(logout, 200000)
//             }

//         })

//     }
// }, 100000)




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

                sentList.innerHTML = ''

                for (var request of sentFriendRequests){
                    sentList.innerHTML += `<div class="friend">
                            <div class="img-container">
                               <img src="../assets/images/test.jpg" class="img" alt="">
                            </div>
                            <div class="details">
                                <span class="friend-name">${ request.name }</span>
                                <span class="friend-location">${ request.location }</span>
                                <span class="friend-interests">${ request.interests }</span>
                            </div>
                            <button class="revoke-button" id=${ request._id }>revoke</button>
                    </div>` 
                }

                var revokeButtons = document.querySelectorAll(".revoke-button")

                revokeButtons.forEach((button) => {
                    button.addEventListener("click", () => {
    
                        var buttonID = button.id    //string

                        //send revoke-friend-id and access token in post request header
                        var revokeFriendHeader = new Headers()
                        revokeFriendHeader.append('x-access-token', accessToken)
                        revokeFriendHeader.append('revoke-friend-id', buttonID)

                        var revokeFriendResponse
            
                        fetch("http://localhost:3000/revokeFriend", {
                            method: 'POST',
                            headers: revokeFriendHeader
                        })
                        .then(response => {
                            revokeFriendResponse = response
                
                            return response.json()
                        })
                        .then(jsonResponse => {
                            if (revokeFriendResponse.status === 200){
                                //show success notification
                                button.innerHTML = 'revoked✔'
                                button.style.color = 'green'
                                button.disabled = true
                                
                            } else {
    
                                //show failure notification
                                var failureTextSpan = document.createElement("span")
                                failureTextSpan.innerHTML = "could not complete action"
                                failureTextSpan.style.color = 'red'
                                failureTextSpan.style.fontSize = '13px'
                                failureTextSpan.style.display = 'inline-block'
    
                                button.parentNode.appendChild(failureTextSpan)
                            }
                        })
                    })
                })
            }
        })







//fetch all registered users for rendering on user dashboard
var userData
var userDataResponse

var usersDashboardHeader = new Headers()
usersDashboardHeader.append('x-access-token', accessToken)

fetch("http://localhost:3000/usersDashboard", {
        method: 'GET',
        headers: usersDashboardHeader
    })
    .then((response) => {
           userDataResponse = response

           return response.json()
        })
        .then(jsonResponse => {
            userData = jsonResponse

            if (userDataResponse.status === 200){
                communitySection.innerHTML = ' '

                for(var profile of userData.users_dashboard){

                    communitySection.innerHTML += `<div class="profile">
                        <div class="image-wrap">
                            <img src="../assets/images/test.jpg" alt="" class="img">
                        </div>
                        <div class="details">
                            <span class="span">${ profile.name }</span>
                            <span class="span">${ profile.location }</span>
                            <span class="span">${ profile.interests }</span>
                            <button class="add-friend" id=${ profile._id }>Add friend</button>
                        </div>
                    <\div>`
                } 
            }


            var addFriendButtons = document.querySelectorAll(".add-friend")
            
            var addFriendResponse
            
            addFriendButtons.forEach((button) => {
                button.addEventListener("click", () => {

                    var buttonID = button.id    //string
            
                    //send potential-friend-id and access token in post request header
                    var addFriendHeader = new Headers()
                    addFriendHeader.append('x-access-token', accessToken)
                    addFriendHeader.append('potential-friend-id', buttonID)
            
            
                    fetch("http://localhost:3000/addFriend", {
                        method: 'POST',
                        headers: addFriendHeader
                    })
                    .then(response => {
                        addFriendResponse = response
            
                        return response.json()
                    })
                    .then(jsonResponse => {
                        if (addFriendResponse.status === 200){
                            //show success notification
                            button.innerHTML = 'Added✔'
                            button.style.color = 'green'
                            button.disabled = true
                            
                        } else {

                            //show failure notification
                            var failureTextSpan = document.createElement("span")
                            failureTextSpan.innerHTML = "could not send request"
                            failureTextSpan.style.color = 'red'
                            failureTextSpan.style.fontSize = '13px'
                            failureTextSpan.style.display = 'inline-block'

                            button.parentNode.appendChild(failureTextSpan)
                        }
                    })
                })
            })
        })
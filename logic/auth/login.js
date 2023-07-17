var loginForm = document.getElementById("loginForm")
var serverResponseContainer = document.getElementById("serverResponse")
var submitButton = document.getElementById("submit")

loginForm.addEventListener("submit", function(e){
    e.preventDefault()
    
    var formData = new FormData(e.target)

    submitButton.disabled = true
    submitButton.style.backgroundColor = "rgb(185, 182, 182)"

    
    fetch("http://localhost:3000/auth/login", {
        method: 'POST',
        body: formData
    })
    .then(response => {
        var status = response.status

        if (status === 200){

            //redirect to user dashboard page
            window.location.href = "../markup/dashboard.html"
            
        } else if (status === 401) {
            //invalid email or password notification
            serverResponseContainer.innerHTML = '<span class="notification-failure">Invalid email or password</span>'


        } else {
            //internal server error notification
            serverResponseContainer.innerHTML = '<span class="notification-internalError">Internal server error. Please try again later</span>'

        }

    })

})
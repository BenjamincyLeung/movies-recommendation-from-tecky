window.onload = async () => {
    console.log('This is js');
    await initLoginForm();
}

/*SECTION A -LOGIN */
async function initLoginForm() {
   
    const loginForm = document.querySelector("#form-login");
    loginForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        console.log('This is initLoginForm');
        const formObject = {
            username: loginForm.username.value,
            password: loginForm.password.value,
        };

        const resp = await fetch("/api/user/login", {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(formObject),
        });
        console.log(resp)
        if (resp.status === 200) {
            alert("success");
            window.location.href = "../html/Home.html"
            return;
        }
        if (resp.status === 400) {
            alert("入錯左")
            resetFun()
            return;
        }
     
    });
}
function resetFun() {
    document.querySelector("#form-login").reset();
    /*SECTION A -LOGIN  ENDS*/
}

function signOut() {
    var auth2 = api.auth2.getAuthInstance();
    auth2.signOut().then(function () {
        console.log('User signed out.');
    });
}


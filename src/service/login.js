const baseURL = "https://acetennis.herokuapp.com";

window.onload = () => {
    document.querySelector('.spinner-border').style.display = 'none';
}
// go to home
const navBarLogo = document.querySelector('.navBar__logo')
navBarLogo.addEventListener('click', () => {
    window.location.href = "../../index.html";
});

const submit = document.querySelector('.login-btn');
submit.addEventListener('click', checkValidation);

const signin = document.querySelector('.signin');
signin.addEventListener('click', () => {
    window.location.href = "./signup.html";
})

function checkValidation(event) {
    event.preventDefault();

    const RegExp = /[a-zA-Z0-9]{4,12}$/;    // for username
    const p_RegExp = /[a-zA-Z0-9]{6,12}$/;  // for password

    // username validation
    const username = document.querySelector('#username');
    if(!username.value || !RegExp.test(username.value)) {
        username.classList.add("invalid");
        username.focus();
        return false;
    }

    const password = document.querySelector('#password');
    if(!password.value || !p_RegExp.test(password.value)) {
        password.classList.add("invalid");
        password.focus();
        return false;
    }

    showSpinner()
    postLoginUser(username.value);
}

function showSpinner() {
    document.querySelector('.spinner-border').style.display = 'block';
}

function hideSpinner() {
    document.querySelector('.spinner-border').style.display = 'none';
}

function postLoginUser(username) {
    const loginForm = document.querySelector(".login__form");

    // Convert the form fields into JSON
    const formDataJson = JSON.stringify(Object.fromEntries(new FormData(loginForm)));
    console.log(`formdate ${formDataJson}`)

    // Post the json to the backend
    fetch(`${baseURL}/auth/login`, {
        method: "POST",
        headers: {
            'Content-Type': "application/json"
        },
        body: formDataJson
    })
    .then(res => {
        if(res.status == 200) {
            return res.json();
        } else {
            throw new Error(res.json());
        }
    })
    .then(res => {
        // save jwt token
        localStorage.setItem('TOKEN', res.token);
        sessionStorage.setItem('isLogin', 'true');
        sessionStorage.setItem('username', username);

        hideSpinner();
        window.location.href = "../../index.html";
    })
    .catch(error => {
        hideSpinner();
        const username = document.querySelector('#username');
        username.value = "";

        const password = document.querySelector('#password');
        password.value ="";
        // console.log(error);
        // console.log("Login user request failed");
    });

}
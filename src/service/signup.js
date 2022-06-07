const baseURL = "https://acetennis.herokuapp.com";

window.onload = () => {
    document.querySelector('.spinner-border').style.display = 'none';
}

const submit = document.querySelector('.register-btn');
submit.addEventListener('click', checkValidation);

const signin = document.querySelector('.signin');
signin.addEventListener('click', () => {
    window.location.href = "./login.html";
})

// To remove red color border when focus lost
const signupForm = document.querySelector('.signup__form');
signupForm.addEventListener('focusout', (event) => {
    event.target.classList.remove("invalid");
});

// go to home
const navBarLogo = document.querySelector('.navBar__logo')
navBarLogo.addEventListener('click', () => {
    window.location.href = "../../index.html";
});


function checkValidation(event) {
    event.preventDefault();

    const RegExp = /^[a-zA-Z0-9]{4,12}$/;    // for username
    const p_RegExp = /^[a-zA-Z0-9]{6,12}$/;  // for password
    const e_RegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;  //  for email
    const n_RegExp =  /^[a-zA-Z ]{3,50}$/;

    // username validation
    const username = document.querySelector('#username');
    if(!username.value || !RegExp.test(username.value)) {
        username.classList.add("invalid");
        username.focus();
        return false;
    }

    const fullname = document.querySelector('#fullname');
    if(!fullname.value || !n_RegExp.test(fullname.value)) {
        fullname.classList.add("invalid");
        fullname.focus();
        return false;
    }

    const email = document.querySelector('#email');
    if(!email.value || !e_RegExp.test(email.value)) {
        email.classList.add("invalid");
        email.focus();
        return false;
    }

    const password = document.querySelector('#password');
    if(!password.value || !p_RegExp.test(password.value)) {
        password.classList.add("invalid");
        password.focus();
        return false;
    }

    const confirmPassword = document.querySelector('#confirm-password');
    if(!confirmPassword || (password.value !== confirmPassword.value)) {
        confirmPassword.classList.add("invalid");
        confirmPassword.focus();
        return false;
    }

    showSpinner();
    postCreateUser();
}

function showSpinner() {
    document.querySelector('.spinner-border').style.display = 'block';
}

function hideSpinner() {
    document.querySelector('.spinner-border').style.display = 'none';
}

function postCreateUser() {
    const createUserForm = document.querySelector(".signup__form");

    // Convert the form fields into JSON
    const formDataJson = JSON.stringify(Object.fromEntries(new FormData(createUserForm)));

    // Post the json to the backend
    fetch(`${baseURL}/auth/signup`, {
        method: "POST",
        headers: {
            'content-Type': "application/json"
        },
        body: formDataJson
    })
    .then(res => res.json())
    .then(res => {
        // save jwt token
        localStorage.setItem('TOKEN', res.token);
        sessionStorage.setItem('isLogin', 'true');
        hideSpinner();

        // window.location.href = "../../src/index.html";
    })
    .catch(error => {
        console.log(error);
        console.log("Create user request failed");
    });
}
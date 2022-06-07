const baseURL = "https://acetennis.herokuapp.com";

let userInfo = {};
const token = localStorage.getItem('TOKEN');

window.onload = () => {
    // get user information
    fetch(`${baseURL}/members?level=`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
        .then(response => response.json())
        .then(response => {
            userInfo = {...response};
            document.querySelector('#username').value = userInfo.username;
            document.querySelector('#name').value = userInfo.name;
            document.querySelector('#email').value = userInfo.email;
            switch (userInfo.level) {
                case 'H' :
                    document.querySelector('#high').checked = true;
                    break;
                case 'M' :
                    document.querySelector('#middle').checked = true;
                    break;
                case 'L' :
                    document.querySelector('#low').checked = true;
                    break;
            }
        })
        .catch(error => {
            console.log("Client error: " + error);
        })
}

// navbar
const navBarIcon = document.querySelector('.navBar__icon');
const navBarMenu = document.querySelector('.navBar__menu');
const icon = document.querySelector('.icon');
const navBarLogo = document.querySelector('.navBar__logo')

// go to home
navBarLogo.addEventListener('click', () => {  
    window.location.href = "../../index.html";
});

// navBar toggle
navBarIcon.addEventListener('click', () => {
    navBarMenu.classList.toggle('open');
});

// Handle scrolling when tapping on the navbar menu
navBarMenu.addEventListener('click', (event) => {
    const target = event.target;
    const link = target.dataset.link;

    if(link == null) {
        return;
    }

    window.location.href = "../../index.html";
});

const submit = document.querySelector('.register-btn');
submit.addEventListener('click', checkValidation);

// To remove red color border when focus lost
const accountForm = document.querySelector('.account__form');
accountForm.addEventListener('focusout', (event) => {
    event.target.classList.remove("invalid");
});

accountForm.addEventListener('keydown', (event) => {
    document.querySelector(".register-btn").innerText = "Save";
});

function checkValidation(event) {
    event.preventDefault();

    const e_RegExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;  //  for email
    const n_RegExp =  /^[a-zA-Z ]{3,50}$/;

    const fullname = document.querySelector('#name');
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

    showSpinner();
    postEditUser();
}

function showSpinner() {
    document.querySelector('.spinner-border').style.display = 'block';
}

function hideSpinner() {
    document.querySelector('.spinner-border').style.display = 'none';
}

function postEditUser() {
    const editUserForm = document.querySelector(".account__form");

    // Convert the form fields into JSON
    const formDataJson = JSON.stringify(Object.fromEntries(new FormData(editUserForm)));

    // Put the json to the backend
    fetch(`${baseURL}/members`, {
        method: "PUT",
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        },
        body: formDataJson
    })
    .then(res => {
        if(res.status === 200) {
            hideSpinner();
            document.querySelector(".register-btn").innerText = "Saved";
        }
    })
    .catch(error => {
        console.log(error);
        console.log("Edit user request failed");
    });
}
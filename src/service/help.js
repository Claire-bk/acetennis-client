// go to home
const navBarLogo = document.querySelector('.navBar__logo');
navBarLogo.addEventListener('click', () => {
    console.log( `onclick`)
    window.location.href = "../../index.html";
});

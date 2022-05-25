const baseURL = "https://acetennis.herokuapp.com";

window.onload = () => {
    // let theme = document.getElementsByTagName("link")[0];
  if (localStorage.getItem("DarkTheme") === "true") {
    document.getElementById("darkmode").checked = true;
    document.documentElement.classList.toggle("dark-mode");
  } else {
    document.getElementById("darkmode").checked = false;
  }

  if(localStorage.getItem("PlayerId")) {
    displayJoinMatch('cancel');
  } else {
      displayJoinMatch('join');
  }

  if(sessionStorage.getItem("isLogin") === "true" && sessionStorage.getItem("username")) {
      document.querySelector('.icon__join').classList.add('invisible');
      document.querySelector('.icon__logout').classList.remove('invisible');
  }
  else {
    document.querySelector('.icon__logout').classList.add('invisible');
  }
};

// Service worker registration
// if('serviceWorker' in navigator) {
//     // Register a service worker hosted at the root of the
//     // site using the default scope.
//     navigator.serviceWorker
//         .register('../../sw.js',)
//         .then(function(registration) {
//         })
//         .catch(function(error) {
//             console.log('Service worker registration failed, error: ', error);
//         });
// }

// navbar
const navBarIcon = document.querySelector('.navBar__icon');
const navBarMenu = document.querySelector('.navBar__menu');
const icon = document.querySelector('.icon');
const navBarLogo = document.querySelector('.navBar__logo')

// go to home
navBarLogo.addEventListener('click', () => {  
    navBarLogo.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
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

    const element = document.querySelector(link);
    element.scrollIntoView({behavior: "smooth", block: "center", inline: "center"});
    navBarMenu.classList.toggle('open');
});

// link to sign up page
const signUp = document.querySelector('.icon__join');
signUp.addEventListener('click', (event) => {
    window.location = '../public/component/signup.html';
})

// dark mode
const themeToggle = document.querySelector('#darkmode');
themeToggle.addEventListener('change', (event) => {
    let checked = event.target.checked;
    console.log("darkmode ${checked")

    if(checked) {
        localStorage.setItem("DarkTheme", "true");
        document.documentElement.classList.toggle("dark-mode");
    } else {
        localStorage.setItem("DarkTheme", "false");
        document.documentElement.classList.toggle("dark-mode");
    }
})

// logout
const logout = document.querySelector('.icon__logout');
logout.addEventListener('click', () => {
    sessionStorage.clear();
    localStorage.clear();
    window.location = 'index.html';
})

// draw calendar
const date = new Date();
const monthNum = date.getMonth();
const fullYear = date.getFullYear();
const today = date.getDate();
const monthString = ['January', 'Febrary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const lastDayOfMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
let currMonth = monthNum; // 0 to 11
let currYear = fullYear;
// set month
const month = document.querySelector('.month');
month.innerHTML = monthString[monthNum];
// set days
if ((fullYear % 4 == 0 && fullYear % 100 != 0) || fullYear % 400 == 0) {
    // leap year setting
    lastDayOfMonth[1] = 29;
}

const days = document.querySelector('.days');
for(let i=1; i<=lastDayOfMonth[monthNum]; i++) {
    if( i === today) {
        days.innerHTML += `<li class="day" data-day="${i}"><span class="active">${i}</span></li>`;
    } else {
        days.innerHTML += `<li class="day" data-day="${i}">${i}</li>`;
    }
}

days.addEventListener('click', (event) => {
    const date = event.target.dataset.match;

    if(!date) {
        return;
    }

    // previous match
    fetchMatch(parseInt(date), today);
});

function fetchMatch(date, today) {
    const fullDate = `${fullYear}-${currMonth+1}-${date}`;
    const fetchEvent = `${baseURL}/event?date=${fullDate}`;
    const fetchMatch = `${baseURL}/matches?date=${fullDate}`;
    
    (today - date) > 0 ? fetchMatchResult(fetchMatch) : fetchEventInfo(fetchEvent);
}

function fetchMatchResult(url) {
    fetch(url, {
        method: "GET",
        // headers: getHeaders(),
        headers: {
            'content-type': "application/json"
        },
    })
    .then(res => res.json())
    .then(res => {
        displayMatchResult(res);
    })
    .catch(error => {
        console.log(error);
    });
}

const matchInfo = document.querySelector('#match-info');
function displayMatchResult(result) {
    matchInfo.removeAttribute('invisible');
    for(let i=0; i<result.length; i++) {
        matchInfo.innerHTML += `<div class="match-info__result">
            <h3>Court : ${result[i].courtNum}</h3>
            <p>${result[i].playerA1}  :  ${result[i].playerB1}</p>
            <p>${result[i].playerA2}  :  ${result[i].playerB2}</p>
            <p>${result[i].scoreA} : ${result[i].scoreB}</p>
            </div>`
    }
}

function fetchEventInfo(url) {
    fetch(url, {
        method: "GET",
        headers: {
            'content-type': "application/json"
        },
    })
    .then(res => res.json())
    .then(res => {
        console.log(res);
    })
    .catch(error => {
        console.log(error);
    });
}

displayEvents();

// Get event info by month
function displayEvents() {
    // Post the json to the backend 
    // currMonth start from 0
    fetch(`${baseURL}/event?month=${currMonth+1}&year=${currYear}&date=`, {
        method: "GET",
        headers: {
            'content-Type': "application/json"
        },
    })
    .then(res => res.json())
    .then(res => {
        displayMatchDays(res);
        updateJoinMatchText(res);
    })
    .catch(error => {
        console.log(error);
        console.log("Get events request failed");
    });
}

function getJoinMatchInfo() {
    if(!sessionStorage.getItem("isLogin")) {
        return;
    }

    const username = sessionStorage.getItem("username");

    if(!username) {
        return;
    }

    const date = localStorage.getItem("UpcomingMatch");

    if(!date) {
        return;
    }

    fetch(`${baseURL}/players?username=${username}&date=${date}`, {
        method: "GET",
        headers: {
            'content-Type': "application/json"
        },
    })
    .then(res => {
        if(res.status === 400) {
            // player not exist
            localStorage.removeItem("PlayerId");
            displayJoinMatch('join');
            return;
        } else {
            return res.json();
        }
    })
    .then(res => {
        // user already joined a match game
        if(res.id != 'undefined') {
            localStorage.setItem("PlayerId", `${res.id}`);
            displayJoinMatch('cancel');
        }
    })
    .catch(error => {
        localStorage.removeItem("PlayerId");
        displayJoinMatch('join');
    });
}

// Join match
const joinMatch = document.querySelector('#join-match');
const matchText = document.querySelector('.join-match__text');

// Cancel join match
const joinMatchBtn = document.querySelector('.join-match__btn');
const cancelMatchBtn = document.querySelector('.cancel-match__btn');

joinMatchBtn.addEventListener('click', () => {
    const username = sessionStorage.getItem('username');

    // check if user log out
    if(!sessionStorage.getItem('isLogin') && !username) {
        window.location.href = "../public/component/login.html";
        return;
    }

    const matchDate = matchText.getAttribute("data-date");

    if(!matchDate) {
        return;
    }

    // send the jason to the backend
    fetch(`${baseURL}/players`, {
        method: "POST",
        headers: {
            'content-Type': "application/json" 
        },
        body: JSON.stringify({username: `${username}`, date: `${matchDate}`})
    })
    .then(res => res.json())
    .then(res => {
        console.log("join match response ");
        console.log(res);
        // save playerId 
        if(!res.id) {
            localStorage.setItem("PlayerId", `${res}`)
            // display join cancel button
            displayJoinMatch('cancel');
        }
        // cancelMatchBtn.setAttribute("data-playerId", `${res.id}`);
        // console.log(cance.MatchBtn.getAttribute("data-playerId"));
    })
    .catch(error => {
        console.log(error);
        console.log("Fail to join match play");
    });
})

function displayJoinMatch(status) {
    if(status === 'join') {
        joinMatchBtn.classList.remove('invisible');
        cancelMatchBtn.classList.add('invisible');
    } else if(status === 'cancel') {
        joinMatchBtn.classList.add('invisible');
        cancelMatchBtn.classList.remove('invisible');
    }
}

cancelMatchBtn.addEventListener('click', () => {
    // id from playersDB
    const playerId = localStorage.getItem("PlayerId");

    fetch(`${baseURL}/players/${playerId}`, {
        method: "DELETE",
        headers: {
            'content-Type': "application/json" 
        },
    })
    .then(res => {
        // display join match button
        displayJoinMatch('join');
        localStorage.removeItem('PlayerId');
    })
    .catch(error => {
        console.log(error);
        console.log("Fail to cancel match play");
    });
})

// if user already joind match play
getJoinMatchInfo();

function getFormatDate (date) {
    let month = (date.getMonth() + 1).toString();
    let day = date.getDate().toString();
    let year = date.getFullYear();
    if (month.length < 2) {
      month = '0' + month;
    }
    if (day.length < 2) {
      day = '0' + day;
    }
    return [year, month, day].join('-');
}

function updateJoinMatchText(matches) {
    const upcomingDate = findUpcomingDate(matches);

    if(upcomingDate == undefined) {
        joinMatch.setAttribute("class", "invisible");
        joinMatchBtn.setAttribute("class", "invisible");
        localStorage.removeItem("UpcomingMatch");
    } else {
        const formatDate = getFormatDate(upcomingDate);
        matchText.innerHTML = `Upcoming match game <br /> ${upcomingDate.getDate()}  ${monthString[upcomingDate.getMonth()]} ${upcomingDate.getFullYear()}  `;
        matchText.setAttribute("data-date", `${formatDate}`);
        joinMatch.removeAttribute("invisible");
        localStorage.setItem("UpcomingMatch", `${formatDate}`);
    }    
}

function findUpcomingDate(matches) {
    const today = new Date();

    for(let i=0; i<matches.length; i++) {
        const matchDate = new Date(matches[i]["date"]);
        const timeDiff = matchDate - today;
        
        if (timeDiff > 1) {
            const hours = Math.floor(timeDiff / 1000 / 60 / 60);

            if (hours > 1 && hours < 168) {
                return matchDate;
            }
        }
    }

    return undefined;
}

function displayMatchDays(matches) {
    for(let i=0; i<matches.length; i++) {
        const dateOfMonth = new Date(matches[i]["date"]);
        const date = dateOfMonth.getDate();

        for(let j=1; j<=lastDayOfMonth[monthNum]; j++) {
            const day = document.querySelector(`.day[data-day="${j}"]`);

           if(day.dataset.day === date.toString()) {
               day.innerHTML = `<span class="matches" data-match=${day.dataset.day}>${j}</span>`;
           }
        }
    }
}

function getHeaders() {
    const token = localStorage.getItem('TOKEN')
    return {
        Authorization: `Bearer ${token}`,
    };
}
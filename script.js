// GLOBAL VARIABLES
const quack = new Audio("assets/sounds/quack.mp3");
quack.preload = "auto";

// DEFAULT RUN FUNCTIONS
renderAchievements();

function setCookie(cname, cvalue, exdays) {
    const d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i <ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}
function checkCookie(cname) {
    return getCookie(cname) !== ""; // Returns true if the cookie exists, else false
}
function clearCookies() {
    const cookies = document.cookie.split(";");

    cookies.forEach(
        cookie => {
            const eqPos = cookie.indexOf("=");
            const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
            
            // Clear cookie for current path and main domain variations
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = name + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=" + window.location.hostname;
        }
    );

    renderAchievements(); // Refresh the achievements display
}
function duckRain() {
    quack.currentTime = 0;
    quack.play();

    let delay = 500;
    let elapsed = 0;

    function duck() {
        const duck = document.createElement("img");
        duck.src = "assets/images/duck.png";

        duck.style.position = "fixed";
        duck.style.left = (Math.random() * 110 - 10) + "vw";
        duck.style.top = (Math.random() * (-10) -10) + "%";
        duck.style.width = "80px";
        duck.style.pointerEvents = "none";

        document.body.appendChild(duck);

        duck.animate(
            [
                { transform: "translateY(0)" },
                { transform: "translateY(120vh)" }
            ],
            {
                duration: 1000,
                easing: "ease-in"
            }
        ).onfinish = () => duck.remove();
    }

    function spawnDucks() {
        duck();

        elapsed += delay;
        delay = Math.max(20, delay * 0.85);

        if (elapsed < 5000) {
            setTimeout(spawnDucks, delay);
        }
    }
    spawnDucks();

    setTimeout(() => {
        duck();
    }, 8000);

    achievementGet("hjonk", "HJÖNK");
}
function runAway(event) {
    const hitbox = document.querySelector(".runawayButtonHitbox");
    const runBox = document.querySelector(".runawayButtonRunArea");

    let distance = 0;
    let newX = 0;
    let newY = 0;
    let attempts = 0;

    while (distance < 150 && attempts < 10) {
        newX = Math.random() * (runBox.clientWidth - hitbox.clientWidth);
        newY = Math.random() * (runBox.clientHeight - hitbox.clientHeight);
        distance = Math.hypot(event.clientX - newX, event.clientY - newY);

        attempts++;
    }

    hitbox.style.left = newX + "px";
    hitbox.style.top = newY + "px";
}
function achievementGet(aName, aDisplayName) {
    if (checkCookie("ACH" + aName) == true) {
        alert("You already have this achievement!");
        return;
    }
    else {
        const achievementBox = document.createElement("div");
        
        achievementBox.style.minWidth = "300px";
        achievementBox.style.maxWidth = "500px";
        achievementBox.style.minHeight = "50px";
        achievementBox.style.padding = "10px";

        achievementBox.style.backgroundColor = "lightgoldenrodyellow";
        achievementBox.style.border = "2px solid black";

        achievementBox.style.transition = "transform 0.4s ease-out";
        achievementBox.style.position = "fixed";
        achievementBox.style.left = "50%";
        achievementBox.style.transform = "translateX(-50%)";
        achievementBox.style.zIndex = "1000";
        // Look below for the top position calculation and movement

        const achievementImg = document.createElement("img");
        achievementImg.src = "assets/images/achievements/" + aName + ".png";
        achievementImg.style.width = "300px";
        achievementImg.style.objectFit = "contain";
        achievementImg.style.marginRight = "10px";
        achievementBox.appendChild(achievementImg);

        const achievementTitle = document.createElement("h2")
        achievementBox.appendChild(achievementTitle);
        achievementTitle.textContent = "Achievement Get:";
        achievementTitle.style.margin = "0px";
        achievementTitle.style.marginRight = "100px";
        achievementTitle.style.paddingLeft = "5px";

        
        const achievementName = document.createElement("h3");
        achievementBox.appendChild(achievementName);
        achievementName.textContent = aDisplayName;
        achievementName.style.margin = "0";
        achievementName.style.padding = "10px";
        achievementName.style.paddingLeft = "5px";
        
        setCookie("ACH" + aName, aDisplayName, 365);

        // Set initial position and animate the achievement box
        achievementBox.style.top = "0";
        achievementBox.style.transform = "translate(-50%, 10%)";
        document.body.appendChild(achievementBox);

        setTimeout(() => {
            setTimeout(() => {
                achievementBox.style.top = "0";
                achievementBox.style.transform = "translate(-50%, 35%)"; // Slide down
            }, 1);
        }, 100); // Delay before sliding down

        setTimeout(() => { // Remove the achievement box
            achievementBox.remove();
        }, 4000);

        renderAchievements(); // Refresh the achievements display
    }
}
function renderAchievements() {
    const area = document.querySelector(".achievementBox");

    area.replaceChildren(); // Clear the area

    function listAchievements() {
        let list = [];
        const cookies = document.cookie.split(";");
        for (let cookie of cookies) {
            cookie = cookie.trim();
            if (cookie.startsWith("ACH")) {
                list.push(cookie);
            }
        }
        return list;
    }
    achievements = listAchievements();

    for (let achievement of achievements) {
        let aName = achievement.split("=")[0];
        let aDisplayName = achievement.split("=")[1];

        const box = document.createElement("div");
        box.style.width = "420px";
        box.style.height = "420px";
        box.style.padding = "20px";
        box.style.backgroundColor = "lightcoral";
        box.style.border = "black solid";
        area.appendChild(box);
        
        const img = document.createElement("img");
        img.src = "assets/images/achievements/" + aName.slice(3) + ".png";
        img.style.maxWidth = "100%";
        img.style.border = "black solid";
        box.appendChild(img);

        const txt = document.createElement("h2");
        txt.className = "achievementTxt"
        txt.textContent = aDisplayName;
        box.appendChild(txt);
    }

    if (achievements.length === 0) {
        const noAchievements = document.createElement("h2");
        noAchievements.textContent = "No achievements yet!";
        area.appendChild(noAchievements);
    }
}
function rickroll(event) {
    event.preventDefault(); // Stops the link opening immediately

    setTimeout(function() {
        window.open('https://www.youtube.com/watch?v=xvFZjo5PgG0&pp=ygURcmlja3JvbGwgdmFyaWFudHM%3D', '_blank', 'noopener,noreferrer');
    }, 1800);

    achievementGet("rickroll", "RICKROLLED");
}
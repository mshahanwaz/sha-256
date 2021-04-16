function changePColor(flag) {
  var color = ["#ff5f56", "#ffbd2e", "#27c93f"];
  var p = document.querySelector(":root");
  p.style.setProperty("--color", color[flag - 1]);
}

var input = document.getElementById("shell-input");
var form = document.getElementById("shell-form");
form.addEventListener("submit", handleForm);

var user;
async function getUser() {
  var key = "5420682463a9c3b985d0b6cf63d9595b46d72f758894f520b49eb8eb";
  await axios
    .get(`https://api.ipdata.co/?api-key=${key}`)
    .then((response) => {
      user = response.data;
    })
    .catch((e) => console.log(e));
}

var dir = "~ system32 $";

function changeDir() {
  document.querySelector("#shell-form > p").textContent = dir;
}

function handleForm(event) {
  event.preventDefault();
  if (!user) getUser();
  operate();
  changeDir();
}

function setMessage(message) {
  const data = input.value;
  var info = document.querySelector(".shell-info");
  var div = document.createElement("div");
  var p1 = document.createElement("p");
  var p2 = document.createElement("p");
  p1.innerText = document.querySelector("#shell-form > p").textContent;
  p2.innerText = data;
  div.appendChild(p1);
  div.appendChild(p2);
  div.className = "shell-command";
  info.appendChild(div);
  var p = document.createElement("p");
  p.innerHTML = message;
  var div = document.createElement("div");
  div.className = "shell-message";
  div.appendChild(p);
  info.appendChild(div);
}

const getStr = (newString, flag) => {
  var string = newString.toLowerCase();

  var i = 0;
  for (; i < string.length; i++) {
    if (string[i] != " ") break;
  }
  const words = string.substr(i).split(" ");
  if (flag === 0) return words[0];
  else if (flag === 2) {
    var str = "";
    for (var i = 1; i < words.length - 1; i++) str += words[i] + "+";
    str += words[words.length - 1];
    return str;
  } else return words[1];
};

function uuidv4() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

var init = false,
  clear = false;
var redirect = false;

function operate() {
  var predata = getStr(input.value, 0);
  var postdata = getStr(input.value, 1);
  var googleURL = getStr(input.value, 2);
  var message;
  if (predata === "hello") {
    message = user
      ? postdata
        ? "Try using only 'hello'"
        : init
        ? `Hello, ${user.ip} :)`
        : "First, try 'init' command."
      : "First, try 'init' command.";
  } else if (predata === "init") {
    message = !init ? "Initiation completed!" : "Already initiated";
    init = true;
  } else if (predata === "") {
    message = "You are likely to be getting 'undefined' LOL!";
  } else if (predata === "open" || predata === "google") {
    message = !postdata
      ? `'${predata.toUpperCase()}' what?`
      : (redirect = true);
    if (redirect) message = "Redirecting...";
  } else if (predata === "date") {
    var dt = new Date();
    var date =
      dt.toLocaleString("default", { weekday: "long" }) +
      " " +
      dt.getDate() +
      " " +
      dt.toLocaleString("default", { month: "short" }) +
      ", " +
      dt.getFullYear();
    message = date;
  } else if (predata === "time") {
    var dt = new Date();
    var time =
      dt.getHours() + " : " + dt.getMinutes() + " : " + dt.getSeconds();
    message = time;
  } else if (predata === "ipconfig") {
    message = !init
      ? "First, try 'init' command."
      : `<img src="${user.flag}" alt="flag" /><br>IP: ${user.ip}<br>City: ${user.city}<br>Country: ${user.country_name}<br>Region Code: ${user.region_code}<br>Postal: ${user.postal}<br>Latitude: ${user.latitude}°<br>Longitude: ${user.longitude}°
      `;
  } else if (predata === "--version") {
    message = "0.1.0";
  } else if (predata === "clear" || predata === "cls") {
    clear = true;
    message = "hello";
  } else if (predata === "uuid" || predata === "guid") {
    message = uuidv4();
  } else if (predata === "image") {
    message = `Loaded 👇<br><img src=${postdata} alt="some" />`;
  } else if (predata === "cd") {
    if (postdata) {
      dir = "~ " + postdata + " $";
    }
    message = "Changed with {<br>&nbsp;&nbsp;status: 200<br>}";
  } else if (predata === "admin") {
    message = "Redirecting to admin GitHub profile...";
    window.open("https://github.com/mshahanwaz", "_blank");
  } else {
    message = `'${predata}' is not recognised as an internal or external command, operable program or batch file.`;
  }
  setMessage(message);
  if (redirect) {
    window.open(
      predata === "google"
        ? `https://www.google.com/search?q=${googleURL}`
        : `https://${postdata}`,
      "_blank"
    );
    redirect = false;
  }
  if (clear) {
    document.querySelector(".shell-info").innerHTML = "";
    clear = false;
  }
  input.value = "";
}

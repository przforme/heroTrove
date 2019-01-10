function showLogin() {
    document.getElementById("register").style.display = "none";
    document.getElementById("login").style.display = "block";
    document.getElementById("logTab").classList.add("active");
    document.getElementById("regTab").classList.remove("active");
}

function showRegister() {
    document.getElementById("login").style.display = "none";
    document.getElementById("register").style.display = "block";
    document.getElementById("regTab").classList.add("active");
    document.getElementById("logTab").classList.remove("active");
}

function navMobile() {
    var x = document.getElementById("myTopnav");
  if (x.className === "topnav") {
    x.className += " responsive";
  } else {
    x.className = "topnav";
  }
}
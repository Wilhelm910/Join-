// BACKEND //
let users = []
let emailAlreadyInUse = false;
let currentUser;

async function initRegistration() {
  setURL(
    "https://wilhelm-teicke.developerakademie.net/Join/smallest_backend_ever"
  );
  await downloadFromServer();
  users = JSON.parse(backend.getItem("users")) || [];
}

/**
 * 
 * This function is used to add a new User if email is not already in use
 * 
 */
async function addUsers() {
  let name = document.getElementById("name");
  let email = document.getElementById("signUpEmail");
  let password = document.getElementById("signUpPassword");
  for (let i = 0; i < users.length; i++) {
    if (users[i].email.includes(email.value)) {
      emailAlreadyInUse = true;
      name.value = ''
      email.value = ''
      password.value = ''
    }
  }
  if (!emailAlreadyInUse) {
    users.push({
      name: name.value,
      email: email.value,
      password: password.value,
    });
    await backend.setItem("users", JSON.stringify(users));
    renderLogIn()
  }
}

/**
 * 
 * This function is used to log in with account information
 * 
 */
function login() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  for (let i = 0; i < users.length; i++) {
    if (users[i].email.includes(email.value) && users[i].password.includes(password.value)) {
      currentUser = users[i]['name'];
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
      window.document.location.href = "./summary.html";
      
    } else {
      console.log("Wrong Password or Email")
    }
    email.value = ''
    password.value = ''
  }
}

/**
 * 
 * This function is used to log in with guest account
 * 
 */
function guestlogin() {
  let email = document.getElementById("email");
  let password = document.getElementById("password");
  let user = users.find(
    u => u.email == email.value && u.password == password.value
  );
  currentUser = 'Guest';
  localStorage.setItem('currentUser', JSON.stringify(currentUser));
  window.document.location.href = "./summary.html";
  if (user) {
    console.log(user);
  }
}

/**
 * 
 * This function is used to animte the logo translation
 * 
 */
function initial() {
  document.getElementById("capaOne").classList.add("animation");
  document.getElementById("capaOneWhite").classList.add("animation");
  document.getElementById("capaOneContainer").classList.add("ausblenden");
  if (window.matchMedia("(max-width: 600px)").matches) {
    document.getElementById("capaOneWhite").classList.add("ausblenden");
  }
  setTimeout(() => {
    let capaOneContainer = document.getElementById("capaOneContainer");
    capaOneContainer.style.zIndex = "0";
  }, 1000);
}

/*Password-Inputfield*/

let inputPW = false;

/**
 * 
 * This function is used to change the pw symbole
 * 
 */
async function changePWSymbol() {
  let pwInputField = document.getElementById("password");
  let pwSymbol = document.getElementById("pwSymbol");
  if (pwInputField.value == "") {
    pwSymbol.src = "assets/img/lock.svg";
    pwSymbol.classList.remove("cursorPointer");
    pwInputField.type = "password";
    inputPW = false;
  } else if ((pwInputField.type = "password")) {
    pwSymbol.src = "assets/img/crossedEye.svg";
    pwSymbol.classList.add("cursorPointer");
    inputPW = true;
  } else {
    pwSymbol.src = "assets/img/eye.svg";
    pwSymbol.classList.add("cursorPointer");
    inputPW = true;
  }
}


/**
 * 
 * This function is used to show the password
 * 
 */
async function visibilityPW() {
  let pw = document.getElementById("password");
  let pwSymbol = document.getElementById("pwSymbol");
  if (inputPW === true) {
    if (pw.type === "password") {
      pw.type = "text";
      pwSymbol.src = "assets/img/eye.svg";
    } else {
      pw.type = "password";
      pwSymbol.src = "assets/img/crossedEye.svg";
    }
  }
}


/**
 * 
 * This function is used to change the password symbole
 * 
 */
async function changeSignUpPWSymbol() {
  let pwInputField = document.getElementById("signUpPassword");
  let pwSymbol = document.getElementById("pwSymbol");
  if (pwInputField.value == "") {
    pwSymbol.src = "assets/img/lock.svg";
    pwSymbol.classList.remove("cursorPointer");
    pwInputField.type = "password";
    inputPW = false;
  } else if ((pwInputField.type = "password")) {
    pwSymbol.src = "assets/img/crossedEye.svg";
    pwSymbol.classList.add("cursorPointer");
    inputPW = true;
  } else {
    pwSymbol.src = "assets/img/eye.svg";
    pwSymbol.classList.add("cursorPointer");
    inputPW = true;
  }
}


/**
 * 
 * This function is used to show the password
 * 
 */
async function visibilitySignUpPW() {
  let pw = document.getElementById("signUpPassword");
  let pwSymbol = document.getElementById("pwSymbol");
  if (inputPW === true) {
    if (pw.type === "password") {
      pw.type = "text";
      pwSymbol.src = "assets/img/eye.svg";
    } else {
      pw.type = "password";
      pwSymbol.src = "assets/img/crossedEye.svg";
    }
  }
}


/**
 * 
 * This function is used to render the sign up screen
 * 
 */
function renderSignUp() {
  document.getElementById("forgottenPWContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("notAJoinUser").style.display = "none";
  document.getElementById("resetPWContainer").style.display = "none";
  document.getElementById("signUpContainer").style.display = "flex";
}

/**
 * 
 * This function is used to render the log in screen
 * 
 */
function renderLogIn() {
  document.getElementById("forgottenPWContainer").style.display = "none";
  document.getElementById("signUpContainer").style.display = "none";
  document.getElementById("resetPWContainer").style.display = "none";
  document.getElementById("loginContainer").style.display = "flex";
  document.getElementById("notAJoinUser").style.display = "flex";
}


/**
 * 
 * This function is used to render the forgotten pw screen
 * 
 */
function renderForgottenPW() {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("notAJoinUser").style.display = "none";
  document.getElementById("signUpContainer").style.display = "none";
  document.getElementById("resetPWContainer").style.display = "none";
  document.getElementById("forgottenPWContainer").style.display = "flex";
}


/**
 * 
 * This function is used to render the reset pw screen
 * 
 */
function renderResetPW() {
  document.getElementById("loginContainer").style.display = "none";
  document.getElementById("notAJoinUser").style.display = "none";
  document.getElementById("signUpContainer").style.display = "none";
  document.getElementById("forgottenPWContainer").style.display = "none";
  document.getElementById("resetPWContainer").style.display = "flex";
}

let savedTaskStatus;

/**
 * 
 * This function is used to initialize the website
 * 
 */
function init() {
  includeHTML()

}

/**
 * 
 * This function is used to include the html pages
 * @returns 
 * 
 * 
 */
function includeHTML() {
  var z, i, elmnt, file, xhttp;
  /* Loop through a collection of all HTML elements: */
  z = document.getElementsByTagName("*");
  for (i = 0; i < z.length; i++) {
    elmnt = z[i];
    /*search for elements with a certain atrribute:*/
    file = elmnt.getAttribute("w3-include-html");
    if (file) {
      /* Make an HTTP request using the attribute value as the file name: */
      xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function () {
        if (this.readyState == 4) {
          if (this.status == 200) { elmnt.innerHTML = this.responseText; }
          if (this.status == 404) { elmnt.innerHTML = "Page not found."; }
          /* Remove the attribute, and call this function once more: */
          elmnt.removeAttribute("w3-include-html");
          includeHTML();
        }
      }
      xhttp.open("GET", file, true);
      xhttp.send();
      /* Exit the function: */
      return;
    }
  }
  manipulateFooterColor()
}

/**
 * 
 * 
 * This function is used to show /hide the logout button
 * 
 */
function toggleLogoutBtn() {
  let body = document.getElementById('body')
  let btn = document.getElementById('header-extended-menu-container')
  let slideContainer = document.getElementById('slide-container')
  let overlay = document.getElementById('overlay')
  if (btn.classList.contains('d-none')) {
    setTimeout(() => {
      btn.classList.remove('d-none')
    }, 200);
    if (window.innerWidth < 1000) {
      slideContainer.classList.remove('slide-out')
    }
    overlay.classList.remove('d-none')
    body.classList.add('overflow-hidden')
  } else {
    btn.classList.add('d-none')
    overlay.classList.add('d-none')
    body.classList.remove('overflow-hidden')
  }
}

/**
 * 
 * This funciton is used to remove the overlay
 * 
 */
function removeOverlay() {
  setTimeout(() => {
    document.getElementById('header-extended-menu-container').classList.add('d-none')
  }, 200);
  document.getElementById('overlay').classList.add('d-none')
  document.getElementById('body').classList.remove('overflow-hidden')
  if (window.innerWidth < 1000) {
    document.getElementById('slide-container').classList.add('slide-out')
    main.classList.remove('d-none')
  }
}


/**
 * 
 * This function is used to get the background color for the current page
 * 
 */
function manipulateFooterColor() {
  let summary = document.getElementById('summary-btn')
  let board = document.getElementById('board-btn')
  let addTask = document.getElementById('add-task-btn')
  let contacts = document.getElementById('contacts-btn')
  let legalnotice = document.getElementById('legalnotice')
  manipulateSummaryColor(summary)
  manipulateBoardColor(board)
  manipulateAddtaskColor(addTask)
  manipulateContactsColor(contacts)
  manipulateLegalnoticeColor(legalnotice)
}


/**
 * 
 * This function is used to get the background color for the current page
 * 
 */
function manipulateSummaryColor(summary) {
  if (window.location.href.includes('summary')) {
    summary.classList.add('background-color')
  } else {
    summary.classList.remove('background-color')
  }
}

/**
 * 
 * This function is used to get the background color for the current page
 * 
 */
function manipulateBoardColor(board) {
  if (window.location.href.includes('board')) {
    board.classList.add('background-color')
  } else {
    board.classList.remove('background-color')
  }
}

/**
 * 
 * This function is used to get the background color for the current page
 * 
 */
function  manipulateAddtaskColor(addTask) {
  if (window.location.href.includes('add_task')) {
    addTask.classList.add('background-color')
  } else {
    addTask.classList.remove('background-color')
  }
}

/**
 * 
 * This function is used to get the background color for the current page
 * 
 */
function manipulateContactsColor(contacts) {
  if (window.location.href.includes('contacts')) {
    contacts.classList.add('background-color')
  } else {
    contacts.classList.remove('background-color')
  }
}

/**
 * 
 * This function is used to get the background color for the current page
 * 
 */
function manipulateLegalnoticeColor(legalnotice) {
  if (window.location.href.includes('legalnotice')) {
    legalnotice.classList.add('background-color')
  } else {
    legalnotice.classList.remove('background-color')
  }
}


/**
 * 
 * This function is used to control appearance of the card container
 * 
 */
window.onresize = function() {
  if (document.getElementById('overlay').firstElementChild) {
    if (window.innerWidth > 1000 && !document.getElementById('card-container').classList.contains('d-none')) {
      main.classList.remove('d-none')
    }
    if (window.innerWidth < 1000 && !document.getElementById('card-container').classList.contains('d-none')) {
      main.classList.add('d-none')
    }
  }
}


/**
 * 
 * This function is used to clear local storage status
 * 
 */
function clearSavedTaskStatusTemplate() {
  savedTaskStatus = ''
  localStorage.setItem(`savedTaskStatus`, JSON.stringify(savedTaskStatus));
  window.document.location.href = "./add_task.html";
}

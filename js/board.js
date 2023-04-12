let tasks = []
let categorys = []
let contacts = []
let cardOpened = false;
let currentContact;
let inAnim = false;
let currentDraggedElement;
let timer = false;
let duration = 500;


/**
 * This function is used to load the content from the backend
 * 
 * 
 */
async function loadBackend() {
    setURL('https://wilhelm-teicke.developerakademie.net/Join/smallest_backend_ever');
    await downloadFromServer();
    tasks = JSON.parse(backend.getItem('tasks')) || [];
    categorys = JSON.parse(backend.getItem('categorys')) || [];
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    savedTaskStatus = JSON.parse(localStorage.getItem('savedTaskStatus')) || [];
    loadTasks()
}


/**
 * 
 * This function is used to save the current task status in local storage
 * 
 * @param {string} savedTaskStatus 
 */
function saveTaskStatusFromBoard(savedTaskStatus) {
    savedTaskStatus[0] = savedTaskStatus
    localStorage.setItem(`savedTaskStatus`, JSON.stringify(savedTaskStatus));
    let overlay = document.getElementById('overlay')
    overlay.classList.remove('d-none')
    overlay.classList.add('overlay-bg')
    overlay.innerHTML = renderAddTaskFromBoard()
    //window.document.location.href = "./add_task.html";
}


/**
 * 
 * This function is used to get the containers which will be filled with the content from the backend
 * 
 */
function loadTasks() {
    document.getElementById('toDo-container').innerHTML = ''
    document.getElementById('inProgress-container').innerHTML = ''
    document.getElementById('awaitingFeedback-container').innerHTML = ''
    document.getElementById('done-container').innerHTML = ''
    filterTasks()
}

/**
 * 
 * This function is used to so sort the content from the backend
 * 
 */
/*function filterTasks() {
    for (let i = 0; i < tasks.length; i++) {
        let currentTask = tasks[i]
        if (currentTask.status == 'toDo') {
            let content = document.getElementById('to-do-container')
            forwardTaskContent(currentTask, content, i)
        } else if (currentTask.status == 'inProgress') {
            let content = document.getElementById('in-progress-container')
            forwardTaskContent(currentTask, content, i)
        } else if (currentTask.status == 'awaitingFeedback') {
            let content = document.getElementById('awaiting-feedback-container')
            forwardTaskContent(currentTask, content, i)
        } else if (currentTask.status == 'done') {
            let content = document.getElementById('done-container')
            forwardTaskContent(currentTask, content, i)
        }
    }
}*/
function filterTasks() {
    for (let i = 0; i < tasks.length; i++) {
        let currentTask = tasks[i]
        let content = document.getElementById(`${currentTask.status}-container`)
        forwardTaskContent(currentTask, content, i)
    }
}


/**
 * 
 * This function is used to render the backend content
 * 
 * @param {object} currentTask 
 * @param {html container} content 
 * @param {number} i 
 */
function forwardTaskContent(currentTask, content, i) {
    renderAllTasks(currentTask, content, i)
    renderContactSelection(currentTask, i)
    renderProgressBar(i)
}

/**
 * 
 * This function is used to render the progress bar
 * 
 * @param {number} i 
 */
function renderProgressBar(i) {
    if (tasks[i].subtasks.length > 0) {
        let totalSubtasks = tasks[i].subtasks.length
        let completedSubtasks = 0
        for (let k = 0; k < tasks[i].sTStatus.length; k++) {
            if (tasks[i].sTStatus[k] == true) {
                completedSubtasks++
            }
            if (tasks[i].sTStatus[k] == false) {
            }
        }
        let progressBar = document.getElementById(`subtask-progress-bar-${i}`)
        progressBar.innerHTML =
    /*html*/`
    <progress style="margin-right:8px" id="file" value="${completedSubtasks}" max="${totalSubtasks}"> 32% </progress>
    <label for="file" id="progress-count-${i}">${completedSubtasks}/${totalSubtasks}</label>
    `
    }
}

/**
 * 
 * This function is used to render all tasks
 * 
 * @param {object} currentTask 
 * @param {html container} content 
 * @param {number} i 
 */
function renderAllTasks(currentTask, content, i) {
    content.innerHTML += htmlRenderAllTasks(currentTask, i)
    getPrioImage(currentTask, i)
    getTaskCategoryColor(i)
}

/**
 * 
 * This function is used to render the priority image 
 * 
 * @param {object} currentTask 
 * @param {number} i 
 */
function getPrioImage(currentTask, i) {
    let content = document.getElementById(`${currentTask.prio}_${i}`)
    if (content.id == `low_${i}`) {
        let img = document.createElement('img')
        img.src = 'assets/img/prio-low.svg'
        content.appendChild(img)
    } else if (content.id == `medium_${i}`) {
        let img = document.createElement('img')
        img.src = 'assets/img/prio-medium.svg'
        content.appendChild(img)
    } else if (content.id == `urgent_${i}`) {
        let img = document.createElement('img')
        img.src = 'assets/img/prio-urgent.svg'
        content.appendChild(img)
    }
}

/**
 * 
 * This function is used to get the corret color for every category
 * 
 * @param {number} i 
 */
function getTaskCategoryColor(i) {
    for (let j = 0; j < categorys.length; j++) {
        if (categorys[j].name == tasks[i].category) {
            document.getElementById(i).firstElementChild.style = `background-color: ${categorys[j].color}`
            if (cardOpened) {
                document.getElementById('card-container').children[1].style = `background-color: ${categorys[j].color}`
            }
        }
    }
}

/**
 * 
 * This function is used to render the contact selection
 * 
 * @param {object} currentTask 
 * @param {number} i 
 */
function renderContactSelection(currentTask, i) {
    for (let k = 0; k < currentTask.contactSelection.length; k++) {
        for (let j = 0; j < contacts.length; j++) {
            if (currentTask.contactSelection[k] == contacts[j].ID) {
                currentContact = contacts[j].initials
                if (currentTask.contactSelection.length < 3) {
                    showAllContacts(currentTask, i, currentContact, j)
                    getContactColor(i, k, j)
                } else {
                    showFirstTwoContacts(k, currentTask, i, currentContact, j)
                    getContactColor(i, k, j)
                }
            }
        }
    }
}

/**
 * 
 * This function is used to render all contacts for every task
 * 
 * @param {object} currentTask 
 * @param {number} i 
 * @param {object} currentContact 
 * @param {number} j 
 */
function showAllContacts(currentTask, i, currentContact, j) {
    document.getElementById(`contact-selection-${currentTask.status}_${i}`).innerHTML +=
    /*html*/ `
    <div class="circleB" id="${contacts[j].ID}_${i}">${currentContact}</div>
    `
}

/**
 * 
 * This function is used to render the first two contacts for every task, and get a counter for the remaining contacts
 * 
 * @param {number} k 
 * @param {object} currentTask 
 * @param {number} i 
 * @param {object} currentContact 
 */
function showFirstTwoContacts(k, currentTask, i, currentContact, j) {
    if (k < 2) {
        document.getElementById(`contact-selection-${currentTask.status}_${i}`).innerHTML +=
        /*html*/ `
        <div class="circleB" id="${contacts[j].ID}_${i}">${currentContact}</div>
        `
    } else if (k == 2) {
        document.getElementById(`contact-selection-${currentTask.status}_${i}`).innerHTML +=
        /*html*/ `
        <div style="background-color:#2A3647;" class="circleB" id="remaining-contacts-number-${i}">${'+' + (currentTask.contactSelection.length - 2)}</div>
        `
    }
}

/**
 * 
 * This function is used to render the color for every contact
 * 
 * @param {number} i 
 * @param {number} k 
 * @param {number} j 
 */
function getContactColor(i, k, j) {
    for (let l = 0; l < contacts.length; l++) {
        if (k < 2) {
            if (contacts[l].ID == tasks[i].contactSelection[k]) {
                document.getElementById(`${contacts[j].ID}_${i}`).style = `background-color: ${contacts[l].color}`
            }
        } else if (k == 3) {
            document.getElementById(`remaining-contacts-number-${i}`).style = `background-color: #2A3647; color: #FFFFFF`
        }
    }
}


/**
 * 
 * This function is used to render the detailed view of the clicked task
 * 
 * @param {number} i 
 */
function loadCard(i) {
    cardOpened = true
    if (window.innerWidth < 1000) {
        main.classList.add('d-none')
    }
    body.classList.add('overflow-hidden')
    let overlay = document.getElementById('overlay')
    overlay.classList.remove('d-none')
    renderCard(i, overlay)
    renderCardContacts(i)
    getCardPrioImg(i)
    getTaskCategoryColor(i)
}

/**
 * 
 * This function is used to render the detailed view of the clicked task
 * 
 * @param {number} i 
 * @param {html container} overlay 
 */
function renderCard(i, overlay) {
    overlay.innerHTML = htmlRenderCard(i)
    document.getElementById('card-container').classList.remove('d-none')
}

/**
 * 
 * This funciton is used to stop the overlay onclick function when pressing buttons on the card
 * 
 * @param {string} event 
 */
function stopPropagation(event) {
    event.stopPropagation();
}

/**
 * 
 * This function is used to render the contacts on the card
 * 
 * @param {number} i 
 */
function renderCardContacts(i) {
    let container = document.getElementById('contact-card-container')
    tasks[i].contactSelection.forEach(element => {
        for (let j = 0; j < contacts.length; j++) {
            let contact = contacts[j]
            if (element == contacts[j].ID) {
                container.innerHTML +=
                /*html*/ `
                <div class="contact-card-content">
                    <p class="circleB" style="background-color:${contact.color}">${contact.initials}</p> 
                    <p>${contact.name}</p>
                </div>
                `
            }
        }
    });
}


/**
 * 
 * This function is used to render the contacts on the card
 * 
 * @param {number} i 
 */
function renderCardContactsEdit(i) {
    let container = document.getElementById('contact-card-container')
    container.style = "display:flex"
    tasks[i].contactSelection.forEach(element => {
        for (let j = 0; j < contacts.length; j++) {
            let contact = contacts[j]
            if (element == contacts[j].ID) {
                container.innerHTML +=
                /*html*/ `
                <div class="contact-card-content">
                    <p class="circleB" style="background-color:${contact.color}">${contact.initials}</p> 
                </div>
                `
            }
        }
    });
}

/**
 * 
 * This function is used to render the correct prio image on the card
 * 
 * @param {number} i 
 */
function getCardPrioImg(i) {
    let content = document.getElementById(`card-${tasks[i].prio}`)
    let img = document.createElement('img')
    img.src = `assets/img/${content.id}.svg`
    content.appendChild(img)
}

/**
 * 
 * This function is used to search all tasks
 * 
 */
function searchTasks() {
    let input = document.getElementById('find-task-input')
    for (let i = 0; i < tasks.length; i++) {
        let content = document.getElementById(`${i}`)
        if ((tasks[i].title.toLowerCase().includes(input.value.toLowerCase()))) {
            content.classList.remove('d-none')
        } else if ((tasks[i].description.toLowerCase().includes(input.value.toLowerCase()))) {
            content.classList.remove('d-none')
        } else {
            content.classList.add('d-none')
        }
    }
}

/**
 * 
 * This function is used to render the edit task section
 * 
 * @param {number} i 
 */
function loadEditTask(i) {
    renderEditTask(i)
    renderContacts(i);
    renderCardContactsEdit(i)
    highlightPrio(i)
}

/**
 * 
 * This function is used to render the edit task section
 * 
 * @param {number} i 
 */
function renderEditTask(i) {
    let content = document.getElementById('card-container')
    content.innerHTML = htmlRenderEditTask(i)
    let subtasks = document.getElementById('edit-task-subtasks-container')
    if (tasks[i].subtasks.length > 0) {
        subtasks.innerHTML = `<p>Subtasks</p>`
        for (let j = 0; j < tasks[i].subtasks.length; j++) {
            subtasks.innerHTML +=
            /*html*/`
                <div class="subtasksB">${tasks[i].subtasks[j]} <input onclick="updateSubtask(${j},${i})" id="subtask-${j}" class="checkbox" type="checkbox"></div>
            `
        }
        checkForCompletedSubtasks(i)
    }
}

/**
 * 
 * This function is used to check if the subtasks are completed or not and render the status
 * 
 * @param {number} i 
 */
function checkForCompletedSubtasks(i) {
    for (let j = 0; j < tasks[i].sTStatus.length; j++) {
        if (tasks[i].sTStatus[j] == true) {
            document.getElementById(`subtask-${j}`).checked = 'true'
        }
    }
}

/**
 * 
 * This function is used to update the subtask status in backend
 * 
 * @param {number} j 
 * @param {number} i 
 */
async function updateSubtask(j, i) {
    let checked = document.getElementById(`subtask-${j}`).checked
    if (checked) {
        tasks[i].sTStatus[j] = true;
        await backend.setItem(`tasks`, JSON.stringify(tasks));
    } else {
        tasks[i].sTStatus[j] = false;
        await backend.setItem(`tasks`, JSON.stringify(tasks));
    }
}

/**
 * 
 * This function is used to the change the prio of a task when clicked and update the backend
 * 
 * @param {number} i 
 * @param {string} prio 
 */
async function changePrio(i, prio) {
    tasks[i].prio = `${prio}`
    await backend.setItem(`tasks`, JSON.stringify(tasks));
    highlightPrio(i)
}

/**
 * 
 * This function is used to close the detailed view and load the updates on the tasks
 * 
 * @param {number} i 
 */
function closeForm(i) {
    updateInput(i)
    closeCard()
    loadTasks()
}

/**
 * 
 * This function is used to close the detailed view of the tasks
 * 
 */
function closeCard() {
    cardOpened = false;
    body.classList.remove('overflow-hidden')
    document.getElementById('card-container').classList.add('d-none')
    document.getElementById('overlay').classList.add('d-none')
    if (window.innerWidth < 1000) {
        main.classList.remove('d-none')
    }
}

/**
 * 
 * This function is used to update title, descritpion and date of every task
 * 
 * @param {number} i 
 */
async function updateInput(i) {
    let inputTitle = document.getElementById('edit-task-title')
    let inputDescription = document.getElementById('edit-task-description')
    let inputDate = document.getElementById('edit-task-date')
    if (!inputTitle.value == '')
        tasks[i].title = inputTitle.value
    if (!inputDescription.value == '')
        tasks[i].description = inputDescription.value
    if (!inputDate.value == '')
        tasks[i].date = inputDate.value
    await backend.setItem(`tasks`, JSON.stringify(tasks));
}

/**
 * 
 * This function is used to show the correct prio image
 * 
 * @param {number} i 
 */
function highlightPrio(i) {
    if (tasks[i].prio == 'low')
        taskPrioLow()
    else
        taskPrioNotLow()
    if (tasks[i].prio == 'medium')
        taskPrioMedium()
    else
        taskPrioNotMedium()
    if (tasks[i].prio == 'urgent')
        taskPrioUrgent()
    else
        taskPrioNotUrgent()
}

/**
 * 
 * This function is used to show the correct prio image
 * 
 */
function taskPrioLow() {
    let content = document.getElementById('prio-area-low')
    content.style = 'background-color:#7AE229'
    let text = content.children[0]
    let svgPath1 = content.children[1].children[0]
    let svgPath2 = content.children[1].children[1]
    text.style.color = '#FFFFFF'
    svgPath1.style.fill = '#FFFFFF'
    svgPath2.style.fill = '#FFFFFF'
}

/**
 * 
 * This function is used to show the correct prio image
 * 
 */
function taskPrioNotLow() {
    let content = document.getElementById('prio-area-low')
    content.style = 'background-color:#FFFFFF'
    let text = content.children[0]
    let svgPath1 = content.children[1].children[0]
    let svgPath2 = content.children[1].children[1]
    text.style.color = '#7AE229'
    svgPath1.style.fill = '#7AE229'
    svgPath2.style.fill = '#7AE229'
}

/**
 * 
 * This function is used to show the correct prio image
 * 
 */
function taskPrioMedium() {
    let content = document.getElementById('prio-area-medium')
    content.style = 'background-color:#FFA800'
    let text = content.children[0]
    let svgPath1 = content.children[1].children[0].children[0]
    let svgPath2 = content.children[1].children[0].children[1]
    text.style.color = '#FFFFFF'
    svgPath1.style.fill = '#FFFFFF'
    svgPath2.style.fill = '#FFFFFF'
}

/**
 * 
 * This function is used to show the correct prio image
 * 
 */
function taskPrioNotMedium() {
    let content = document.getElementById('prio-area-medium')
    content.style = 'background-color:#FFFFFF'
    let text = content.children[0]
    let svgPath1 = content.children[1].children[0].children[0]
    let svgPath2 = content.children[1].children[0].children[1]
    text.style.color = '#FFA800'
    svgPath1.style.fill = '#FFA800'
    svgPath2.style.fill = '#FFA800'
}

/**
 * 
 * This function is used to show the correct prio image
 * 
 */
function taskPrioUrgent() {
    let content = document.getElementById('prio-area-urgent')
    content.style = 'background-color:#FF3D00'
    let text = content.children[0]
    let svgPath1 = content.children[1].children[0].children[0]
    let svgPath2 = content.children[1].children[0].children[1]
    text.style.color = '#FFFFFF'
    svgPath1.style.fill = '#FFFFFF'
    svgPath2.style.fill = '#FFFFFF'
}

/**
 * 
 * This function is used to show the correct prio image
 * 
 */
function taskPrioNotUrgent() {
    let content = document.getElementById('prio-area-urgent')
    content.style = 'background-color:#FFFFFF'
    let text = content.children[0]
    let svgPath1 = content.children[1].children[0].children[0]
    let svgPath2 = content.children[1].children[0].children[1]
    text.style.color = '#FF3D00'
    svgPath1.style.fill = '#FF3D00'
    svgPath2.style.fill = '#FF3D00'
}


/*********Edit Task Dropdown Menu************/

/**
 * 
 * This function is used to render the contacts in the drop down menu
 * 
 * @param {number} i 
 */
async function renderContacts(i) {
    let content = document.getElementById('contact');
    await downloadFromServer();
    contacts = JSON.parse(backend.getItem('contacts')) || [];
    content.innerHTML = '';
    for (let j = 0; j < contacts.length; j++) {
        let contact = contacts[j];
        content.innerHTML += `<label for="cb-contacts-${j}"> <div class="contacts">${contact['name']} <input onclick="addContactToList(${j},${i})" id="cb-contacts-${j}" class="checkbox" type="checkbox" control-id="ControlID-12"></div></label>`
        if (j == contacts.length - 1) {
            let j = contacts.length
            content.innerHTML += `<label for="cb-subtask-${j}"> <div class="contacts">Intive new contact <input onclick="inviteNewContact(${i})" id="cb-subtask-${j}" class="subtask-checkbox" type="checkbox" control-id="ControlID-12"></div></label>`
        }
    }
}

/**
 * 
 * This function is used to invite a new contact to the task
 * 
 * @param {number} i 
 */
function inviteNewContact(i) {
    let areaB = 'contact'
    dropup(areaB)
    let content = document.getElementById('contactShow')
    content.innerHTML = renderInviteNewContactArea(i)
}

/**
 * 
 * This function is used to check if contacts are already part of task
 * 
 * @param {number} i 
 */
function checkForSelectedContacts() {
    for (let j = 0; j < contacts.length; j++) {
        let container = document.getElementById('contact-card-container')
        let i = container.className.slice(0, 1)
        let contact = contacts[j];
        if (tasks[i].contactSelection.includes(contact.ID)) {
            document.getElementById(`cb-contacts-${contact.ID}`).checked = true
        }
    }
}

/**
 * 
 * This function is used to show all contacts in drop down menu
 * 
 * @param {number} i 
 */
function showDropDownB(i) {
    loadEditTask(i)
}

/**
 * 
 * This function is used to open the drop down menu
 * 
 * @param {string} areaB 
 * @param {number} i 
 */
function dropdownB(areaB, i) {
    if (!inAnim) {
        let content = document.getElementById(areaB);
        let bigArea = areaB[0].toUpperCase() + areaB.slice(1);
        content.classList.remove('d-none')
        document.getElementById(areaB + 'Show').style = 'animation: dropdown 2s ease;'
        document.getElementById(`arrow${bigArea}`).style = 'animation: arrowUp 350ms ease; transform: rotate(180deg);'
        document.getElementById(`select${bigArea}`).setAttribute('onclick', `dropup('${areaB}')`);
        document.getElementById(`arrow${bigArea}`).setAttribute('onclick', `dropup('${areaB}')`);
        checkForSelectedContacts(i)
    }
}

/**
 * 
 * This function is used to close the drop down menu
 * 
 * @param {string} areaB 
 */
function dropupB(areaB) {
    let content = document.getElementById(areaB);
    let areaShow = document.getElementById(areaB + 'Show')
    inAnim = true;
    let bigArea = areaB[0].toUpperCase() + areaB.slice(1);
    editEndHeight(areaShow);
    document.getElementById('select' + bigArea).setAttribute('onclick', `dropdown('${areaB}')`);
    document.getElementById('arrow' + bigArea).setAttribute('onclick', `dropdown('${areaB}')`);
    areaShow.style = 'animation: dropup 500ms ease;';
    document.getElementById('arrow' + bigArea).style = 'animation: arrowDown 350ms ease;';
    setTimeout(() => {
        content.classList.add('d-none');
        inAnim = false;
    }, 500);
}

/**
 * 
 * This function is used to 
 * 
 * @param {string} content 
 */
function editEndHeight(content) {
    document.documentElement.style.setProperty('--end-height', content.clientHeight + 'px')
}

/**
 * 
 * This function is used to add contacts to the task
 * 
 * @param {number} j 
 * @param {number} i 
 */
async function addContactToList(j, i) {
    if (document.getElementById(`cb-contacts-${j}`).checked) {
        tasks[i].contactSelection.push(contacts[j].ID)
        await backend.setItem(`tasks`, JSON.stringify(tasks));
    } else {
        let index = tasks[i].contactSelection.indexOf(contacts[j].ID)
        tasks[i].contactSelection.splice(index, 1)
        await backend.setItem(`tasks`, JSON.stringify(tasks));
    }
}


/*********Drag and Drop Function************/


/**
 * 
 * This function is used to get the dragged Element in a parameter
 * 
 * @param {string} id 
 */
function dragstart_handler(id) {
    currentDraggedElement = id
}

/**
 * 
 * This function is used to stop events while dragging
 * 
 * @param {string} ev 
 */
function dragover_handler(ev) {
    ev.preventDefault();
}

/**
 * 
 * This function is used to drop tasks in a new area
 * 
 * @param {string} status 
 */
async function drop_handler(status) {
    tasks[currentDraggedElement].status = status;
    await backend.setItem(`tasks`, JSON.stringify(tasks));
    loadTasks()
}

/**
 * 
 * This function is used to highlight the areas where tasks can be dropped
 * 
 * @param {string} id 
 */
function highlightArea(id) {
    let container = document.getElementById(id)
    container.classList.remove('d-none')
    editToDoArea()
    editInProgress()
    editAwaitFeed()
    editDone()
}

/**
 * 
 * This funciton is used to highlight the hovered area, when it has no content
 * 
 */
function editToDoArea() {
    let toDo = document.getElementById('toDo-container')
    let toDoDragArea = document.getElementById('to-do-container-drag-area')
    if (toDo.innerHTML.length == 0) {
        toDoDragArea.classList.add('margin-top')
    }
}

/**
 * 
 * This funciton is used to highlight the hovered area, when it has no content
 * 
 */
function editInProgress() {
    let inProgress = document.getElementById('inProgress-container')
    let inProgressDragArea = document.getElementById('in-progress-container-drag-area')
    if (inProgress.innerHTML.length == 0) {
        inProgressDragArea.classList.add('margin-top')
    }
}

/**
 * 
 * This funciton is used to highlight the hovered area, when it has no content
 * 
 */
function editAwaitFeed() {
    let awaitFeed = document.getElementById('awaitingFeedback-container')
    let awaitFeedDragArea = document.getElementById('awaiting-feedback-container-drag-area')
    if (awaitFeed.innerHTML.length == 0) {
        awaitFeedDragArea.classList.add('margin-top')
    }
}

/**
 * 
 * This funciton is used to highlight the hovered area, when it has no content
 * 
 */
function editDone() {
    let done = document.getElementById('done-container')
    let doneDragArea = document.getElementById('done-container-drag-area')
    if (done.innerHTML.length == 0) {
        doneDragArea.classList.add('margin-top')
    }
}

/**
 * 
 * This function is used to remove the highlited areas
 * 
 * @param {string} id 
 */
function removeHighlightArea(id) {
    let container = document.getElementById(id)
    container.classList.add('d-none')

}

/**
 * 
 * This function is used to highlight the areas where tasks can be dropped
 * 
 * @param {number} id 
 */
function highliteDragArea(id) {
    let container = document.getElementById(id)
    container.classList.remove('d-none')
}

/**
 * 
 * This function is used to remove the highlited areas
 * 
 * @param {string} id 
 */
function removeHighlightDragArea(id) {
    let container = document.getElementById(id)
    container.classList.add('d-none')
    container.classList.remove('margin-top')
}

/**
 * 
 * This function is used to hide and make visible the date icon
 * 
 */
function hideIcon() {
    let content = document.getElementById('edit-task-date-icon')
    if (!content.classList.contains('d-none')) {
        content.classList.add('d-none')
    } else if (content.classList.contains('d-none')) {
        content.classList.remove('d-none')
    }
}

/**
 * 
 * This function is used to hide and make visible the date icon
 * 
 */
function removeTest(id) {
    let element = document.getElementById(id)
    let targetContainer = element.parentElement.parentElement.parentElement.children
    for (let i = 0; i < targetContainer.length; i++) {
        targetContainer[i].lastElementChild.classList.add('d-none')
    }
}





/**
 * 
 * This function is used for mobile change task
 * 
 * @param {string} id 
 */
function touchStart(id) {
    if (!timer) {
        timer = setTimeout(() => {
            container = document.getElementById(id)
            console.log(container.getAttribute('status'))
            if (container.getAttribute('status') == 'closed') {
                onlongtouch(id)
                container.setAttribute('status', 'opened')
            }
        }, duration);
    }
}

/**
 * 
 * This function is used for mobile change task
 * 
 * @param {string} id 
 */
function touchEnd(id) {
    if (timer) {
        clearTimeout(timer)
        timer = false;
    }
}

/**
 * 
 * This function is used for mobile change task
 * 
 * @param {string} id 
 */
function onlongtouch(id) {
    let container = document.getElementById(id)
    for (let j = 0; j < 5; j++) {
        container.children[j].classList.add('opacity')
    }
    container.innerHTML +=
  /*html*/ `
  <div class="move-to-container" onclick="event.stopImmediatePropagation()">
    <div onclick="moveTo(${id}, 'toDo')"><p>To Do</p></div>
    <div onclick="moveTo(${id}, 'inProgress')"><p>In Progress</p></div>
    <div onclick="moveTo(${id}, 'awaitingFeedback')"><p>Awaiting Feedback</p></div>
    <div onclick="moveTo(${id}, 'done')"><p>Done</p></div>
  </div>
  `
}

/**
 * 
 * This function is used for mobile change task
 * 
 * @param {string} id 
 * @param {string} newStatus 
 */
async function moveTo(id, newStatus) {
    tasks[id].status = newStatus
    await backend.setItem(`tasks`, JSON.stringify(tasks));
    loadTasks()
}
/*
window.addEventListener('contextmenu', function (e) {
    e.preventDefault();
  }, false);
*/
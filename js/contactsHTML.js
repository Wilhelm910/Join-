function htmlTemplateRenderAlphabet(i) {
    return /*html*/ `
    <div class="alphabet">&nbsp;&nbsp;&nbsp;&nbsp;${alphabet[i]}<div class="thin-line"></div></div>
    <div style="margin-bottom:8px" id=group-${alphabet[i]}></div>
    `;
}


function htmlTemplateRenderAllContacts(contact, i) {
    return /*html*/ `
    <div onclick="renderSingleContact(${i}); doNotClose(event)" class="contact" tabindex="0">
        <div class="initial-circle small-circle" style="background-color: ${contact['color']};">
            ${contact['initials']}
        </div>
        <div>
            <p>${contact['name']}</p>
            <p style="font-size:14px; color:#0000EE">${contact['email']}</p>
        </div>
    </div>	
    `;
}


function htmlTemplateRenderSingleContact(contact, i) {
    return /*html*/ `
    <div>
        <a href="#" onclick="closeSingleContactMobile()" class="mobile-back-icon"><img src="./assets/img/back-mobile-icon.svg"></a>
        <div class="single-contact-name">
            <div class="initial-circle big-circle" style="background-color: ${contact['color']};">
                ${contact['initials']}
            </div>
            <div class="single-contact-task">
                <p>${contact['name']}</p>
                <a href="add_task.html" onclick="openAddTask(${contact['ID']})"><img src="./assets/img/plus-blue-icon.svg">Add Task</a>
            </div> 
        </div>
        <div class="single-contact-edit">
            <p>Contact Information</p>
            <a href="#" onclick="editContactOpen(${i})" class="pen-icon-desktop"><img src="./assets/img/pen-icon.svg">Edit Contact</a>
            <a href="#" onclick="editContactOpen(${i})" class="pen-icon-mobile"><img src="./assets/img/pen-mobile-icon.svg"></a>
        </div>
        <div class="single-contact-contact">
            <p>Email</p>
            <a href="mailto:${contact['email']}">${contact['email']}</a>
            <p>Phone</p>
            <span>${contact['phone']}</span>
        </div>
    </div>
`;
}


function htmlTemplateEditSingleContact(contact, i) {
    return /*html*/ `
    <div class="contact-field">
        <div class="contact-user-icon">
            <div class="initial-circle big-circle-edit" style="background-color: ${contact['color']};">
                ${contact['initials']}
            </div>
        </div>
        <div>
            <a onclick="editContactClose()" class="contact-close">
                <svg width="31" height="31" viewBox="0 0 31 31" fill="none"
                    xmlns="http://www.w3.org/2000/svg">
                    <path d="M22.9616 7.65393L7.65388 22.9617" stroke="#2A3647" stroke-width="2"
                        stroke-linecap="round" />
                    <path d="M22.8172 23.1061L7.50941 7.79832" stroke="#2A3647" stroke-width="2"
                        stroke-linecap="round" />
                </svg>
            </a>
            <form onsubmit="return false;">
                <div class="contact-form">
                    <div class="input-container">
                        <img src="./assets/img/name-icon.svg">
                        <input type="text" value="${contact['name']}" id="edit-name" class="input" required>
                    </div>
                    <div class="input-container">
                        <img src="./assets/img/email-icon.svg">
                        <input type="email" value="${contact['email']}" id="edit-email" class="input" required>
                    </div>
                    <div class="input-container">
                        <img src="./assets/img/phone-icon.svg">
                        <input type="tel" value="${contact['phone']}" id="edit-phone" pattern="^[+]?[0-9]{4,20}$"
                        class="input" required>
                    </div>
                </div>
                <div class="submit-container">
                    <button onclick="delateActiveContact(${i})" class="submit-btn delete">Delete
                        <svg width="25" height="25" viewBox="0 0 25 25" fill="none">
                            <path
                                d="M12.501 12.5L17.744 17.743M7.258 17.743L12.501 12.5L7.258 17.743ZM17.744 7.25696L12.5 12.5L17.744 7.25696ZM12.5 12.5L7.258 7.25696L12.5 12.5Z"
                                stroke="#2A3647" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" />
                        </svg>
                    </button>
                    <button onclick="saveActiveContact(${i})" type="submit" class="submit-btn save">Save</button>
                </div>
            </form>
        </div>
    </div>
`;
}
import { groups, getGroupbyName } from './groups.js';

// functions
function generateGroupHTML() {
    let generatedHTML = ''
    if (groups.length === 0) {
        generatedHTML = 'No Groups';
    } else {
        groups.forEach((group) => {
            generatedHTML += `
                <div class="group-card js-group-card" data-group-name="${group.name}">
                    ${group.name} (${group.members.length})
                </div>
            `
        });
    }
    groupCardContainerElement.innerHTML = generatedHTML;

    const groupCardElementsList = document.querySelectorAll('.js-group-card');
    groupCardElementsList.forEach((element) => {
        element.addEventListener('click', () => {
            setTimeout(() => {
                location.assign(`./pages/view-group.html?groupName=${element.dataset.groupName}`);
            }, 300);
        });
    });
}

// DOM elements
const createGroupButtonElement = document.querySelector('.js-create-group-button');
const groupCardContainerElement = document.querySelector('.js-group-card-container');

// event listeners
createGroupButtonElement.addEventListener('click', () => {
    setTimeout(() => {
        location.assign('./pages/create-group.html');
    }, 300);
});

// HTML
generateGroupHTML();
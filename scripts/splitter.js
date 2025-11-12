import { groups } from './groups.js';

// functions
function generateGroupHTML() {
    let generatedHTML = ''
    groups.forEach((group) => {
        generatedHTML += `
            <div class="group-card js-group-card" data-group-name="${group.name}">
                ${group.name} (${group.members.length})
            </div>
        `
    });
    groupCardContainerElement.innerHTML = generatedHTML;

    const groupCardElementsList = document.querySelectorAll('.js-group-card');
    groupCardElementsList.forEach((element) => {
        element.addEventListener('click', () => {
            alert(element.dataset.groupName);
        });
    });
}

// DOM elements
const createGroupButtonElement = document.querySelector('.js-create-group-button');
const groupCardContainerElement = document.querySelector('.js-group-card-container');

// event listeners
createGroupButtonElement.addEventListener('click', () => {
    setInterval(() => {
        location.href = 'pages/create-group.html'
    }, 300);
});

// generate HTML
generateGroupHTML();
import { groups } from './groups.js';

function generateGroupHTML() {
    let generatedHTML = ''
    groups.forEach((group) => {
        generatedHTML += `
            <div class="group-card">
                ${group.name}
            </div>
        `
    });
    groupCardContainerElement.innerHTML = generatedHTML;
}

const createGroupButtonElement = document.querySelector('.js-create-group-button');
const groupCardContainerElement = document.querySelector('.js-group-card-container');

generateGroupHTML();

createGroupButtonElement.addEventListener('click', () => {
    location.href = 'pages/create-group.html'
});
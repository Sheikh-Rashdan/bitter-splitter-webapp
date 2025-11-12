import { addGroup } from '../scripts/groups.js';

let groupName = '';
let numberOfPeople = 2;
let memberNames = [];

const groupNameInputElement = document.querySelector('.js-group-name-input');
const groupSpinboxNumberElement = document.querySelector('.js-group-spinbox-number');
const groupSpinboxDecrementtButtonElement = document.querySelector('.js-group-spinbox-decrement')
const groupSpinboxIncrementButtonElement = document.querySelector('.js-group-spinbox-increment')
const memberInputContainerElement = document.querySelector('.js-member-input-container');
const submitCreateGroupButtonElement = document.querySelector('.js-submit-create-group-button');

function updateGroupSpinbox() {
    numberOfPeople = Math.min(Math.max(2, numberOfPeople), 10);
    groupSpinboxNumberElement.innerHTML = numberOfPeople;
}

function generateMemberInputHTML() {
    let generatedHTML = '';
    for (let i = 0; i < numberOfPeople; i++) {
        generatedHTML += `<input type="text" placeholder="Member Name ${i + 1}" class="js-member-name-input" data-member-number="${i}" value="${memberNames[i] != undefined ? memberNames[i] : ""}">`;
    }
    memberInputContainerElement.innerHTML = generatedHTML;

    const memberNameInputElementList = document.querySelectorAll('.js-member-name-input')
    memberNameInputElementList.forEach((element) => {
        element.addEventListener('input', () => {
            memberNames[Number(element.dataset.memberNumber)] = element.value.trim();
        });
    });
}

groupSpinboxDecrementtButtonElement.addEventListener('click', () => {
    numberOfPeople--;
    updateGroupSpinbox();
    generateMemberInputHTML();
});

groupSpinboxIncrementButtonElement.addEventListener('click', () => {
    numberOfPeople++;
    updateGroupSpinbox();
    generateMemberInputHTML();
});

submitCreateGroupButtonElement.addEventListener('click', () => {
    let selectedMemberNames = memberNames.slice(0, numberOfPeople);
    if (groupNameInputElement.value && selectedMemberNames.length === numberOfPeople && !selectedMemberNames.includes('')) {
        addGroup(groupNameInputElement.value, selectedMemberNames);
        setInterval(() => {
            location.href = '../index.html';
        }, 300);
    } else {
        alert('temp -> failure');
    }
});

generateMemberInputHTML();
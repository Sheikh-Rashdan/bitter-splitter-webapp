import { addGroup, getGroupbyName } from '../scripts/groups.js';

// data
let numberOfPeople = 2;
let memberNames = [];

// functions
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
            element.classList.remove('failure-border');
            memberNames[Number(element.dataset.memberNumber)] = element.value.trim();
        });
    });
}

function checkMemberNameInputs(selectedMemberNames) {
    for (let i = 0; i < numberOfPeople; i++) {
        if (!selectedMemberNames[i])
            return i;
    }
    return null;
}

// DOM elements
const groupNameInputElement = document.querySelector('.js-group-name-input');
const groupSpinboxNumberElement = document.querySelector('.js-group-spinbox-number');
const groupSpinboxDecrementtButtonElement = document.querySelector('.js-group-spinbox-decrement')
const groupSpinboxIncrementButtonElement = document.querySelector('.js-group-spinbox-increment')
const memberInputContainerElement = document.querySelector('.js-member-input-container');
const submitCreateGroupButtonElement = document.querySelector('.js-submit-create-group-button');

// event listeners
groupNameInputElement.addEventListener('input', () => {
    groupNameInputElement.classList.remove('failure-border');
});

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
    if (!groupNameInputElement.value) {
        groupNameInputElement.classList.add('failure-border');
        groupNameInputElement.focus();
        return;
    }
    let selectedMemberNames = memberNames.slice(0, numberOfPeople);
    let failureInputIndex = checkMemberNameInputs(selectedMemberNames);

    if (failureInputIndex !== null) {
        document.querySelectorAll('.js-member-name-input').forEach((element) => {
            if (element.dataset.memberNumber == failureInputIndex) {
                element.classList.add('failure-border');
                element.focus();
            }
        });
        return;
    }

    if (getGroupbyName(groupNameInputElement.value)) {
        alert('Group Name Already Exists!');
        return;
    }

    addGroup(groupNameInputElement.value, selectedMemberNames);
    setInterval(() => {
        location.href = '../index.html';
    }, 300);
});

// generate HTML
generateMemberInputHTML();
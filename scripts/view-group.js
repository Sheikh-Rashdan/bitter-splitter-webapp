import { getGroupbyName } from "../scripts/groups.js";

// data
const groupName = new URLSearchParams(location.search).get('groupName');
const group = getGroupbyName(groupName);

// functions
function generateMemberNamesHTML() {
    let generatedHTML = '';
    group.members.forEach(memberName => {
        generatedHTML += `<div class="member-card">${memberName}</div>`;
    });
    memberCardsInnerContainerElement.innerHTML = generatedHTML;
}

function generateBillHTML() {
    let generatedHTML = '';
    if (group.bills.length === 0) {
        generatedHTML += 'No Data';
    } else {
        group.bills.forEach((bill) => {
            generatedHTML += 'Yes Data';
        });
    }
    billCardsContainerElement.innerHTML = generatedHTML;
}

// DOM elements
const groupNameElement = document.querySelector('.js-group-name');
const memberCardsInnerContainerElement = document.querySelector('.js-member-cards-inner-container');
const billCardsContainerElement = document.querySelector('.js-bill-cards-container');
const newBillButtonElement = document.querySelector('.js-new-bill-button');

// HTML
groupNameElement.innerHTML = groupName;
generateMemberNamesHTML();
generateBillHTML();

// event listeners
newBillButtonElement.addEventListener('click', () => {
    setInterval(() => {
        location.href = `create-bill.html?groupName=${groupName}`;
    }, 300);
});
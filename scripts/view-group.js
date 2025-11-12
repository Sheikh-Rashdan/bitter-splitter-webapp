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

// DOM elements
const groupNameElement = document.querySelector('.js-group-name');
const memberCardsInnerContainerElement = document.querySelector('.js-member-cards-inner-container');

// HTML
groupNameElement.innerHTML = groupName;
generateMemberNamesHTML();
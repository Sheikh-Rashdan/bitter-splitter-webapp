import { getGroupbyName, removeGroup } from "../scripts/groups.js";

// data
const groupName = new URLSearchParams(location.search).get('groupName');
const group = getGroupbyName(groupName);

if (!group) {
    location.href = '../index.html';
}

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
            generatedHTML = `
                <div class="bill-card js-bill-card" data-bill-id="${bill.id}">
                    <p>${bill.date}</p>
                    <p>₹ ${bill.total}</p>
                </div>
            ` + generatedHTML;
        });
    }
    billCardsContainerElement.innerHTML = generatedHTML;

    document.querySelectorAll('.js-bill-card').forEach((element) => {
        element.addEventListener('click', () => {
            setTimeout(() => {
                location.href = `./view-bill.html?groupName=${groupName}&billId=${element.dataset.billId}`;
            }, 300);
        });
    });
}

// DOM elements
const groupNameElement = document.querySelector('.js-group-name');
const memberCardsInnerContainerElement = document.querySelector('.js-member-cards-inner-container');
const billCardsContainerElement = document.querySelector('.js-bill-cards-container');
const newBillButtonElement = document.querySelector('.js-new-bill-button');
const deleteGroupButtonElement = document.querySelector('.js-delete-group-button');

// HTML
groupNameElement.innerHTML = groupName;
generateMemberNamesHTML();
generateBillHTML();

// event listeners
newBillButtonElement.addEventListener('click', () => {
    setTimeout(() => {
        location.href = `./create-bill.html?groupName=${groupName}`;
    }, 300);
});

deleteGroupButtonElement.addEventListener('click', () => {
    removeGroup(groupName);
    setTimeout(() => {
        location.href = '../index.html';
    }, 300);
});
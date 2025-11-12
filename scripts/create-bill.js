import { getGroupbyName } from "../scripts/groups.js";

// data
const groupName = new URLSearchParams(location.search).get('groupName');
const group = getGroupbyName(groupName);
let bill = [];
let currentItem = {
    name: 'Item 0',
    cost: 0,
    splitBy: []
}

function toggleIncludeMember(memberName) {
    if (currentItem.splitBy.includes(memberName)) {
        currentItem.splitBy.splice(currentItem.splitBy.indexOf(memberName), 1);
    } else {
        currentItem.splitBy.push(memberName);
    }
}

function generateMemberHTML() {
    let generatedHTML = '';
    group.members.forEach((member) => {
        generatedHTML += `<div class="member-card js-member-card" data-member-name="${member}">${member}</div>`;
    });
    memberCardContainerElement.innerHTML = generatedHTML;

    document.querySelectorAll('.js-member-card').forEach((element) => {
        element.addEventListener('click', () => {
            toggleIncludeMember(element.dataset.memberName);
            generateMemberHTML();
        });
        if (currentItem.splitBy.includes(element.dataset.memberName)) {
            element.classList.add('member-card-selected');
        }
    });
}

function generateBillItemHTML() {
    let generatedHTML = '';
    if (bill.length === 0) {
        generatedHTML = 'No Items';
    } else {
        bill.forEach((billItem) => {
            generatedHTML += `
            <div class="bill-item-card">
                <p>${billItem.name}</p>
                <p>₹ ${billItem.cost}</p>
            </div>
        `;
        });
    }
    billItemCardContainerElement.innerHTML = generatedHTML;
}

// DOM elements
const groupNameElement = document.querySelector('.js-group-name');
const billItemCardContainerElement = document.querySelector('.js-bill-item-card-container');
const memberCardContainerElement = document.querySelector('.js-member-card-container');
const itemNameInputElement = document.querySelector('.js-item-name-input');
const itemCostInputElement = document.querySelector('.js-item-cost-input');
const submitAddItemButtonElement = document.querySelector('.js-submit-add-item-button');

// HTML
groupNameElement.innerHTML = groupName;
generateMemberHTML();
generateBillItemHTML();

// event listeners
itemCostInputElement.addEventListener('input', () => {
    itemCostInputElement.classList.remove('failure-border');
});

submitAddItemButtonElement.addEventListener('click', () => {
    if (!itemCostInputElement.value) {
        itemCostInputElement.classList.add('failure-border');
        itemCostInputElement.focus();
        return;
    }
    if (currentItem.splitBy.length === 0) {
        alert('Select Members to Split!');
        return;
    }
    currentItem.name = itemNameInputElement.value !== '' ? itemNameInputElement.value : `Item ${bill.length + 1}`;
    currentItem.cost = Number(itemCostInputElement.value);
    bill.push(JSON.parse(JSON.stringify(currentItem)));

    itemNameInputElement.value = '';
    itemCostInputElement.value = '';
    console.log(bill);
    generateBillItemHTML();
});
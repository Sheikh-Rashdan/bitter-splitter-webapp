import { getGroupbyName, createBillbyName } from "../scripts/groups.js";

// data
const groupName = new URLSearchParams(location.search).get('groupName');
const group = getGroupbyName(groupName);
let billItems = [];
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
            updateMemberCards();
        });
    });
    updateMemberCards();
}

function updateMemberCards() {
    document.querySelectorAll('.js-member-card').forEach((element) => {
        if (currentItem.splitBy.includes(element.dataset.memberName)) {
            element.classList.add('member-card-selected');
        } else {
            element.classList.remove('member-card-selected');
        }
    });
}

function generateBillItemHTML() {
    let generatedHTML = '';
    if (billItems.length === 0) {
        generatedHTML = 'No Items';
    } else {
        billItems.forEach((billItem) => {
            generatedHTML += `
            <div class="bill-item-card js-bill-item-card">
                <p>${billItem.name}</p>
                <p>₹ ${billItem.cost}</p>
                <button class="plain-button delete-bill-item-button js-delete-bill-item-button" data-item-name="${billItem.name}">
                    <i class='bx  bxs-x'></i> 
                </button>
            </div>
        `;
        });
    }
    billItemCardContainerElement.innerHTML = generatedHTML;

    document.querySelectorAll('.js-delete-bill-item-button').forEach((element) => {
        element.addEventListener('click', () => {
            console.log(element.dataset.itemName);
            billItems = billItems.filter((billItem) => {
                if (billItem.name === element.dataset.itemName) return false;
                return true;
            });
            generateBillItemHTML();
        });
    });

}

// DOM elements
const groupNameElement = document.querySelector('.js-group-name');
const billItemCardContainerElement = document.querySelector('.js-bill-item-card-container');
const memberCardContainerElement = document.querySelector('.js-member-card-container');
const itemNameInputElement = document.querySelector('.js-item-name-input');
const itemCostInputElement = document.querySelector('.js-item-cost-input');
const submitAddItemButtonElement = document.querySelector('.js-submit-add-item-button');
const submitSplitBillButton = document.querySelector('.js-submit-split-bill-button');

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
    currentItem.cost = Number(itemCostInputElement.value);

    if (currentItem.splitBy.length === 0) {
        alert('Select Members To Split!');
        return;
    }

    currentItem.name = itemNameInputElement.value !== '' ? itemNameInputElement.value : `Item ${billItems.length + 1}`;
    let isNameUnique = false;
    while (!isNameUnique) {
        isNameUnique = true;
        for (let i = 0; i < billItems.length; i++) {
            let billItem = billItems[i];
            if (billItem.name === currentItem.name) {
                isNameUnique = false;
                currentItem.name += '-1';
            }
        }
    }

    billItems.push(structuredClone(currentItem));

    itemNameInputElement.value = '';
    itemCostInputElement.value = '';
    generateBillItemHTML();
});

submitSplitBillButton.addEventListener('click', () => {
    if (billItems.length === 0) {
        alert('Add Items To Split!');
        return;
    }
    let billId = createBillbyName(billItems, groupName);
    setTimeout(() => {
        location.assign(`./view-bill.html?groupName=${groupName}&billId=${billId}`);
        // location.href = `./view-bill.html?groupName=${groupName}&billId=${billId}`;
    }, 300);
});
import { getGroupbyName, getBillbyBillId, removeBillbyId } from '../scripts/groups.js';

// data
const searchParams = new URLSearchParams(location.search);
const groupName = searchParams.get('groupName');
const billId = searchParams.get('billId');

const group = getGroupbyName(groupName);
const bill = getBillbyBillId(group, billId);

if (!bill) {
    location.assign(`./view-group.html?groupName=${groupName}`);
}

// functions
let splitAmounts = [];
function generateMemberHTML() {
    let generatedHTML = '';

    group.members.forEach((memberName) => {
        splitAmounts.push({
            memberName,
            amount: 0
        });
    });

    bill.items.forEach((billItem) => {
        for (let i = 0; i < splitAmounts.length; i++) {
            let splitAmount = splitAmounts[i];
            if (billItem.splitBy.includes(splitAmount.memberName)) {
                splitAmount.amount += billItem.cost / billItem.splitBy.length;
            }
        }
    });

    splitAmounts.forEach((splitAmount) => {
        generatedHTML += `
            <div class="member-card">
                <p>${splitAmount.memberName}</p>
                <p>₹ ${Math.round(splitAmount.amount * 100) / 100}</p>
            </div>
        `;
    });

    memberCardContainerElement.innerHTML = generatedHTML;
}

function generateBillItemHTML() {
    let generatedHTML = '';
    bill.items.forEach((billItem) => {
        generatedHTML += `
        <div class="bill-item-card">
            <p>${billItem.name}</p>
            <p>₹ ${billItem.cost}</p>
        </div>
    `;
    });
    billItemCardContainerElement.innerHTML = generatedHTML;
}

// DOM elements
const billDateElement = document.querySelector('.js-bill-date');
const billLabelElement = document.querySelector('.js-bill-label');
const billItemCardContainerElement = document.querySelector('.js-bill-item-card-container');
const memberCardContainerElement = document.querySelector('.js-member-card-container');
const deleteBillButtonElement = document.querySelector('.js-delete-bill-button');
const backButtonElement = document.querySelector('.js-back-button');
const shareButtonElement = document.querySelector('.js-share-button');

// HTML
billDateElement.innerHTML = bill.date;
billLabelElement.innerHTML = `Bill - ₹ ${bill.total}`;
generateMemberHTML();
generateBillItemHTML();

// event listeners
deleteBillButtonElement.addEventListener('click', () => {
    removeBillbyId(group, billId);
    setTimeout(() => {
        location.assign(`./view-group.html?groupName=${groupName}`);
    }, 300);
});

backButtonElement.addEventListener('click', () => {
    setTimeout(() => {
        location.assign(`view-group.html?groupName=${groupName}`);
    }, 300);
});

shareButtonElement.addEventListener('click', () => {
    let textToCopy = `Bill - ${bill.date}\n`;
    textToCopy += 'Item name - Cost\n';
    bill.items.forEach((billItem) => {
        textToCopy += `${billItem.name} - ₹ ${billItem.cost}\n`;
    });
    textToCopy += '----------------\n';
    textToCopy += 'Person - Amount\n';
    splitAmounts.forEach((splitAmount) => {
        textToCopy += `${splitAmount.memberName} - ₹ ${splitAmount.amount}\n`;
    });
    textToCopy += '----------------\n';
    if (!navigator.clipboard) {
        alert('Failed To Copy To Clipboard!');
        return;
    }
    navigator.clipboard.writeText(textToCopy);
    alert('Copied To Clipboard!');
});
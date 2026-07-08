import { getGroupbyName, getBillbyBillId, removeBillbyId } from '../scripts/groups.js';
import { formatAmount } from '../scripts/utils.js';

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
const splitAmounts = [];
const optedItems = {};
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
        billItem.splitBy.forEach((name) => {
            if (optedItems[name]) optedItems[name].push(billItem.name);
            else optedItems[name] = [billItem.name];
        });
    });

    splitAmounts.forEach(splitAmount => splitAmount.amount = formatAmount(splitAmount.amount));

    splitAmounts.forEach((splitAmount) => {
        generatedHTML += `
            <div class="member-card" data-member-name="${splitAmount.memberName}" data-opted-items="${optedItems[splitAmount.memberName]}">
                <p>${splitAmount.memberName}</p>
                <p>₹ ${formatAmount(splitAmount.amount)} <i class="bx bx-chevrons-right" style="vertical-align: middle;"></i></p>
            </div>
        `;
    });

    memberCardContainerElement.innerHTML = generatedHTML;

    document.querySelectorAll(".member-card").forEach(memberCard => {
        memberCard.addEventListener('click', () => {
            billOptInfoBg.classList.remove('hidden');
            const memberName = memberCard.dataset.memberName;
            const optedItems = memberCard.dataset.optedItems.replaceAll(",", " • ");
            billOptInfoContainer.innerHTML = `
                <b style="text-align: center;">${memberName}</b>
                <i style="font-size: 12px;">Opted for</i>
                <span style="text-align: center;">${optedItems}</span>
            `;
        });
    });
}

function generateBillItemHTML() {
    let generatedHTML = '';
    bill.items.forEach((billItem) => {
        generatedHTML += `
        <div class="bill-item-card" data-split-by="${billItem.splitBy}" data-item-name="${billItem.name}"">
            <p>${billItem.name}</p>
            <p>₹ ${formatAmount(billItem.cost)} <i class="bx bx-chevrons-right" style="vertical-align: middle;"></i></p>
        </div>
    `;
    });

    billItemCardContainerElement.innerHTML = generatedHTML;

    document.querySelectorAll(".bill-item-card").forEach(billItemCard => {
        billItemCard.addEventListener('click', () => {
            billOptInfoBg.classList.remove('hidden');
            const splitByItem = billItemCard.dataset.itemName;
            const splitByNames = billItemCard.dataset.splitBy.replaceAll(",", " • ");
            billOptInfoContainer.innerHTML = `
                <b style="text-align: center;">${splitByItem}</b>
                <i style="font-size: 12px;">Split by</i>
                <span style="text-align: center;">${splitByNames}</span>
            `;
        });
    });
}

// DOM elements
const billDateElement = document.querySelector('.js-bill-date');
const billLabelElement = document.querySelector('.js-bill-label');
const billItemCardContainerElement = document.querySelector('.js-bill-item-card-container');
const memberCardContainerElement = document.querySelector('.js-member-card-container');
const deleteBillButtonElement = document.querySelector('.js-delete-bill-button');
const backButtonElement = document.querySelector('.js-back-button');
const shareButtonElement = document.querySelector('.js-share-button');
const billOptInfoBg = document.querySelector('.js-bill-opt-info-bg');
const billOptInfoContainer = document.querySelector('.js-bill-opt-info-container');

// HTML
billDateElement.innerHTML = bill.date;
billLabelElement.innerHTML = `Bill - ₹ ${formatAmount(bill.total)}`;
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

billOptInfoBg.addEventListener('click', () => {
    billOptInfoBg.classList.add('hidden');
});

shareButtonElement.addEventListener('click', () => {
    let textToCopy = 'BitterSplitter Bill\n';
    textToCopy += `${bill.date}\n`;
    textToCopy += '----------------------------------\n';
    textToCopy += '*Summary*\n';
    splitAmounts.forEach((splitAmount) => {
        textToCopy += `• ${splitAmount.memberName}: ₹ ${formatAmount(splitAmount.amount)}\n`;
    });
    textToCopy += '----------------------------------\n';
    textToCopy += '*Items*\n';
    bill.items.forEach((billItem) => {
        textToCopy += `• ${billItem.name} - ₹ ${formatAmount(billItem.cost)}\n`;
    });
    textToCopy += '----------------------------------\n';
    textToCopy += '*People*\n';
    splitAmounts.forEach((splitAmount) => {
        const optedItemsString = optedItems[splitAmount.memberName].toString().replaceAll(",", ", ");
        textToCopy += `• ${splitAmount.memberName} -> \`${optedItemsString}\`\n`;
    });
    textToCopy += '----------------------------------\n';

    if (!navigator.clipboard) {
        alert('Failed To Share!');
        return;
    }
    navigator.share({ text: textToCopy }).catch(() => alert("Failed To Share!"));
    navigator.clipboard.writeText(textToCopy);

    let previousHTML = shareButtonElement.innerHTML;
    shareButtonElement.innerText = 'Copied To Clipboard!';
    setTimeout(() => {
        shareButtonElement.innerHTML = previousHTML;
    }, 1000);
});
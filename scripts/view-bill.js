import { getGroupbyName, getBillbyBillId, removeBillbyId, getItemByName, calculateBillTotal, editBillItem, toggleIncludeMember, deleteBillItem } from '../scripts/groups.js';
import { formatAmount, checkUniqueName } from '../scripts/utils.js';

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
            <div class="member-card" data-member-name="${splitAmount.memberName}">
                <p>${splitAmount.memberName}</p>
                <p>₹ ${formatAmount(splitAmount.amount)} <i class="bx bxs-chevrons-right"></i></p>
            </div>
        `;
    });

    memberCardContainerElement.innerHTML = generatedHTML;

    document.querySelectorAll(".member-card").forEach(memberCard => {
        memberCard.addEventListener('click', () => {
            billOptInfoBg.classList.remove('hidden');
            const memberName = memberCard.dataset.memberName;
            let memberOptedItems = optedItems[memberName];
            let memberOptedHTML = `<div class="opted-item-container">`;
            if (!memberOptedItems) memberOptedHTML = "Nothing";
            else {
                memberOptedItems.forEach((optedItemName) => {
                    const optedItem = getItemByName(bill, optedItemName);
                    const splitCost = formatAmount(optedItem.cost / optedItem.splitBy.length);
                    memberOptedHTML += `<p>${optedItem.name} - ₹ ${splitCost}</p>`;
                });
                memberOptedHTML += `</div>`;
            }
            billOptInfoContainer.innerHTML = `
                <b>${memberName}</b>
                <span class="smaller">Opted for</span>
                ${memberOptedHTML}
                `;
        });
    });
}

let clearEditInfoName = null;
function generateBillItemHTML() {
    let generatedHTML = '';
    bill.items.forEach((billItem) => {
        generatedHTML += `
        <div class="bill-item-card" data-item-name="${billItem.name}"">
            <p>${billItem.name}</p>
            <p>₹ ${formatAmount(billItem.cost)} <i class="bx bxs-chevrons-right"></i></p>
        </div>
    `;
    });

    billItemCardContainerElement.innerHTML = generatedHTML;

    document.querySelectorAll(".bill-item-card").forEach(billItemCard => {
        billItemCard.addEventListener('click', () => {
            billOptInfoBg.classList.remove('hidden');

            const itemName = billItemCard.dataset.itemName;
            const billItem = getItemByName(bill, itemName)
            const splitByNames = (billItem.splitBy || "Nothing").toString().split(",");

            billOptInfoContainer.innerHTML = `
                <b>${itemName}</b>
                <span class="smaller">Split by</span>
            `;

            let editInfoNameContainerHTML = `<div class="edit-opt-container">`;
            group.members.forEach((member) => {
                editInfoNameContainerHTML += `<div class="edit-opt js-edit-opt" data-member-name="${member}">${member}</div>`;
            });
            editInfoNameContainerHTML += `</div>`;

            billOptInfoContainer.innerHTML += editInfoNameContainerHTML;
            billOptInfoContainer.innerHTML += `
                <div class="edit-input-master-container">
                    <div class="edit-input-container">
                        <p class="edit-input-label">Edit Name:</p>
                        <input type="text" class="edit-input js-edit-name-input">
                    </div>
                    <div class="edit-input-container">
                        <p class="edit-input-label">Edit Cost:</p>
                        <input type="number" class="edit-input js-edit-cost-input">
                    </div>
                </div>
                <button class="edit-info-button js-edit-info-button disabled">Modify<i class="bx bxs-edit-alt"></i></button>
                <button class="delete-item-button js-delete-item-button">Delete<i class="bx bxs-trash-x"></i></button>
            `;

            const editNameInput = document.querySelector('.js-edit-name-input');
            const editCostInput = document.querySelector('.js-edit-cost-input');
            const editInfoButton = document.querySelector('.js-edit-info-button');
            const deleteItemButton = document.querySelector('.js-delete-item-button');
            const backupSplitBy = structuredClone(billItem.splitBy)

            function updateModifyButton() {
                let splitByBool = true;
                billItem.splitBy.forEach((memberName) => {
                    if (!backupSplitBy.includes(memberName)) {
                        splitByBool = false;
                        return;
                    }
                });
                if (editNameInput.value == billItem.name && editCostInput.value == billItem.cost && splitByBool) {
                    editInfoButton.classList.add('disabled');
                } else {
                    editInfoButton.classList.remove('disabled');
                }
            }

            function updateEditInfoCards() {
                document.querySelectorAll(".js-edit-opt").forEach((element) => {
                    if (billItem.splitBy.includes(element.dataset.memberName)) {
                        element.classList.add("selected");
                    } else {
                        element.classList.remove("selected");
                    }
                });
            }

            editCostInput.value = billItem.cost;
            editCostInput.addEventListener('input', () => {
                editCostInput.classList.remove('failure-border');
                updateModifyButton();
            });
            editNameInput.value = billItem.name;
            editNameInput.addEventListener('input', () => {
                editNameInput.classList.remove('failure-border');
                updateModifyButton();
            });

            document.querySelectorAll(".js-edit-opt").forEach((element) => {
                element.addEventListener('click', () => {
                    if (!clearEditInfoName) clearEditInfoName = () => { billItem.splitBy = backupSplitBy; }
                    toggleIncludeMember(billItem, element.dataset.memberName);
                    updateEditInfoCards();
                    updateModifyButton();
                });
            })
            updateEditInfoCards();

            editInfoButton.addEventListener('click', () => {
                if (editInfoButton.classList.contains("disabled")) return;

                if (!editCostInput.value) {
                    editCostInput.classList.add('failure-border');
                    editCostInput.focus();
                    return;
                }
                if (!editNameInput.value) {
                    editNameInput.classList.add('failure-border');
                    editNameInput.focus();
                    return;
                }

                const newAmount = formatAmount(editCostInput.value);
                let newName = editNameInput.value;
                if (newAmount <= 0) {
                    alert("Item Cost Must Be Positive!")
                    editCostInput.classList.add('failure-border');
                    editCostInput.focus();
                    return;
                }
                if (billItem.splitBy.length === 0) {
                    alert('Select Members To Split!');
                    return;
                }
                while (newName != billItem.name && !checkUniqueName(bill.items, newName)) {
                    newName += '~';
                }
                editBillItem(bill, billItem, newAmount, newName);
                setTimeout(() => {
                    location.assign(`./view-bill.html?groupName=${groupName}&billId=${billId}`);
                }, 300);
            });

            deleteItemButton.addEventListener('click', () => {
                deleteBillItem(bill, billItem);
                setTimeout(() => {
                    location.assign(`./view-bill.html?groupName=${groupName}&billId=${billId}`);
                }, 300);
            });
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

billOptInfoBg.addEventListener('click', (event) => {

    if (event.target !== event.currentTarget) return;

    billOptInfoBg.classList.add('hidden');
    if (clearEditInfoName) clearEditInfoName();
    clearEditInfoName = null;
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
        const optedItemsValue = optedItems[splitAmount.memberName] || "Nothing";
        const optedItemsString = optedItemsValue.toString().replaceAll(",", ", ");
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
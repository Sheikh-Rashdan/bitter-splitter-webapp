import { addGroupMember, getGroupbyName, removeGroup, removeGroupMember } from "../scripts/groups.js";
import { formatAmount } from "../scripts/utils.js";

// data
const groupName = new URLSearchParams(location.search).get('groupName');
const group = getGroupbyName(groupName);

if (!group) {
    location.assign('../index.html');
}

// functions
function generateMemberNamesHTML() {
    let generatedHTML = '';
    group.members.forEach(memberName => {
        generatedHTML += `<div class="member-card">${memberName}</div>`;
    });
    if (group.members.length == 0) {
        generatedHTML = "<span class='centered-span'>No Members</span>";
    }
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
                    <p>₹ ${formatAmount(bill.total)} <i class="bx bxs-chevrons-right"></i></p>
                </div>
            ` + generatedHTML;
        });
    }
    billCardsContainerElement.innerHTML = generatedHTML;

    document.querySelectorAll('.js-bill-card').forEach((element) => {
        element.addEventListener('click', () => {
            setTimeout(() => {
                location.assign(`./view-bill.html?groupName=${groupName}&billId=${element.dataset.billId}`);
            }, 300);
        });
    });
}

function generateManageMembersHTML() {
    let generatedHTML = `<b>${group.name} Members</b>`;

    if (group.members.length !== 0) {
        generatedHTML += '<div class="group-member-card-container">';
        group.members.forEach((memberName) => {
            generatedHTML += `
        <div class="group-member-card">
            <p>${memberName}</p>
            <button class="plain-button gray remove-group-name-button js-remove-group-name-button" data-member-name="${memberName}">
                    <i class='bx bxs-x'></i>
            </button>
        </div>`;
        });
        generatedHTML += '</div>';
    } else {
        generatedHTML += "<span>No Members</span>";
    }

    generatedHTML += `
    <div class="overlay-input-master-container single">
        <div class="overlay-input-container">
            <p class="overlay-input-label">Enter New Name:</p>
            <input type="text" class="overlay-input js-new-name-input">
        </div>
        <button class="js-add-member-button disabled">Add <i class='bx bxs-user-plus'></i> </button>
    </div>
    `;

    groupManageMembersContainer.innerHTML = generatedHTML;

    document.querySelectorAll(".js-remove-group-name-button").forEach((button) => {
        button.addEventListener('click', () => {
            setTimeout(() => {
                let name = button.dataset.memberName;
                removeGroupMember(group, name)
                generateManageMembersHTML();
                generateMemberNamesHTML();
            }, 300);
        });
    });
    document.querySelector('.js-new-name-input').addEventListener('input', (event) => {
        let newName = event.target.value.trim();
        if (newName === "" || group.members.includes(newName)) {
            document.querySelector(".js-add-member-button").classList.add("disabled");
        } else {
            document.querySelector(".js-add-member-button").classList.remove("disabled");
        }
    });
    document.querySelector('.js-add-member-button').addEventListener('click', (event) => {
        if (event.target.classList.contains("disabled")) return;
        addGroupMember(group, document.querySelector(".js-new-name-input").value);
        generateManageMembersHTML();
        generateMemberNamesHTML();
    });
}

// DOM elements
const groupNameElement = document.querySelector('.js-group-name');
const memberCardsInnerContainerElement = document.querySelector('.js-member-cards-inner-container');
const billCardsContainerElement = document.querySelector('.js-bill-cards-container');
const manageMembersButtonElement = document.querySelector('.js-manage-members-button');
const newBillButtonElement = document.querySelector('.js-new-bill-button');
const deleteGroupButtonElement = document.querySelector('.js-delete-group-button');
const backButtonElement = document.querySelector('.js-back-button');
const groupManageMembersBg = document.querySelector('.js-group-manage-members-bg');
const groupManageMembersContainer = document.querySelector('.js-group-manage-members-container');

// HTML
groupNameElement.innerHTML = groupName;
generateMemberNamesHTML();
generateBillHTML();

// event listeners
manageMembersButtonElement.addEventListener('click', () => {
    groupManageMembersBg.classList.remove('hidden');
    generateManageMembersHTML();
});

newBillButtonElement.addEventListener('click', () => {
    setTimeout(() => {
        location.assign(`./create-bill.html?groupName=${groupName}`);
    }, 300);
});

deleteGroupButtonElement.addEventListener('click', () => {
    removeGroup(groupName);
    setTimeout(() => {
        location.assign('../index.html');
    }, 300);
});

groupManageMembersBg.addEventListener('click', (event) => {
    if (event.target !== event.currentTarget) return;
    groupManageMembersBg.classList.add('hidden');
});

backButtonElement.addEventListener('click', () => {
    setTimeout(() => {
        location.assign('../index.html');
    }, 300);
});
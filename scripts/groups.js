import dayjs from 'https://esm.sh/dayjs';

// data
const GROUPS_KEY = 'GroupsKey';
export let groups = loadGroups();

// functions
export function addGroup(name, members) {
    groups.push({ name, members, bills: [] });
    saveGroups();
}

export function removeGroup(name) {
    groups = groups.filter(group => group.name !== name);
    saveGroups();
}

export function getGroupbyName(name) {
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        if (group.name === name) return group;
    }
}

export function createBillbyName(items, name) {
    let group = getGroupbyName(name);

    let total = 0;
    items.forEach((billItem) => {
        total += billItem.cost;
    });

    if (!crypto.randomUUID) {
        function uuidFallback() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ Math.random() * 16 >> c / 4).toString(16)
            );
        }
        crypto.randomUUID = uuidFallback;
    }
    let id = crypto.randomUUID();

    group.bills.push({
        id,
        date: dayjs().format('DD-MM-YY hh:mm A'),
        total,
        items
    });

    saveGroups();

    return id;
}

export function removeBillbyId(group, billId) {
    group.bills = group.bills.filter(bill => bill.id !== billId);
    saveGroups();
}

export function getBillbyBillId(group, billId) {
    return group.bills[group.bills.findIndex(bill => bill.id === billId)];
}

function loadGroups() {
    return JSON.parse(localStorage.getItem(GROUPS_KEY)) ?? [];
}

function saveGroups() {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

function clearGroups() {
    groups = [];
    saveGroups();
}

/* structure
{
    name: 'GroupName1',
    members: ['MemberName1', 'MemberName2', 'MemberName3'],
    bills: [
            {
                id: 'bill02',
                date: Date(),
                total: 1000,
                items: [
                    {
                        name: 'ItemName1',
                        cost: 100,
                        splitBy: ['MemberName2', 'MemberName3']
                    }
                ]
            } 
        ]
}*/
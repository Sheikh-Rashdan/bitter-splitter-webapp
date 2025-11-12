// data
const GROUPS_KEY = 'GroupsKey';
export let groups = loadGroups();

// functions
export function addGroup(name, members) {
    groups.push({ name, members, bills: [] });
    saveGroups();
}

export function getGroupbyName(name) {
    for (let i = 0; i < groups.length; i++) {
        const group = groups[i];
        if (group.name === name) return group;
    }
}

function loadGroups() {
    return JSON.parse(localStorage.getItem(GROUPS_KEY)) ?? [];
}

function saveGroups() {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

/* structure
{
    name: 'GroupName1',
    members: ['MemberName1', 'MemberName2', 'MemberName3'],
    bills: [
           date: Date(),
           time: Time(),
           total: 1000,
           items: [
                {
                    name: 'ItemName1',
                    cost: 100,
                    splitBy: ['MemberName2', 'MemberName3']
                }
            ] 
        ]
}*/
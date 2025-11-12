// data
const GROUPS_KEY = 'GroupsKey';
export let groups = loadGroups();

// functions
export function addGroup(name, members) {
    groups.push({ name, members, bills: [] });
    saveGroups();
}

function loadGroups() {
    return JSON.parse(localStorage.getItem(GROUPS_KEY)) ?? [];
}

function saveGroups() {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}
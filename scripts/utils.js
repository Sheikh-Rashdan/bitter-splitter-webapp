export function formatAmount(amount) {
    return Math.round(amount * 100) / 100;
}

export function checkUniqueName(billItems, itemName) {
    let isItemUnique = true;
    billItems.forEach((billItem) => {
        if (billItem.name === itemName) {
            isItemUnique = false;
            return;
        }
    });
    return isItemUnique;
}
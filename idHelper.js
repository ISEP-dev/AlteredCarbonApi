export const getNewId = array =>
    array.reduce((maxId, itemWithId) => itemWithId.id >= maxId ? itemWithId.id + 1 : maxId, 1)
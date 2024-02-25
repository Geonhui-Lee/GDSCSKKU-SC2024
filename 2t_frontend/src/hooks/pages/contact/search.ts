import { mediaDestinations } from "data/destination";
import { ContactManifest, ContactManifests } from "data/standard/document";
import { TelenotesManifest } from "data/standard/document/telenotes";

export type GrouppedContactManifest = Record<string, ContactManifest[]>;

export function getFilteredTelenotesItemsGroup(
    filter: (items: ContactManifests) => GrouppedContactManifest = filterContactManifestGroup.byAlphabetically,
    items: ContactManifest[],
    searchText?: string
): GrouppedContactManifest {
    if (searchText === undefined || searchText === "") return filter(items);

    function checkStringMatch(item: string | undefined, searchText: string) {
        if (!item) return false;
        return item.toLowerCase().includes(searchText.toLowerCase());
    };
    
    const filteredItems = items.filter(item => {
        const matches = [
            checkStringMatch(item.name, searchText),
            checkStringMatch(item.phoneNumber, searchText),
        ]
        return matches.some(match => match);
    });
    
    const grouppedItems = filter(filteredItems);
    
    return grouppedItems;
};

export const filterContactManifestGroup = {
    byAlphabetically: function (items: ContactManifests) {
        return items.reduce<GrouppedContactManifest>((acc, item) => {
            const key = item.name?.charAt(0).toUpperCase() || "#";
            if (!acc[key]) {
                acc[key] = [];
            }
            acc[key].push(item);
            return acc;
        }, {});
    } as (items: ContactManifests) => GrouppedContactManifest,
};

export function getMappedContactManifestGroup(grouppedItems: GrouppedContactManifest) {
    return Object.entries(grouppedItems).map(([key, items], index) => ({
        key,
        items,
        index
    }));
};

export const getContactItemValue = {
    title: (item: ContactManifest) => {
        return item.name
    },
    avatar: (item: ContactManifest) => {
        return mediaDestinations.user.telenotes.avatar.default;
    },
};
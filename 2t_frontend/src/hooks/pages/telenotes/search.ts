import { mediaDestinations } from "data/destination";
import { TelenotesManifest } from "data/standard/document/telenotes";
import { reverseObjectKeys } from "hooks/sort";

export type GrouppedTelenotesManifest = Record<string, TelenotesManifest[]>;

export function getFilteredTelenotesItemsGroup(
    filter: (items: TelenotesManifest[]) => GrouppedTelenotesManifest = sortTelenotesManifestGroup.byDate,
    items: TelenotesManifest[],
    searchText?: string
): GrouppedTelenotesManifest {
    if (searchText === undefined || searchText === "") return filter(items);

    function checkStringMatch(item: string | undefined, searchText: string) {
        if (!item) return false;
        return item.toLowerCase().includes(searchText.toLowerCase());
    };
    
    const filteredItems = items.filter(item => {
        const matches = [
            checkStringMatch(item.info.contact.phoneNumber, searchText),
            checkStringMatch(item.info.contact.name, searchText),
            checkStringMatch(item.info.title, searchText),
        ]
        return matches.some(match => match);
    });
    
    const grouppedItems = filter(filteredItems);
    
    return grouppedItems;
};

export const sortTelenotesManifestGroup = {
    byDate: function (items: TelenotesManifest[], isReverse?: boolean) {
        const sortedData = items.reduce<GrouppedTelenotesManifest>((acc, item) => {
            function getDateString(date: Date) {
                return date.toISOString().split("T")[0];
            }
            const date = getDateString(item.time.created);
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {});
        return sortedData
    } as (items: TelenotesManifest[]) => GrouppedTelenotesManifest,
    byReversedDate: function (items: TelenotesManifest[], isReverse?: boolean) {
        const sortedData = items.reduce<GrouppedTelenotesManifest>((acc, item) => {
            function getDateString(date: Date) {
                return date.toISOString().split("T")[0];
            }
            const date = getDateString(item.time.created);
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(item);
            return acc;
        }, {});
        return reverseObjectKeys(sortedData)
    } as (items: TelenotesManifest[]) => GrouppedTelenotesManifest,
};

export function getMappedTelenotesManifestGroup(grouppedItems: GrouppedTelenotesManifest) {
    return Object.entries(grouppedItems).map(([key, items], index) => ({
        key,
        items,
        index
    }));
};

export const getTelenotesItemValue = {
    title: (item: TelenotesManifest) => {
        return item.info.contact.name ? item.info.contact.name : item.info.contact.phoneNumber
    },
    info: (item: TelenotesManifest) => {
        return (
            item.info?.title ? item.info.title :
            item.info.contact.name ? item.info.contact.name :
            item.info.contact.phoneNumber
        )
    },
    timeString: (item: TelenotesManifest) => {
        const date = item.time.created;
    
        const meridiem = date.getHours() >= 12 ? "PM" : "AM";
        const hours = date.getHours() % 12;
        const minutes = date.getMinutes();
    
        const HH = hours < 10 ? `0${hours}` : `${hours}`;
        const MM = minutes < 10 ? `0${minutes}` : `${minutes}`;
    
        return `${HH}:${MM} ${meridiem}`;
    },
    dateString: (item: TelenotesManifest) => {
        const date = item.time.created;
        return date.toLocaleDateString();
    },
    avatar: (item: TelenotesManifest) => {
        return mediaDestinations.user.telenotes.avatar.default;
    },
};
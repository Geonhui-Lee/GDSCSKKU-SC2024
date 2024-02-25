export function getRelativeTimeString(date: Date): string {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (diffDays === 0) {
        const diffHours = Math.floor(diff / (1000 * 60 * 60));
        if (diffHours === 0) {
            // get minutes
            const diffMinutes = Math.floor(diff / (1000 * 60));
            if (diffMinutes === 0) {
                return "just now";
            }
            else {
                return `${diffMinutes} minutes ago`;
            }
        }
        else {
            return `${diffHours} hours ago`;
        }
    }
    else if (diffDays === 1) {
        return "yesterday";
    }
    else {
        return `${diffDays} days ago`;
    }

}
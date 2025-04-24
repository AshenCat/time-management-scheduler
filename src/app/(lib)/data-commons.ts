import { INTERVAL } from "../(db)/common"

export const transformInterval = (value: number, fromInterval: (typeof INTERVAL)[number], toInterval: (typeof INTERVAL)[number]) => {
    if (fromInterval === toInterval) {
        return value;
    }

    if (fromInterval === "weekly" && toInterval === "bi-weekly") return value * 2;
    if (fromInterval === "weekly" && toInterval === "monthly") return value * 4;
    if (fromInterval === "weekly" && toInterval === "quarterly") return value * 16;
    if (fromInterval === "weekly" && toInterval === "bi-yearly") return value * 24;
    if (fromInterval === "weekly" && toInterval === "yearly") return value * 52;

    if (fromInterval === "bi-weekly" && toInterval === "weekly") return value / 2;
    if (fromInterval === "bi-weekly" && toInterval === "monthly") return value * 2;
    if (fromInterval === "bi-weekly" && toInterval === "quarterly") return value * 8;
    if (fromInterval === "bi-weekly" && toInterval === "bi-yearly") return value * 12;
    if (fromInterval === "bi-weekly" && toInterval === "yearly") return value * 24;

    if (fromInterval === "monthly" && toInterval === "weekly") return value / 4;
    if (fromInterval === "monthly" && toInterval === "bi-weekly") return value / 2;
    if (fromInterval === "monthly" && toInterval === "quarterly") return value * 4;
    if (fromInterval === "monthly" && toInterval === "bi-yearly") return value * 6;
    if (fromInterval === "monthly" && toInterval === "yearly") return value * 12;

    if (fromInterval === "quarterly" && toInterval === "weekly") return value / 16;
    if (fromInterval === "quarterly" && toInterval === "bi-weekly") return value / 8;
    if (fromInterval === "quarterly" && toInterval === "monthly") return value / 4;
    if (fromInterval === "quarterly" && toInterval === "bi-yearly") return value * 2;
    if (fromInterval === "quarterly" && toInterval === "yearly") return value * 4;

    if (fromInterval === "bi-yearly" && toInterval === "weekly") return value / 24;
    if (fromInterval === "bi-yearly" && toInterval === "bi-weekly") return value / 12;
    if (fromInterval === "bi-yearly" && toInterval === "monthly") return value / 6;
    if (fromInterval === "bi-yearly" && toInterval === "quarterly") return (value * 2)/4; // My brain isn't braining
    if (fromInterval === "bi-yearly" && toInterval === "yearly") return value * 2;

    if (fromInterval === "yearly" && toInterval === "weekly") return value / 48;
    if (fromInterval === "yearly" && toInterval === "bi-weekly") return value / 24;
    if (fromInterval === "yearly" && toInterval === "monthly") return value / 12;
    if (fromInterval === "yearly" && toInterval === "quarterly") return value / 4;
    if (fromInterval === "yearly" && toInterval === "bi-yearly") return value / 2;

    return -1;
}
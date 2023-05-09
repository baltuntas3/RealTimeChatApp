function formatDate(olderDate, currentDate = Date.now()) {
    const DAY_MILLISECONDS = 1000 * 60 * 60 * 24;
    olderDate = new Date(olderDate);

    const diff = olderDate - currentDate;
    // get locale from local storage

    const formatter = new Intl.RelativeTimeFormat("tr", { numeric: "auto" });
    return formatter.format(Math.round(diff / DAY_MILLISECONDS), "day");
}

export { formatDate };

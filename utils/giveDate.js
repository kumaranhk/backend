const giveDate = () => {
    const now = new Date();
    const yearLocal = now.getFullYear();
    const monthLocal = String(now.getMonth() + 1).padStart(2, '0');
    const dayLocal = String(now.getDate()).padStart(2, '0');
    const hoursLocal = String(now.getHours()).padStart(2, '0');
    const minutesLocal = String(now.getMinutes()).padStart(2, '0');
    const secondsLocal = String(now.getSeconds()).padStart(2, '0');

    const timeStamp = `${yearLocal}-${monthLocal}-${dayLocal} ${hoursLocal}:${minutesLocal}:${secondsLocal}`;
    return timeStamp;
}

export { giveDate };
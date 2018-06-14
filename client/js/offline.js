const OffineMessages = {
    add: text => {
        let current = localStorage.getItem('offlineMessages') || '';
        current += ('!:!' + text);
        localStorage.setItem('offlineMessages', current);
    },
    get: () => {
        let current = localStorage.getItem('offlineMessages') || '';
        return current.split('!:!').filter(e => e);
    },
    clear: () => {
        localStorage.removeItem('offlineMessages');
    }
};
module.exports = class BookRentStatus {
    constructor(id) {
        if(id === 0)
            this.status = "Rented"
        else if(id === 1)
            this.status = "Returned"
        else if(id === 2)
            this.status = "Late"
        else if(id === 3)
            this.status = "Returned Late"
    }
};

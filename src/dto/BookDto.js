module.exports = class BookDto {
    static toDto(book, publisher) {
        return {
            author: book.author,
            title: book.title,
            publishedDate: book.publishedDate,
            availableStock: book.availableStock,
            publisher: publisher,
            createdAt: book.createdAt,
            updateAt: book.updateAt,
        };
    }
};

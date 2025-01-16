export class BookValidator {
    static validateTitle(title) {
        if (!title) {
            alert('Please fill the title of the book');
            return false;
        }
        return true;
    }
    static validateAuthor(author) {
        if (!author) {
            alert('Please enter the author name');
            return false;
        }
        return true;
    }
    static validateGenre(genre, customGenre) {
        if (!genre) {
            alert('Please select a genre');
            return false;
        }
        if (genre === "other" && !customGenre) {
            alert('Please enter a custom genre');
            return false;
        }
        return true;
    }
    static validateDate(date) {
        let today = new Date();
        let currentDate = today.getDate();
        let currentMonth = today.getMonth() + 1;
        let currentYear = today.getFullYear();
        let pubYear = date.substring(0, 4);
        let pubMonth = date.substring(5, 7);
        let pubDay = date.substring(8, 10);
        if (currentYear < parseInt(pubYear)) {
            alert('Please enter the correct date');
            return false;
        }
        if (currentYear === parseInt(pubYear) && currentMonth < parseInt(pubMonth)) {
            alert('Please enter the correct date');
            return false;
        }
        if (currentYear === parseInt(pubYear) && currentMonth === parseInt(pubMonth) && currentDate < parseInt(pubDay)) {
            alert('Please enter the correct date');
            return false;
        }
        return true;
    }
    static validateISBN(isbn) {
        if (isNaN(Number(isbn)) || isbn.length !== 13) {
            alert('Please enter a valid ISBN-13 number');
            return false;
        }
        return true;
    }
}

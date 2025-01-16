import { BookValidator } from "./validation.js";
export class BookManager {
    constructor() {
        this.books = []; // Initialize book array
        this.standardGenre = ["fiction", "non-fiction", "biography", "history",
            "politics", "science", "novel"];
        // If the user selects a particular genre, "select genre" option is hidden
        this.removeDefault = () => {
            let genreOption = document.getElementById('genre');
            let selectedGenre = genreOption.value;
            // To hide the option "select genre" if the user selects genre
            if (selectedGenre !== "") {
                genreOption.querySelector("option[value='']").style.display = "none";
            }
            else {
                genreOption.querySelector("option[value='']").style.display = "block";
            }
            // To create a new input if the user wants to write a custom genre
            if (selectedGenre === "other") {
                if (!document.getElementById('custom-genre-input')) {
                    var customGenreInput = document.createElement('input');
                    customGenreInput.setAttribute('type', 'text');
                    customGenreInput.setAttribute('id', 'custom-genre');
                    customGenreInput.setAttribute('placeholder', 'Enter your custom genre');
                    customGenreInput.setAttribute('class', 'w-full mt-3 p-2 border border-gray-300 rounded-md');
                    genreOption.insertAdjacentElement('afterend', customGenreInput);
                }
            }
            else {
                var customGenreInput = document.getElementById('custom-genre');
                if (customGenreInput) {
                    customGenreInput.remove();
                }
            }
        };
        // Validate the input values
        this.validate = (e) => {
            e.preventDefault();
            let title = document.getElementById('title').value;
            let author = document.getElementById('author').value;
            let genre = document.getElementById('genre').value;
            let isbn = document.getElementById('isbn').value;
            let date = document.getElementById('date').value;
            let form = document.getElementById('form');
            let customGenreInput = document.getElementById('custom-genre');
            if (!BookValidator.validateTitle(title))
                return false;
            if (!BookValidator.validateAuthor(author))
                return false;
            if (!BookValidator.validateGenre(genre, customGenreInput === null || customGenreInput === void 0 ? void 0 : customGenreInput.value))
                return false;
            if (!BookValidator.validateDate(date))
                return false;
            if (!BookValidator.validateISBN(isbn))
                return false;
            if (genre === "other") {
                genre = customGenreInput === null || customGenreInput === void 0 ? void 0 : customGenreInput.value;
            }
            this.books.push({ title, author, isbn, genre, date });
            // When the user clicks on add button, the book form is automatically reset 
            form.reset();
            // Custom genre input is hidden when the user clicks on the add button because the user enters the details again
            if (customGenreInput) {
                customGenreInput.remove();
            }
            this.updateBook(this.books);
            alert('Book added successfully');
            return true;
        };
        // Adding a new book
        this.updateBook = (books) => {
            const bTBody = document.getElementById('bookTable').querySelector('tbody');
            bTBody.innerHTML = '';
            books.forEach((book, i) => {
                // Create a new row for each book in the array
                const row = document.createElement('tr');
                // Create cells for each book property and append them to the row
                const titleCell = document.createElement('td');
                titleCell.setAttribute('class', 'border border-black');
                titleCell.textContent = book.title;
                row.appendChild(titleCell);
                const authorCell = document.createElement('td');
                authorCell.setAttribute('class', 'border border-black');
                authorCell.textContent = book.author;
                row.appendChild(authorCell);
                const isbnCell = document.createElement('td');
                isbnCell.setAttribute('class', 'border border-black');
                isbnCell.textContent = book.isbn;
                row.appendChild(isbnCell);
                const dateCell = document.createElement('td');
                dateCell.setAttribute('class', 'border border-black');
                dateCell.textContent = book.date;
                row.appendChild(dateCell);
                const ageCell = document.createElement('td');
                ageCell.setAttribute('class', 'border border-black');
                ageCell.textContent = this.calculateAge(book.date);
                row.appendChild(ageCell);
                const price = document.createElement('td');
                price.setAttribute('class', 'border border-black font-medium');
                price.innerHTML = this.discountCalculation(book.price, book.discountPrice);
                row.appendChild(price);
                const genreCell = document.createElement('td');
                genreCell.setAttribute('class', 'border border-black');
                genreCell.textContent = book.genre;
                row.appendChild(genreCell);
                const actionCell = document.createElement('td');
                actionCell.setAttribute('class', 'border border-black');
                const editButton = document.createElement('button');
                editButton.setAttribute('class', 'border p-1 text-white bg-green-700 hover:bg-green-300 hover:text-black');
                editButton.textContent = 'Edit';
                actionCell.appendChild(editButton);
                const deleteButton = document.createElement('button');
                deleteButton.setAttribute('class', 'border p-1 text-white bg-red-700 hover:bg-red-300 hover:text-black');
                deleteButton.textContent = 'Delete';
                actionCell.appendChild(deleteButton);
                row.appendChild(actionCell);
                // Add row to table body
                bTBody.appendChild(row);
                // Add event listeners for edit and delete buttons
                editButton.addEventListener('click', () => this.editBook(books, i));
                deleteButton.addEventListener('click', () => this.deleteBook(books, i));
            });
        };
        // Edit a book
        this.editBook = (books, i) => {
            const book = books[i];
            document.getElementById('title').value = book.title;
            document.getElementById('author').value = book.author;
            if (!this.standardGenre.includes(book.genre))
                document.getElementById('genre').value = "other";
            else
                document.getElementById('genre').value = book.genre;
            document.getElementById('isbn').value = book.isbn;
            document.getElementById('date').value = book.date;
            // Remove the book from array
            books.splice(i, 1);
            // Add a new book with changed details
            this.updateBook(books);
        };
        // Delete a book
        this.deleteBook = (books, i) => {
            books.splice(i, 1);
            this.updateBook(books);
            alert('Book deleted successfully');
        };
        // Calculate the age of the book
        this.calculateAge = (date) => {
            let pubYear = date.substring(0, 4);
            let pubMonth = date.substring(5, 7);
            let pubDay = date.substring(8, 10);
            let today = new Date();
            let currentDate = today.getDate();
            let currentMonth = today.getMonth() + 1;
            let currentYear = today.getFullYear();
            if (currentYear - parseInt(pubYear) > 0) {
                return `${currentYear - parseInt(pubYear)} years ago`;
            }
            else if (currentMonth - parseInt(pubMonth) > 0) {
                return `${currentMonth - parseInt(pubMonth)} months ago`;
            }
            else {
                return `${currentDate - parseInt(pubDay)} days ago`;
            }
        };
        //display the books based on the genre filter
        this.filterGenre = () => {
            let choosenGenre = document.getElementById("genreFilter").value;
            let selectedGenre;
            if (choosenGenre == "other")
                selectedGenre = this.books.filter(book => !this.standardGenre.includes(book.genre));
            else
                selectedGenre = choosenGenre ? this.books.filter(book => book.genre === choosenGenre) : this.books;
            this.updateBook(selectedGenre);
        };
        //sort the books by ascending or descending order based on title
        this.sortByTitle = () => {
            const sortBy = document.getElementById('sort').value;
            if (sortBy == 'asc') {
                const filterData = this.books.sort((a, b) => a.title.localeCompare(b.title));
                this.updateBook(filterData);
            }
            else if (sortBy == 'desc') {
                const filterData = this.books.sort((a, b) => b.title.localeCompare(a.title));
                this.updateBook(filterData);
            }
            else
                this.updateBook(this.books);
        };
        // Discount calculation
        this.discountCalculation = (actualP, discountP) => {
            // If both prices are undefined, set them to 0
            if (actualP === undefined && discountP === undefined) {
                actualP = 0;
                discountP = 0;
            }
            // If only one price is provided, use 0 for the other
            actualP = actualP !== null && actualP !== void 0 ? actualP : 0;
            discountP = discountP !== null && discountP !== void 0 ? discountP : 0;
            // Calculate the discount percentage
            const percentage = (discountP / actualP) * 100;
            const discountPercentage = 100 - percentage;
            // If the prices are different, show the actual price with strikethrough and the discounted price
            if (actualP !== discountP) {
                return `
                <span class="line-through text-blue-600 font-semibold">${actualP.toFixed()} rs/- </span>
                <span class="font-medium text-red-600">(${discountPercentage.toFixed()}% off)</span>
                <span class="font-bold text-green-600">${discountP.toFixed()} rs/-</span>
            `;
            }
            else {
                // If the prices are the same, show the actual price as the final price
                return `<span class="text-green-600 font-bold">${actualP.toFixed()} rs/- </span>`;
            }
        };
    }
}

interface Book {
    title: string;
    author: string;
    isbn: string;
    genre: string;
    date: string;
    price?: number;
    discountPrice?: number;
}

class BookManager<T extends Book> {
    books: T[] = [];  // Initialize book array
    standardGenre: string[] = ["fiction", "non-fiction", "biography", "autobiography", "history",
        "politics", "science", "narrative", "novel"];

    constructor() {}

    // If the user selects a particular genre, "select genre" option is hidden
    removeDefault = (): void => {
        let genreOption = document.getElementById('genre') as HTMLSelectElement;
        let selectedGenre = genreOption.value;

        // To hide the option "select genre" if the user selects genre
        if (selectedGenre !== "") {
            (genreOption.querySelector("option[value='']") as HTMLElement).style.display = "none";
        } else {
            (genreOption.querySelector("option[value='']") as HTMLElement).style.display = "block";
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
        } else {
            var customGenreInput = document.getElementById('custom-genre') as HTMLInputElement;
            if (customGenreInput) {
                customGenreInput.remove();
            }
        }
    }

    // Validate the input values
    validate = (e: Event): boolean => {
        e.preventDefault();

        let title = (document.getElementById('title') as HTMLInputElement).value;
        let author = (document.getElementById('author') as HTMLInputElement).value;
        let genre = (document.getElementById('genre') as HTMLSelectElement).value;
        let isbn = (document.getElementById('isbn') as HTMLInputElement).value;
        let date = (document.getElementById('date') as HTMLInputElement).value;
        let form = document.getElementById('form') as HTMLFormElement;

        let today = new Date();
        let currentDate = today.getDate();
        let currentMonth = today.getMonth() + 1;
        let currentYear = today.getFullYear();

        let pubYear = date.substring(0, 4);
        let pubMonth = date.substring(5, 7);
        let pubDay = date.substring(8, 10);

        if (!title) {
            alert('Please fill the title of the book');
            return false;
        }
        if (!author) {
            alert('Please enter the author name');
            return false;
        }
        if (!genre) {
            alert('Please select a genre');
            return false;
        }
        if (!date) {
            alert('Please fill the publication date');
            return false;
        }

        // Check if the entered date is valid
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

        if (isNaN(Number(isbn)) || isbn.length !== 13) {
            alert('Please enter a valid ISBN-13 number');
            return false;
        }

        if (genre === "other" && (document.getElementById('custom-genre') as HTMLInputElement).value === "") {
            alert('Please enter a custom genre');
            return false;
        }
        if (genre === "other") {
            genre = (document.getElementById('custom-genre') as HTMLInputElement).value;
        }

        this.books.push({ title, author, isbn, genre, date } as T);

        // When the user clicks on add button, the book form is automatically reset 
        form.reset();

        // Custom genre input is hidden when the user clicks on the add button because the user enters the details again
        var customGenreInput = document.getElementById('custom-genre');
        if (customGenreInput) {
            customGenreInput.remove();
        }

        this.updateBook(this.books);
        alert('Book added successfully');
        return true;
    }

    // Adding a new book
    updateBook = (books: T[]): void => {
        const bTBody = document.getElementById('bookTable')!.querySelector('tbody')!;
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
            }
        );
    }

    // Edit a book
    editBook = (books: T[], i: number): void => {
        const book = books[i];

        (document.getElementById('title') as HTMLInputElement).value = book.title;
        (document.getElementById('author') as HTMLInputElement).value = book.author;

        if (!this.standardGenre.includes(book.genre))
            (document.getElementById('genre') as HTMLSelectElement).value = "other";
        else
            (document.getElementById('genre') as HTMLSelectElement).value = book.genre;

        (document.getElementById('isbn') as HTMLInputElement).value = book.isbn;
        (document.getElementById('date') as HTMLInputElement).value = book.date;

        // Remove the book from array
        books.splice(i, 1);

        // Add a new book with changed details
        this.updateBook(books);
    }

    // Delete a book
    deleteBook = (books: T[], i: number): void => {
        books.splice(i, 1);

        this.updateBook(books);
        alert('Book deleted successfully');
    }

    // Calculate the age of the book
    calculateAge = (date: string): string => {
        let pubYear = date.substring(0, 4);
        let pubMonth = date.substring(5, 7);
        let pubDay = date.substring(8, 10);

        let today = new Date();
        let currentDate = today.getDate();
        let currentMonth = today.getMonth() + 1;
        let currentYear = today.getFullYear();

        if (currentYear - parseInt(pubYear) > 0) {
            return `${currentYear - parseInt(pubYear)} years ago`;
        } else if (currentMonth - parseInt(pubMonth) > 0) {
            return `${currentMonth - parseInt(pubMonth)} months ago`;
        } else{
            return `${currentDate - parseInt(pubDay)} days ago`;
        }
    }

    //display the books based on the genre filter
    filterGenre=():void=>{
        let choosenGenre=(document.getElementById("genreFilter") as HTMLSelectElement).value;
        let selectedGenre;
        if(choosenGenre=="other")
            selectedGenre=this.books.filter(book=>!this.standardGenre.includes(book.genre));
        else
            selectedGenre=choosenGenre ? this.books.filter(book=>book.genre===choosenGenre) : this.books;
        
        this.updateBook(selectedGenre);
    }

    //sort the books by ascending or descending order based on title
    sortByTitle=():void=>{
        const sortBy=(document.getElementById('sort') as HTMLSelectElement).value;
        if(sortBy=='asc'){
            const filterData=this.books.sort((a,b)=>a.title.localeCompare(b.title));
            this.updateBook(filterData);
        }
        else if(sortBy=='desc'){
            const filterData=this.books.sort((a,b)=>b.title.localeCompare(a.title));
            this.updateBook(filterData);
        }
        else
        this.updateBook(this.books);
    }

    // Discount calculation
    discountCalculation = (actualP: number | undefined, discountP: number | undefined): string => {
        // If both prices are undefined, set them to 0
        if (actualP === undefined && discountP === undefined) {
            actualP = 0;
            discountP = 0;
        }
    
        // If only one price is provided, use 0 for the other
        actualP = actualP ?? 0;
        discountP = discountP ?? 0;
    
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
        } else {
            // If the prices are the same, show the actual price as the final price
            return `<span class="text-green-600 font-bold">${actualP.toFixed()} rs/- </span>`;
        }
    }    
}

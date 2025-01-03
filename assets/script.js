class BookManager{
    constructor(){
        this.books=[];   //initialize book array
        this.standardGenre=["fiction", "non-fiction", "biography", "autobiography", "history"
    ,"politics","science","narrative","novel"];
    }

    //if user selects particular genre "select genre" option is hidden
    removeDefault=()=>{
        let genreOption=document.getElementById('genre');
        let selectedGenre=genreOption.value;
    
        //to hide the option "select genre" if user selects genre
        if(selectedGenre!==""){
            genreOption.querySelector("option[value='']").style.display="none";
        }
        else{
            genreOption.querySelector("option[value='']").style.display="block";
        }
    
        //to create a new input if user wants to write custom genre
        if (selectedGenre === "other") {
            if (!document.getElementById('custom-genre-input')) {
                var customGenreInput = document.createElement('input');
                customGenreInput.setAttribute('type', 'text');
                customGenreInput.setAttribute('id', 'custom-genre');
                customGenreInput.setAttribute('placeholder', 'Enter your custom genre');
                customGenreInput.setAttribute('class','w-full mt-3 p-2 border border-gray-300 rounded-md');
    
                genreOption.insertAdjacentElement('afterend',customGenreInput);
            }
        } else {
            var customGenreInput = document.getElementById('custom-genre');
            if (customGenreInput) {
                customGenreInput.remove();
            }
        }
    }

    //validate the input values
    validate=(e)=>{
        e.preventDefault();
    
        let title=document.getElementById('title').value;
        let author=document.getElementById('author').value;
        let genre=document.getElementById('genre').value;
        let isbn=document.getElementById('isbn').value;
        let date=document.getElementById('date').value;
        let form=document.getElementById('form');
    
        let today = new Date();
        let currentDate = today.getDate();
        let currentMonth = today.getMonth()+1;
        let currentYear = today.getFullYear();
    
        let pubYear=date.substring(0,4);
        let pubMonth=date.substring(5,7);
        let pubDay=date.substring(8,10);
    
    
        if(!title){
            alert('Please fill the title of book');
            return false;
        }
        if(!author){
            alert('Please enter the author name');
            return false;
        }
        if(!genre){
            alert('Please select a genre');
            return false;
        }
        if(!date){
            alert('Please fill the publication date');
            return false;
        }
    
        //check if the entered date is valid
        if(currentYear < pubYear){
            alert('Please enter the correct date');
            return false;
        }
        if(currentYear==pubYear && currentMonth < pubMonth){
            alert('Please enter the correct date');
            return false;
        }
        if(currentYear==pubYear && currentMonth==pubMonth && currentDate < pubDay){
            alert('Please enter the correct date');
            return false;
        }
    
        if(isNaN(isbn) || isbn.length!==13){
            alert('Please enter a valid ISBN-13 number');
            return false;
        }
    
        if(genre==="other" && document.getElementById('custom-genre').value===""){
            alert('Please enter a custom genre');
            return false;
        }
        if(genre==="other")
            genre=document.getElementById('custom-genre').value;
    
        this.books.push({title, author,isbn,genre,date});
    
        //when user clicks on add button book form is automatically reset 
        form.reset();
    
        // cutome genre input is hide when user clicks on add button because new user enters the details again
        var customGenreInput = document.getElementById('custom-genre');
        if (customGenreInput) {
            customGenreInput.remove();
        }
    
        this.updateBook(this.books);
        alert('Book added successfully');
    }

    //adding a new book
    updateBook=(books)=>{
        const bTBody = document.getElementById('bookTable').querySelector('tbody');
        bTBody.innerHTML='';
    
        books.forEach((book,i) => {
            //create a new row for each book in the array
            const row=document.createElement('tr');
    
            //create cells for each book property and append them to the row
            const titleCell = document.createElement('td');
            titleCell.setAttribute('class','border border-black');
            titleCell.textContent = book.title;
            row.appendChild(titleCell);
    
            const authorCell = document.createElement('td');
            authorCell.setAttribute('class','border border-black');
            authorCell.textContent = book.author;
            row.appendChild(authorCell);
    
            const isbnCell = document.createElement('td');
            isbnCell.setAttribute('class','border border-black');
            isbnCell.textContent = book.isbn;
            row.appendChild(isbnCell);
    
            const dateCell = document.createElement('td');
            dateCell.setAttribute('class','border border-black');
            dateCell.textContent = book.date;
            row.appendChild(dateCell);
    
            const ageCell = document.createElement('td');
            ageCell.setAttribute('class','border border-black');
            ageCell.textContent = this.calculateAge(book.date);
            row.appendChild(ageCell);
    
            const genreCell = document.createElement('td');
            genreCell.setAttribute('class','border border-black');
            genreCell.textContent = book.genre;
            row.appendChild(genreCell);
    
    
            const actionCell = document.createElement('td');
            actionCell.setAttribute('class','border border-black');
    
            const editButton = document.createElement('button');
            editButton.setAttribute('class','border p-1 text-white bg-green-700 hover:bg-green-300 hover:text-black');
            editButton.textContent = 'Edit';
            actionCell.appendChild(editButton);
    
            const deleteButton = document.createElement('button');
            deleteButton.setAttribute('class','border p-1 text-white bg-red-700 hover:bg-red-300 hover:text-black');
            deleteButton.textContent = 'Delete';
            actionCell.appendChild(deleteButton);
    
            row.appendChild(actionCell);
    
            //add row to table body
            bTBody.appendChild(row);
    
            //add event listeners for edit and delete buttons
            editButton.addEventListener('click', () => this.editBook(books,i));
            deleteButton.addEventListener('click', () => this.deleteBook(books,i));
        });
    }

    //edit a book
    editBook=(books,i)=>{
        const book=books[i];
        
        document.getElementById('title').value=book.title;
        document.getElementById('author').value=book.author;
    
        if(!this.standardGenre.includes(book.genre))
            document.getElementById('genre').value="other";
        else
            document.getElementById('genre').value=book.genre;
    
        document.getElementById('isbn').value=book.isbn;
        document.getElementById('date').value=book.date;
    
        //remove the book from array 
        books.splice(i,1);
    
        //add a new book with changing the details
        this.updateBook(books);
    }

    //delete a book
    deleteBook=(books,i)=>{
        books.splice(i,1);
    
        this.updateBook(books);
        alert('Book deleted successfully');
    }

    //calculate the age of the book
    calculateAge=(date)=>{
        let pubYear=date.substring(0,4);
        let pubMonth=date.substring(5,7);
        let pubDay=date.substring(8,10);
    
        let today = new Date();
        let currentDate = today.getDate();
        let currentMonth = today.getMonth()+1;
        let currentYear = today.getFullYear();
    
        if(currentYear-pubYear > 0){
            return currentYear-pubYear + " years ago";  
        }
        else if(currentMonth-pubMonth > 0){
            return currentMonth-pubMonth + " months ago";
        }
        else{
            return currentDate-pubDay + " days ago";
        }
    }

    //display the books based on the genre filter
    filterGenre=()=>{
        let choosenGenre=document.getElementById("genreFilter").value;
        let selectedGenre;
        if(choosenGenre=="other")
            selectedGenre=this.books.filter(book=>!this.standardGenre.includes(book.genre));
        else
            selectedGenre=choosenGenre ? this.books.filter(book=>book.genre===choosenGenre) : this.books;
        
        this.updateBook(selectedGenre);
    }

    //sort the books by ascending or descending order based on title
    sortByTitle=()=>{
        const sortBy=document.getElementById('sort').value;
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
}

//creating an instance of the BookManager class
const bookmanager=new BookManager();
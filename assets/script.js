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

            var form = document.querySelector('form');
            form.insertBefore(customGenreInput, form.querySelector('button'));
        }
    } else {
        var customGenreInput = document.getElementById('custom-genre');
        if (customGenreInput) {
            customGenreInput.remove();
        }
    }
}

let books=[];      //initialize book array
validate=(e)=>{
    e.preventDefault();

    let title=document.getElementById('title').value;
    let author=document.getElementById('author').value;
    let genre=document.getElementById('genre').value;
    let isbn=document.getElementById('isbn').value;
    let date=document.getElementById('date').value;
    let form=document.getElementById('form');

    if(!title || !author || !genre || !date){
        alert('Please fill all the details');
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

    books.push({title, author,isbn,genre,date});

    //when user clicks on add button book form is automatically reset 
    form.reset();

    updateBook();
    alert('Book added successfully');
}

//adding a new book
updateBook=()=>{
    const bTBody = document.getElementById('bookTable').querySelector('tbody');
    bTBody.innerHTML='';

    books.forEach((book,i) => {
        //create a new row for each book in the array
        const row=document.createElement('tr');
        
        //create cells for each book property and append them to the row
        const titleCell = document.createElement('td');
        titleCell.textContent = book.title;
        row.appendChild(titleCell);

        const authorCell = document.createElement('td');
        authorCell.textContent = book.author;
        row.appendChild(authorCell);

        const isbnCell = document.createElement('td');
        isbnCell.textContent = book.isbn;
        row.appendChild(isbnCell);

        const dateCell = document.createElement('td');
        dateCell.textContent = book.date;
        row.appendChild(dateCell);

        const ageCell = document.createElement('td');
        ageCell.textContent = calculateAge(book.date);
        row.appendChild(ageCell);

        const genreCell = document.createElement('td');
        genreCell.textContent = book.genre;
        row.appendChild(genreCell);


        const actionCell = document.createElement('td');

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        actionCell.appendChild(editButton);

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        actionCell.appendChild(deleteButton);

        row.appendChild(actionCell);

        //add row to table body
        bTBody.appendChild(row);

        //add event listeners for edit and delete buttons
        editButton.addEventListener('click', () => editBook(i));
        deleteButton.addEventListener('click', () => deleteBook(i));
    });
}

//edit a book
editBook=(i)=>{
    book=books[i];
    
    document.getElementById('title').value=book.title;
    document.getElementById('author').value=book.author;
    document.getElementById('genre').value=book.genre;
    document.getElementById('isbn').value=book.isbn;
    document.getElementById('date').value=book.date;

    //remove the book from array 
    books.splice(i,1);

    //add a new book with changing the details
    updateBook();
}

//delete a book
deleteBook=(i)=>{
    books.splice(i,1);

    updateBook();
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
    else if(currentDate-pubDay > 0){
        return currentDate-pubDay + " days ago";
    }
    else
    return "Less than a day";
}
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
}

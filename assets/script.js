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



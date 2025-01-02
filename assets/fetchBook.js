const url="https://www.googleapis.com/books/v1/volumes?q=";

//immediately invoked function expression 
(async()=>{
    fetch(`${url}genre`)
    .then(res=>res.json())
    .then(data=>{
        const correctData=transformData(data.items);
        if(correctData){
            books=correctData;            
            localStorage.setItem('data',JSON.stringify(correctData));
            updateBook(books);
        }
    })
    .catch(err=>console.error(err));
})();

//validate the data is fetching correctly and map the fetching data to our fields
transformData=(apiData)=>{
    return apiData.filter(
        (data)=>
        data.volumeInfo.title && 
        data.volumeInfo.authors && 
        data.volumeInfo.categories && 
        data.volumeInfo.industryIdentifiers &&
        data.volumeInfo.publishedDate
        
    ).map(
        (data)=>({
            title:data.volumeInfo.title,
            author:data.volumeInfo.authors[0],
            genre:data.volumeInfo.categories[0].toLowerCase(),
            isbn:data.volumeInfo.industryIdentifiers[0].identifier,
            date:data.volumeInfo.publishedDate
        })
    )
}

//search the book based on title
searchBook=async()=>{
    const searchValue=document.getElementById('search').value.toLowerCase();
    
    //if search input is empty show all the books
    if(searchValue===''){
        updateBook(books);
    }
    else{
        try {
            const res=await fetch(`${url}title:${searchValue}`)
            const data=await res.json();
            if(res.ok){
                //filter the date that includes particular title
                const filterData=data.items.filter(d=>{
                    return d.volumeInfo.title.toLowerCase().includes(searchValue);
                })
                const correctData=transformData(filterData);

                //if there is no book on particular title, show all the books
                if(correctData.length<=0){
                    alert('No Book found');
                    updateBook(books);
                }
                //else show tha filtered book
                else{
                    updateBook(correctData);
                }
            }
            else{
                alert('No Book found');
                updateBook(books);
            }
        } catch (error) {
            console.log('Error',error);
        }
    }
}
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
transformData=(apiData)=>{
    console.log("Books from fetch",apiData);

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

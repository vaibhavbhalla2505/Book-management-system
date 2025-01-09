class APIBookManager extends BookManager {
    private url: string;

    constructor() {
        super();
        this.url = "https://www.googleapis.com/books/v1/volumes?q=genre:fiction+biography+history+novel";
    }

    // Fetch books from the API
    async fetchBooks(): Promise<void> {
        try {
            const res = await fetch(this.url);
            const data = await res.json();
            const correctData = this.transformData(data.items);
            if (correctData) {
                this.books = correctData;
                this.updateBook(this.books);
            }
        } catch (err) {
            console.error('Error fetching books:', err);
        }
    }

    // Transform API data to match our internal data format
    transformData(apiData: any[]): Book[] {
        return apiData
            .filter(data =>
                data.volumeInfo.title &&
                data.volumeInfo.authors &&
                data.volumeInfo.categories &&
                data.volumeInfo.industryIdentifiers &&
                data.saleInfo.listPrice?.amount &&
                data.saleInfo?.retailPrice?.amount &&
                data.volumeInfo.industryIdentifiers[0].identifier.length === 13 &&
                data.volumeInfo.publishedDate
            )
            .map(data => ({
                title: data.volumeInfo.title,
                author: data.volumeInfo.authors[0],
                genre: data.volumeInfo.categories[0].toLowerCase(),
                isbn: data.volumeInfo.industryIdentifiers[0].identifier,
                date: data.volumeInfo.publishedDate,
                price: data.saleInfo.listPrice.amount,
                discountPrice: data.saleInfo.retailPrice.amount,
            }));
    }

    // Search books by title
    async searchBook(): Promise<void> {
        const searchValue = (document.getElementById('search') as HTMLInputElement).value.toLowerCase();
    
        // Show all books when no search value
        if (searchValue === '') {
            this.updateBook(this.books); 
        } else {
            const filterData = this.books.filter(book => book.title.toLowerCase().includes(searchValue));
            
            if (filterData.length <= 0) {
                alert('No Book found');
                this.updateBook(this.books);  
            } else {
                this.updateBook(filterData); 
            }
        }
    }
}

// Creating an instance of the APIBookManager class
const apiBookManager = new APIBookManager();

document.getElementById('genre')?.addEventListener('change', () => apiBookManager.removeDefault());
document.getElementById('form')?.addEventListener('submit', (e) => apiBookManager.validate(e));
document.getElementById('genreFilter')?.addEventListener('change', () => apiBookManager.filterGenre());
document.getElementById('sort')?.addEventListener('change', () => apiBookManager.sortByTitle());
document.getElementById('searchButton')?.addEventListener('click', () => apiBookManager.searchBook());

// Fetch books when the page loads
window.addEventListener('load', () => apiBookManager.fetchBooks());

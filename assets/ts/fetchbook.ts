import {BookManager} from "./script"
interface Book {
    title: string;
    author: string;
    isbn: string;
    genre: string;
    date: string;
    price?: number;
    discountPrice?: number;
}
class APIBookManager<T extends Book> {
    private url: string;
    private bookmanager: BookManager<T>;

    constructor() {
        // super();
        this.bookmanager=new BookManager();
        this.url = "https://www.googleapis.com/books/v1/volumes?q=genre:fiction+biography+history+novel";
    }

    public removeDefault(): void {
        this.bookmanager.removeDefault();
    }

    // to call validate from BookManager
    public validate(e: Event): boolean {
        return this.bookmanager.validate(e);
    }

    public filterGenre(): void {
        this.bookmanager.filterGenre();
    }

    public sortByTitle(): void {
        this.bookmanager.sortByTitle();
    }

    // Fetch books from the API
    async fetchBooks(): Promise<void> {
        try {
            const res = await fetch(this.url);
            const data = await res.json();
            const correctData = this.transformData(data.items);
            if (correctData) {
                this.bookmanager.books = correctData;
                this.bookmanager.updateBook(this.bookmanager.books);
            }
        } catch (err) {
            console.error('Error fetching books:', err);
        }
    }

    // Transform API data to match our internal data format
    transformData(apiData: any[]): T[] {
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
            }) as T);
    }

    // Search books by title
    async searchBook(): Promise<void> {
        const searchValue = (document.getElementById('search') as HTMLInputElement).value.toLowerCase();
    
        // Show all books when no search value
        if (searchValue === '') {
            this.bookmanager.updateBook(this.bookmanager.books); 
        } else {
            const filterData = this.bookmanager.books.filter(book => book.title.toLowerCase().includes(searchValue));
            
            if (filterData.length <= 0) {
                alert('No Book found');
                this.bookmanager.updateBook(this.bookmanager.books);  
            } else {
                this.bookmanager.updateBook(filterData); 
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
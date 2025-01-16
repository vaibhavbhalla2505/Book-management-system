var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var _a, _b, _c, _d, _e;
import { BookManager } from "./script.js";
class APIBookManager {
    constructor() {
        // super();
        this.bookmanager = new BookManager();
        this.url = "https://www.googleapis.com/books/v1/volumes?q=genre:fiction+biography+history+novel";
    }
    removeDefault() {
        this.bookmanager.removeDefault();
    }
    // Expose a method to call validate from BookManager
    validate(e) {
        return this.bookmanager.validate(e);
    }
    // Expose a method to call filterGenre from BookManager
    filterGenre() {
        this.bookmanager.filterGenre();
    }
    // Expose a method to call sortByTitle from BookManager
    sortByTitle() {
        this.bookmanager.sortByTitle();
    }
    // Fetch books from the API
    fetchBooks() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield fetch(this.url);
                const data = yield res.json();
                const correctData = this.transformData(data.items);
                if (correctData) {
                    this.bookmanager.books = correctData;
                    this.bookmanager.updateBook(this.bookmanager.books);
                }
            }
            catch (err) {
                console.error('Error fetching books:', err);
            }
        });
    }
    // Transform API data to match our internal data format
    transformData(apiData) {
        return apiData
            .filter(data => {
            var _a, _b, _c;
            return data.volumeInfo.title &&
                data.volumeInfo.authors &&
                data.volumeInfo.categories &&
                data.volumeInfo.industryIdentifiers &&
                ((_a = data.saleInfo.listPrice) === null || _a === void 0 ? void 0 : _a.amount) &&
                ((_c = (_b = data.saleInfo) === null || _b === void 0 ? void 0 : _b.retailPrice) === null || _c === void 0 ? void 0 : _c.amount) &&
                data.volumeInfo.industryIdentifiers[0].identifier.length === 13 &&
                data.volumeInfo.publishedDate;
        })
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
    searchBook() {
        return __awaiter(this, void 0, void 0, function* () {
            const searchValue = document.getElementById('search').value.toLowerCase();
            // Show all books when no search value
            if (searchValue === '') {
                this.bookmanager.updateBook(this.bookmanager.books);
            }
            else {
                const filterData = this.bookmanager.books.filter(book => book.title.toLowerCase().includes(searchValue));
                if (filterData.length <= 0) {
                    alert('No Book found');
                    this.bookmanager.updateBook(this.bookmanager.books);
                }
                else {
                    this.bookmanager.updateBook(filterData);
                }
            }
        });
    }
}
// Creating an instance of the APIBookManager class
const apiBookManager = new APIBookManager();
(_a = document.getElementById('genre')) === null || _a === void 0 ? void 0 : _a.addEventListener('change', () => apiBookManager.removeDefault());
(_b = document.getElementById('form')) === null || _b === void 0 ? void 0 : _b.addEventListener('submit', (e) => apiBookManager.validate(e));
(_c = document.getElementById('genreFilter')) === null || _c === void 0 ? void 0 : _c.addEventListener('change', () => apiBookManager.filterGenre());
(_d = document.getElementById('sort')) === null || _d === void 0 ? void 0 : _d.addEventListener('change', () => apiBookManager.sortByTitle());
(_e = document.getElementById('searchButton')) === null || _e === void 0 ? void 0 : _e.addEventListener('click', () => apiBookManager.searchBook());
// Fetch books when the page loads
window.addEventListener('load', () => apiBookManager.fetchBooks());

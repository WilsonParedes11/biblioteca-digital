import {Book, BookCategory } from '../types';
import { generateId } from '../utils/id.utils';

export class BookModel{
    private book: Book;

    constructor(
        title: string,
        author: string,
        isbn: string,
        category: BookCategory
    ){
        this.book = {
            id: generateId(),
            title,
            author,
            isbn,
            available:true,
            category
        }
    }

    getDetails():Book{
        return {...this.book};
    }

    setAvailability(available: boolean): void{
        this.book.available= available;
    }
}
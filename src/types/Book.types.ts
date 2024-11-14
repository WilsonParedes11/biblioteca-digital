export enum BookCategory {
    FICTION = 'Fiction',
    NON_FICTION = 'Non-Fiction',
    SCIENCE = 'Science',
    TECHNOLOGY = 'Technology',
}

export interface Book{
    id: string;
    title: string;
    author: string;
    isbn: string;
    available: boolean;
    category: BookCategory;
}
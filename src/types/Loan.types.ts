export interface Loan{
    id: string;
    userId: string;
    bookId: string;
    loanDate: Date;
    dueDate: Date;
    returnDate?: Date;
}
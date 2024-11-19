import { Book, User, Loan, MembershipType } from "../types";
import { BookModel } from "../models/Book.model";
import { UserModel } from "../models/User.model";
import { LOAN_DURATION } from "../constants/config";
import { calculateDueDate } from "../utils/date.utils";
import { generateId } from "../utils/id.utils";

export class LibraryService {
    private books: Map<string, BookModel> = new Map();
    private users: Map<string, UserModel> = new Map();
    private loans: Map<string, Loan> = new Map();


    // Agregar un nuevo libro a la biblioteca

    addBook(book: BookModel): void {
        const bookDetails = book.getDetails();

        const existingBook = Array.from(this.books.values()).find((b => b.getDetails().isbn === bookDetails.isbn));

        if (existingBook) {
            throw new Error('Ya exiten un libro con ese ISBN ${bookDetails.isbn}');
        }

        this.books.set(bookDetails.id, book);
    }

    // Agregar un nuevo usuario a la biblioteca

    addUser(user: UserModel): void {
        const userDetails = user.getDetails();

        const existingUser = Array.from(this.users.values()).find(u => u.getDetails().email === userDetails.email);

        if (existingUser) {
            throw new Error('Ya existe un usuario con ese email ${userDetails.email}');
        }

        this.users.set(userDetails.id, user);
    }

    //Obtener un libro por su ID

    getBookById(bookId: string): Book | null {
        const book = this.books.get(bookId);

        return book ? book.getDetails() : null;
    }

    // Obtener un usuario por su ID

    getUserById(userId: string): User | null {
        const user = this.users.get(userId);

        return user ? user.getDetails() : null;
    }

    // Obtiene todos los libros disponibles para prestar

    getAvailableBooks(category?: string): Book[] {
        const allBooks = Array.from(this.books.values()).map(book => book.getDetails()).filter(book => book.available);

        if (category) {
            return allBooks.filter(book => book.category === category);
        }

        return allBooks;
    }

    //Realiza el prestamo de un libro a un usuario

    loanBook(userId: string, bookId: string): Loan {
        // Verificar usuario y libro
        const user = this.users.get(userId);
        const book = this.books.get(bookId);

        if (!user || !book) {
            throw new Error('Usuario o libro no encontrado');
        }

        const bookDetails = book.getDetails();
        const userDetails = user.getDetails();

        // Verificar disponibilidad del libro
        if (!bookDetails.available) {
            throw new Error('El libro no está disponible');
        }

        // Verificar límite de préstamos del usuario
        const activeLoans = this.getUserActiveLoans(userId);
        const loanLimit = userDetails.membershipType === MembershipType.PREMIUN ? 5 : 3;

        if (activeLoans.length >= loanLimit) {
            throw new Error(`Ha alcanzado el límite de préstamos (${loanLimit})`);
        }

        // Crear nuevo préstamo
        const loanDuration = userDetails.membershipType === MembershipType.PREMIUN 
            ? LOAN_DURATION.PREMIUN 
            : LOAN_DURATION.STANDARD;

        const loan: Loan = {
            id: generateId(),
            userId,
            bookId,
            loanDate: new Date(),
            dueDate: calculateDueDate(loanDuration)
        };

        // Actualizar disponibilidad del libro y guardar préstamo
        book.setAvailability(false);
        this.loans.set(loan.id, loan);

        return loan;
    }



    //Obtiene los prestamos activos de un usuario
    getUserActiveLoans(userId: string): Loan[]{
        return Array.from(this.loans.values()).filter(loan => loan.userId === userId && !loan.returnedDate);
    }

    //Obtiene todo el historial de prestamos de un usuario
    getUserLoans(userId: string): Loan[]{
        return Array.from(this.loans.values()).filter(loan => loan.userId === userId).sort((a,b) => b.loanDate.getTime() - a.loanDate.getTime());
    }

    //Devuelve un libro prestado
    returnBook(loanId: string): void{
        const loan = this.loans.get(loanId);

        if(!loan){
            throw new Error('Prestamo no encontrado');
        }

        if (loan.returnedDate){
            throw new Error('El libro ya ha sido devuelto');
        }

        const book = this.books.get(loan.bookId);

        if (!book){
            throw new Error('Libro no encontrado');
        }

        //actualizar disponibilidad del libro y fecha de devolucion
        loan.returnedDate = new Date();
        book.setAvailability(true);

    }

    //Busca libros por titulo o autor
    searchBooks(query:string): Book[]{
        const searchTerm = query.toLowerCase();
        return Array.from(this.books.values()).map(book => book.getDetails()).filter(book =>  book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm));
    }

    //Verifica si un prestamo esta vencido
    isLoanOverdue(loanId: string): boolean{
        const loan = this.loans.get(loanId);
        if (!loan || loan.returnedDate){
            return false;
        }

        return new Date() > loan.dueDate;
    }

    //Obtiene todos los prestamos vencidos
    getOverdueLoans(): Loan[]{
        return Array.from(this.loans.values()).filter(loan => !loan.returnedDate && new Date() > loan.dueDate).sort((a,b) => a.dueDate.getTime() - b.dueDate.getTime());
    }

    //Generar estadiisticas de prestamos de la biblioteca
    getStatistics(){
        const totalBooks = this.books.size;
        const availableBooks = this.getAvailableBooks().length;
        const totalUsers = this.users.size;
        const activeLoans = Array.from(this.loans.values()).filter(loan => !loan.returnedDate).length;
        const overdueLoans = this.getOverdueLoans().length;

        return{
            totalBooks,
            availableBooks,
            totalUsers,
            activeLoans,
            overdueLoans,
            loanedPercentage: ((totalBooks - availableBooks)/totalBooks * 100).toFixed(2)
        };
    }

}
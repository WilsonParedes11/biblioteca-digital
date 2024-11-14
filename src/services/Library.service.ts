import { Book, User, Loan, MembershipType } from "../types";
import { BookModel } from "../models/Book.model";
import { UserModel } from "../models/User.model";
import { LOAN_DURATION } from "../constants/config";
import { calculateDueDate } from "../utils/date.utils";
import { generateId } from "../utils/id.utils";

export class LibraryService{
    private books: Map<string, BookModel> = new Map();
    private users: Map<string, UserModel> = new Map();
    private loans: Map<string, Loan> = new Map();
}
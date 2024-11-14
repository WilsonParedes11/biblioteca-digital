export const calculateDueDate = (days: number): Date =>{
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + days);
    return dueDate;
}
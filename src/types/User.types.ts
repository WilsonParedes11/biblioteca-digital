export enum MembershipType{
    STANDARD = 'Standard',
    PREMIUN = 'Premium',
}

export interface User{
    id: string;
    name: string;
    email: string;
    membershipTYpe: MembershipType;
}
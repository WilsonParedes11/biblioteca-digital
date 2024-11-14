import { User, MembershipType } from '../types';
import { generateId } from '../utils/id.utils';

export class UserModel {
    private user: User;

    constructor(
        name: string,
        email: string,
        membershipType: MembershipType = MembershipType.STANDARD
    ) {
        this.user = {
            id: generateId(),
            name,
            email,
            membershipType
        };
    }

    getDetails(): User {
        return { ...this.user };
    }

    upgradeMembership(): void {
        this.user.membershipType = MembershipType.PREMIUM;
    }
}
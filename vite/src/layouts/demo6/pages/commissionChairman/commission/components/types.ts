export interface User {
    id: number;
    name: string;
    title: string;
    email: string;
    role: 'COMMISSION_CHAIRMAN' | 'COMMISSION_MEMBER';
    status: 'active' | 'passive';
  }
  
  export interface NewUser {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
  }

export interface CommissionMemberDTO {
  userId: string;
  name: string;
  surname: string;
  email: string;
  role: 'COMMISSION_CHAIRMAN' | 'COMMISSION_MEMBER';
}
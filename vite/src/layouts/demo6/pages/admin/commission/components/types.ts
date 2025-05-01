export interface User {
    id: number;
    name: string;
    title: string;
    email: string;
    role: 'COMMISSION_HEAD' | 'COMMISSION_MEMBER';
    status: 'active' | 'passive';
  }
  
  export interface NewUser {
    firstName: string;
    lastName: string;
    title: string;
    email: string;
  }
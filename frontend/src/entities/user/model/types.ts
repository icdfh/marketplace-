export interface User{
    id: number;
    email: string;
    username: string;
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
    phone: string | null;
    user_type: string;
    created_date: string; 
}
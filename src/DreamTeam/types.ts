export interface Name {
    first: string;
    last: string;
}

export interface Person {
    userId: string;
    name: Name;
    age: number;
    visits: number;
    job: string;
    room: string;
    rating?: string;
}

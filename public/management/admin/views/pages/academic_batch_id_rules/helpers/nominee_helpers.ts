export interface NomineeType {
    name: string;
    relation: string;
    age: number;
    mobile_number: string;
    percentage: number;
}

export function set_nominee(): NomineeType {
    return {
        name: '',
        relation: '',
        age: 0,
        mobile_number: '',
        percentage: 0,
    };
}
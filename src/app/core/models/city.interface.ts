import { District } from "./district.interface";

export interface City {
    id: number;
    name: string;
    districts: District[];
}
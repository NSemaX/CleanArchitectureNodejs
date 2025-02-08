import { IEntity } from "../entity";

export interface IProduct extends IEntity {
    Name: string;
    Price: number;
}
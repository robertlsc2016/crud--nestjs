import { Entity } from "typeorm";

@Entity()
export class UsersEntity {
  name: string;
  email: string;
}

import { Entity } from "@/core/entities/entity";
import { UniqueEntityID } from "@/core/entities/unique-entity-id";

export interface UserProps {
    name: string;
    email: string;
    password: string;
    avatar?: string;
}

export class User extends Entity<UserProps>{
    get name(){
        return this.props.name;
    }

    set name(value: string){
        this.props.name = value;
    }

    get email(){
        return this.props.email;
    }

    set email(value: string){
        this.props.email = value;
    }

    get password(){
        return this.props.password;
    }

    set password(value: string){
        this.props.password = value;
    }

    get avatar(){
       return this.props.avatar;
    }

    set avatar(value: string | undefined){
        this.props.avatar = value;
    }

  
    static create(props: UserProps, id?: UniqueEntityID){
        const user = new User(props, id);

        return user;
    }
}
import {
    getModelForClass,
    modelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import * as mongoose from "mongoose";

@modelOptions({ schemaOptions: { collection: "students", timestamps: true } })
export class StudentClass {
    @prop({ required: true, minlength: 1 })
    public username!: string;

    @prop({ required: true, minlength: 1 })
    public email!: string;

    @prop({ required: true })
    public password!: string;

    @prop({ required: true, default: true })
    public isTempPassword!: boolean;
}

const Student = getModelForClass(StudentClass);
export default Student;

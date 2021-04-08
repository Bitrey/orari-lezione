import {
    getModelForClass,
    modelOptions,
    prop,
    Ref
} from "@typegoose/typegoose";
import randomstring from "randomstring";
import moment from "moment";
import * as mongoose from "mongoose";

@modelOptions({
    schemaOptions: { collection: "passwordresets", timestamps: true }
})
export class PasswordResetClass {
    @prop({ ref: "StudentClass" })
    public student!: Ref<"StudentClass">;

    @prop({ required: true, default: randomstring.generate({ length: 16 }) })
    public url!: string;

    @prop({ required: true, default: randomstring.generate({ length: 16 }) })
    public secret!: string;

    // Expires after an hour
    @prop({ required: true, default: moment().add(1, "hour").toDate() })
    public expiryDate!: Date;

    @prop({ required: true, default: false })
    public hasBeenUsed!: boolean;
}

const PasswordReset = getModelForClass(PasswordResetClass);
export default PasswordReset;

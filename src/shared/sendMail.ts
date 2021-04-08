import Mail from "nodemailer/lib/mailer";
import transporter from "./transporter";

export function sendMail(message: Mail.Options): Promise<void> {
    return new Promise(async (resolve, reject) => {
        transporter.sendMail(message, (err, info) => {
            if (err) console.error(err, "\n\n-----\n\n");
            resolve();
        });
    });
}

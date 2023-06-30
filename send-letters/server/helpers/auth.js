import bcrpt from "bcrypt";

export const hashPassword = (password) => {
    return new Promise((resolve, reject) => {
        bcrpt.genSalt(12, (err, salt) => {
            if (err) {
                reject(err);
            }
            bcrpt.hash(password, salt, (err, hash) => {
                if (err) {
                    reject(err);
                }
                resolve(hash);
            });
        });
    });
};

export const comparePassword = (password, hashed) => {
    return bcrpt.compare(password, hashed);
};

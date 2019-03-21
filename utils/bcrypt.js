const bcrypt = require('bcrypt-node');

module.exports.hashPassword = (plainTextPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(null, (err, salt) => {
            if (err) {
                reject(err);
            }

            // bcrypt.hash(plainTextPassword, salt, null, (err, hash) => {
            //     if (err) {
            //         reject(err);
            //     }
            //     resolve(hash);
            // });
            resolve(bcrypt.hashSync(plainTextPassword, salt))
        });
    });
};


module.exports.checkPassword = (plainTextPassword, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainTextPassword, hashedPassword, (err, match) => {
            if(err) {
                reject(err);
            }

            resolve(match);
        });
    });
};
var User = require('./app/model/user');

// User.create({ name: "mantaro", email: "mantaro@mantaro", password: "mantaro", salt: "mantaro" }).then(mantaro => {
//   console.log("mantaro's auto-generated ID:", mantaro.id);
// });

User.findOne({where:{email:'notpresent'}}).then(user => {
    if (user) {
        console.log("correct")
    } else {
        console.log("no")
    }
});
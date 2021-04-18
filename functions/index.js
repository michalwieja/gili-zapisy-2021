const functions = require("firebase-functions");

const admin = require("firebase-admin");
admin.initializeApp();


exports.addAdminRole = functions.https.onCall((data) => {
  return admin.auth().getUserByEmail(data.email)
      .then((user) => admin.auth().setCustomUserClaims(user.uid, {admin: true}))
      .then(console.warn("admin"))
      .catch((err) => console.warn(err));
});

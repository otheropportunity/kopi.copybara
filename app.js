// Example: Save new buyer
function registerBuyer(name, number, email, password) {
  db.ref("buyers/" + number).set({
    BuyerName: name,
    BuyerNumber: number,
    BuyerEmail: email,
    BuyerPassword: password,
    BuyerPoint: 0
  });
}

// Example: Add 1 stamp
function addStamp(number) {
  const ref = db.ref("buyers/" + number + "/BuyerPoint");
  ref.transaction(points => (points || 0) + 1);
}

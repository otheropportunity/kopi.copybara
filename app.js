// app.js

function registerBuyer() {
  const name = document.getElementById("buyerName").value.trim();
  const phone = document.getElementById("buyerNumber").value.trim();
  const email = document.getElementById("buyerEmail").value.trim();
  const password = document.getElementById("buyerPassword").value.trim();

  if (!name || !phone || !email || !password) {
    alert("⚠️ Please fill all fields.");
    return;
  }

  const db = firebase.database();
  const buyerRef = db.ref("buyers");

  // Generate unique key
  const newBuyerRef = buyerRef.push();

  newBuyerRef
    .set({
      name: name,
      phone: phone,
      email: email,
      password: password,
      points: 0,
      createdAt: new Date().toISOString(),
    })
    .then(() => {
      alert("✅ Registration successful!");
      document.getElementById("buyerName").value = "";
      document.getElementById("buyerNumber").value = "";
      document.getElementById("buyerEmail").value = "";
      document.getElementById("buyerPassword").value = "";
    })
    .catch((error) => {
      alert("Error: " + error.message);
    });
}

// ✅ Updated login logic: allow login by email OR phone number
function loginBuyer() {
  const identifier = document.getElementById("loginIdentifier").value.trim();
  const password = document.getElementById("loginPassword").value.trim();
  const db = firebase.database();

  if (!identifier || !password) {
    alert("⚠️ Please enter your email/phone and password.");
    return;
  }

  db.ref("buyers").once("value", (snapshot) => {
    let found = false;
    snapshot.forEach((child) => {
      const buyer = child.val();
      if (
        (buyer.email === identifier || buyer.phone === identifier) &&
        buyer.password === password
      ) {
        found = true;
        document.getElementById("authSection").classList.add("hidden");
        document.getElementById("buyerSection").classList.remove("hidden");
        document.getElementById("buyerNameDisplay").textContent = buyer.name;
        document.getElementById("buyerPoints").textContent = buyer.points || 0;
      }
    });

    if (!found) alert("❌ Invalid email/phone or password.");
  });
}

function logoutBuyer() {
  document.getElementById("authSection").classList.remove("hidden");
  document.getElementById("buyerSection").classList.add("hidden");
}

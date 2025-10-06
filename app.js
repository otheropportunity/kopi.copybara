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
function loginUser() {
  const identifier = document.getElementById("loginIdentifier").value.trim();
  const password = document.getElementById("loginPassword").value.trim();

  if (!identifier || !password) {
    alert("Please fill all login fields.");
    return;
  }

  const allRoles = ["buyers", "staffs"];
  const dbRef = firebase.database();

  let found = false;

  allRoles.forEach((roleType, index) => {
    dbRef.ref(roleType).once("value", (snapshot) => {
      snapshot.forEach((child) => {
        const user = child.val();

        if ((user.email === identifier || user.phone === identifier) && user.password === password) {
          found = true;

          localStorage.setItem("userEmail", user.email);
          localStorage.setItem("userRole", user.role);

          if (user.role === "staff") {
            sessionStorage.setItem("staffName", user.name);
            window.location.href = "transaction.html";
          } else if (user.role === "member") {
            sessionStorage.setItem("buyerName", user.name);
            window.location.href = "redeem.html";
          }
        }
      });

      // If still not found after checking both roles
      if (!found && index === allRoles.length - 1) {
        alert("Invalid credentials. Please try again.");
      }
    });
  });
}


function logoutBuyer() {
  document.getElementById("authSection").classList.remove("hidden");
  document.getElementById("buyerSection").classList.add("hidden");
}

// === STAFF SESSION ===
document.addEventListener("DOMContentLoaded", () => {
  const staffName = sessionStorage.getItem("staffName");
  if (staffName) {
    document.getElementById("staffNameDisplay").textContent = staffName;
  } else {
    // not logged in → redirect
    window.location.href = "index.html";
  }
});

function logoutStaff() {
  sessionStorage.removeItem("staffName");
  window.location.href = "index.html";
}

// === STAFF FUNCTIONALITY ===
function searchBuyer() {
  const keyword = document.getElementById("searchBuyer").value.trim().toLowerCase();
  if (!keyword) {
    alert("Please enter a name or phone number.");
    return;
  }

  const db = firebase.database();
  db.ref("buyers").once("value", (snapshot) => {
    let found = false;
    snapshot.forEach((child) => {
      const buyer = child.val();
      if (
        buyer.name.toLowerCase().includes(keyword) ||
        buyer.phone.toLowerCase().includes(keyword)
      ) {
        found = true;
        document.getElementById("buyerInfo").classList.remove("hidden");
        document.getElementById("buyerFoundName").textContent = buyer.name;
        document.getElementById("buyerFoundPhone").textContent = buyer.phone;
        document.getElementById("buyerFoundPoints").textContent = buyer.points || 0;

        // store ref for update
        sessionStorage.setItem("buyerKey", child.key);
      }
    });

    if (!found) {
      alert("Buyer not found.");
      document.getElementById("buyerInfo").classList.add("hidden");
    }
  });
}

function addPoint() {
  const buyerKey = sessionStorage.getItem("buyerKey");
  if (!buyerKey) return alert("Search a buyer first.");

  const buyerPointsEl = document.getElementById("buyerFoundPoints");
  let points = parseInt(buyerPointsEl.textContent) || 0;
  points += 1;

  firebase.database().ref("buyers/" + buyerKey + "/points").set(points);
  buyerPointsEl.textContent = points;
  alert("Added +1 point!");
}

function redeemPoint() {
  const buyerKey = sessionStorage.getItem("buyerKey");
  if (!buyerKey) return alert("Search a buyer first.");

  const buyerPointsEl = document.getElementById("buyerFoundPoints");
  let points = parseInt(buyerPointsEl.textContent) || 0;

  if (points <= 0) {
    alert("Not enough points to redeem.");
    return;
  }

  points -= 1;
  firebase.database().ref("buyers/" + buyerKey + "/points").set(points);
  buyerPointsEl.textContent = points;
  alert("Redeemed -1 point!");
}



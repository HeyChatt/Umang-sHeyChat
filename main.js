// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlVJcbUt1lxZDd5oMUvwemk-FMiFneid80",
  authDomain: "heychat-1aea9.firebaseapp.com",
  projectId: "heychat-1aea9",
  storageBucket: "heychat-1aea9.appspot.com",
  messagingSenderId: "324327775275",
  appId: "1:324327775275:web:28ecebf9147b87d1655e6e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Wait for login state before loading messages
firebase.auth().onAuthStateChanged(user => {
  if (user) {
    console.log("Signed in as:", user.email);
    document.getElementById("messages").innerHTML =
      `<p style="color:green;">Logged in as: ${user.email}</p>`;
    loadMessages();
  } else {
    console.log("No user logged in");
  }
});
  // --- LOGIN / SIGNUP / LOGOUT FUNCTIONS ---
function signup(email, password) {
  firebase.auth().createUserWithEmailAndPassword(email, password)
    .then(() => alert("Signup successful! You can now log in."))
    .catch(error => alert(error.message));
}

function login(email, password) {
  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(() => alert("Login successful!"))
    .catch(error => alert(error.message));
}

function logout() {
  firebase.auth().signOut()
    .then(() => alert("Logged out!"))
    .catch(error => alert(error.message));
}
});

// Function to send a message
function sendMessage() {
  const text = document.getElementById("text").value.trim();
  if (text === "") return;

  const user = firebase.auth().currentUser;
  if (!user) {
    alert("Please log in before sending messages.");
    return;
  }

  db.collection("messages").add({
    text: text,
    name: user.email, // use logged-in user's email
    time: firebase.firestore.FieldValue.serverTimestamp()
  })
  .then(() => {
    document.getElementById("text").value = "";
  })
  .catch(error => {
    console.error("Error sending message:", error);
  });
}

// Function to load & display messages
function loadMessages() {
  db.collection("messages")
    .orderBy("time")
    .onSnapshot(snapshot => {
      const messages = document.getElementById("messages");
      messages.innerHTML = "";
      snapshot.forEach(doc => {
  const msg = doc.data();
  const div = document.createElement("div");
  div.classList.add("message");

  if (msg.name === firebase.auth().currentUser.email) {
    div.classList.add("sent");
  } else {
    div.classList.add("received");
  }

  const time = msg.time?.toDate
    ? msg.time.toDate().toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'})
    : "";

  div.innerHTML = `<b>${msg.name || "Friend"}:</b> ${msg.text || ""}<br><small>${time}</small>`;
  messages.appendChild(div);
});
      messages.scrollTop = messages.scrollHeight; // auto-scroll
    });
    }

// --- DARK MODE TOGGLE ---
const toggle = document.createElement("button");
toggle.textContent = "🌙";
toggle.style.position = "fixed";
toggle.style.top = "10px";
toggle.style.right = "10px";
toggle.style.zIndex = "999";
toggle.style.border = "none";
toggle.style.background = "transparent";
toggle.style.fontSize = "24px";
toggle.style.cursor = "pointer";
document.body.appendChild(toggle);

toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  toggle.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
});

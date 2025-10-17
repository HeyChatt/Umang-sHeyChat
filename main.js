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
    loadMessages();
  } else {
    console.log("No user logged in");
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
        const p = document.createElement("p");
        p.innerHTML = `<b>${msg.name || "Friend"}:</b> ${msg.text || ""}`;
        messages.appendChild(p);
      });
      messages.scrollTop = messages.scrollHeight; // auto-scroll
    });
    }

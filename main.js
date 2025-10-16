// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAlVJcbUTlxZDd5oMUwvemk-FMiFneid80",
  authDomain: "heychat-1aea9.firebaseapp.com",
  projectId: "heychat-1aea9",
  storageBucket: "heychat-1aea9.appspot.com",
  messagingSenderId: "324327775275",
  appId: "1:324327775275:web:28ecebf9147b87d1655e6e"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// Function to send messages
function sendMessage() {
  const text = document.getElementById("text").value;
  if (text.trim() === "") return;

  db.collection("messages").add({
    text: text,
    name: "Friend",
    time: firebase.firestore.FieldValue.serverTimestamp()
  });

  document.getElementById("text").value = "";
}

// Function to display messages
db.collection("messages")
  .orderBy("time")
  .onSnapshot(snapshot => {
    const messages = document.getElementById("messages");
    messages.innerHTML = "";
    snapshot.forEach(doc => {
      const msg = doc.data();
      messages.innerHTML += `<p><b>${msg.name}:</b> ${msg.text}</p>`;
    });
    messages.scrollTop = messages.scrollHeight; // auto-scroll
  });

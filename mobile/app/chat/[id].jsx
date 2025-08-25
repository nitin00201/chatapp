import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { io } from "socket.io-client";
import api from "../../lib/axios"; // your Axios instance
import { useAuthStore } from "../../store/useAuthStore";
import { useUserStore } from "../../store/useUserStore";

let socket;

export default function ChatScreen() {
  const { id } = useLocalSearchParams(); // the other user’s id
  const { token } = useAuthStore(); // logged in user’s token
  const user = useUserStore((state) => state.user);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOnline, setIsOnline] = useState(false);
  const [typing, setTyping] = useState(false);

  // 1️⃣ Fetch history when screen loads
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await api.get(`/conversations/${id}/messages`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMessages(res.data);
      } catch (err) {
        console.error("Error loading chat:", err.response?.data || err.message);
      }
    };

    fetchMessages();
  }, [id]);

  // 2️⃣ Connect socket + listeners
  useEffect(() => {
    socket = io("http://10.205.43.38:4000", {
      auth: { token }
    });

    // 🔔 new message
    socket.on("message:new", (msg) => {
      if (
        (msg.sender === id && msg.receiver === user._id) ||
        (msg.sender === user._id && msg.receiver === id)
      ) {
        setMessages((prev) => [...prev, msg]);

        // if I’m receiver → mark as read
        if (msg.receiver === user._id) {
          socket.emit("message:read", { msgId: msg._id });
        }
      }
    });

    // 🔔 message read
    socket.on("message:read", (msg) => {
      setMessages((prev) =>
        prev.map((m) => (m._id === msg._id ? { ...m, read: true } : m))
      );
    });

    // 🔔 online/offline
    socket.on("user:online", ({ userId }) => {
      if (userId === id) setIsOnline(true);
    });
    socket.on("user:offline", ({ userId }) => {
      if (userId === id) setIsOnline(false);
    });

    // 🔔 typing
    socket.on("typing:start", ({ from }) => {
      if (from === id) setTyping(true);
    });
    socket.on("typing:stop", ({ from }) => {
      if (from === id) setTyping(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [id]);

  // 3️⃣ Send message
  const sendMessage = () => {
    if (!input.trim()) return;
    socket.emit("message:send", { receiver: id, text: input });
    setInput("");
    socket.emit("typing:stop", { receiver: id });
  };

  const handleTyping = (value) => {
    setInput(value);
    if (value) {
      socket.emit("typing:start", { receiver: id });
    } else {
      socket.emit("typing:stop", { receiver: id });
    }
  };

  return (
    <View style={styles.container}>
      {/* Header with status */}
      

     <FlatList
  data={messages}
  keyExtractor={(item) => item._id}
  renderItem={({ item }) => (
    <View
      style={[
        styles.message,
        item.sender === user._id ? styles.myMessage : styles.theirMessage,
      ]}
    >
      <Text style={styles.text}>{item.text}</Text>
      {item.sender === user._id && (
        <Text style={styles.status}>
          {item.read ? "✓✓" : "✓"}
        </Text>
      )}
    </View>
  )}
  // 👇 Show if no messages
  ListEmptyComponent={
    <View style={styles.emptyChat}>
      <Text style={styles.emptyText}>No conversation yet. Start chatting!</Text>
    </View>
  }
/>


      {typing && <Text style={styles.typing}>Typing...</Text>}

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={handleTyping}
          placeholder="Type a message..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={{ color: "white" }}>Send</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    backgroundColor: "#f9f9f9",
  },
  headerText: { fontSize: 16, fontWeight: "bold" },
  message: {
    padding: 10,
    margin: 5,
    borderRadius: 10,
    maxWidth: "70%",
  },
  myMessage: {
    backgroundColor: "#DCF8C6",
    alignSelf: "flex-end",
  },
  theirMessage: {
    backgroundColor: "#E5E5EA",
    alignSelf: "flex-start",
  },
  text: { fontSize: 16 },
  status: { fontSize: 12, color: "gray", marginTop: 2, textAlign: "right" },
  typing: {
    fontStyle: "italic",
    color: "gray",
    marginLeft: 15,
    marginBottom: 5,
  },
  inputContainer: {
    flexDirection: "row",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: "#007AFF",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyChat: {
  flex: 1,
  justifyContent: "center",
  alignItems: "center",
  marginTop: 50,
},
emptyText: {
  fontSize: 16,
  color: "gray",
  fontStyle: "italic",
},

});

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import api from "../../lib/axios";
import { useAuthStore } from "../../store/useAuthStore";
import { useRouter } from "expo-router";
import { io } from "socket.io-client";

const { width } = Dimensions.get("window");

export default function ChatsScreen() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();
  const [socket, setSocket] = useState(null);
  const logout = useAuthStore((state) => state.logout);


  // Fetch users from backend
 useEffect(() => {
  const fetchUsers = async () => {
    setLoading(true);
    try {
      if (!token) {
        console.log("⚠️ No token, logging out");
        logout();
        router.replace("/login");
        return;
      }

      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users:", err.message);

      if (err.response?.status === 401) {
        console.log("🚪 Token expired → logging out");
        logout();
        router.replace("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  fetchUsers();
}, [token]);


  // Setup socket connection
  useEffect(() => {
    if (!token) return;

    const s = io("http://10.205.43.38:4000", {
      auth: { token },
    });

    setSocket(s);

    // Listen for online status updates
    s.on("user:online", ({ userId }) => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isOnline: true } : u
        )
      );
    });

    s.on("user:offline", ({ userId }) => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === userId ? { ...u, isOnline: false } : u
        )
      );
    });

    return () => {
      s.disconnect();
    };
  }, [token]);

  const renderUserItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      activeOpacity={0.7}
      onPress={() => router.push(`/chat/${item._id}`)}
    >
      <View style={styles.avatarContainer}>
        <Image
          source={{
            uri: item.avatar || `https://i.pravatar.cc/150?u=${item._id}`,
          }}
          style={styles.avatar}
        />
        {item.isOnline && <View style={styles.onlineDot} />}
      </View>

      <View style={styles.chatInfo}>
        <View style={styles.chatHeader}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.time}>{item.isOnline ? "Online" : "Offline"}</Text>
        </View>
        <View style={styles.chatFooter}>
          <Text style={styles.lastMessage} numberOfLines={1}>
            {item.email}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#4267B2" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.headerTitle}>Messages</Text>
          <TouchableOpacity style={styles.headerButton}>
            <Text style={styles.headerButtonIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search conversations..."
            placeholderTextColor="#999"
          />
        </View>
      </View>

      <View style={styles.chatsSection}>
        <Text style={styles.sectionTitle}>Users</Text>
        <FlatList
          data={users}
          keyExtractor={(item) => item._id}
          renderItem={renderUserItem}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          ListEmptyComponent={
            <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
              No users found
            </Text>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f8f9fa" },
  header: {
    backgroundColor: "#fff",
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "800",
    color: "#1a1a1a",
  },
  headerButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonIcon: { fontSize: 20 },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  searchIcon: { fontSize: 16, marginRight: 10 },
  searchInput: { flex: 1, fontSize: 16, color: "#333" },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  chatsSection: { flex: 1, backgroundColor: "#fff" },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#fff",
  },
  avatarContainer: { position: "relative", marginRight: 15 },
  avatar: { width: 60, height: 60, borderRadius: 30 },
  onlineDot: {
    position: "absolute",
    bottom: 5,
    right: 5,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#fff",
  },
  chatInfo: { flex: 1, justifyContent: "center" },
  chatHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  name: { fontSize: 17, fontWeight: "600", color: "#1a1a1a" },
  time: { fontSize: 13, color: "#999", fontWeight: "500" },
  chatFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  lastMessage: { fontSize: 15, color: "#666", flex: 1, marginRight: 10 },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});

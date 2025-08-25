import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, Dimensions } from "react-native";
import { useUserStore } from "../../store/useUserStore"
import { useAuthStore } from "../../store/useAuthStore"
import api from "../../lib/axios"

import { useRouter } from "expo-router";
import { useEffect, useState } from "react";


const { width } = Dimensions.get("window");

const menuItems = [
  { id: 1, icon: "👤", title: "Edit Profile", subtitle: "Update your personal information", color: "#4267B2" },
  { id: 2, icon: "🔔", title: "Notifications", subtitle: "Manage your notification settings", color: "#42c767" },
  { id: 3, icon: "🔒", title: "Privacy", subtitle: "Control your privacy settings", color: "#ff9500" },
  { id: 4, icon: "🌙", title: "Dark Mode", subtitle: "Switch to dark appearance", color: "#5856d6" },
  { id: 5, icon: "💬", title: "Chat Settings", subtitle: "Customize your chat experience", color: "#34c759" },
  { id: 6, icon: "📱", title: "Storage", subtitle: "Manage app storage and data", color: "#007aff" },
  { id: 7, icon: "❓", title: "Help & Support", subtitle: "Get help and contact support", color: "#ff3b30" },
  { id: 8, icon: "ℹ️", title: "About", subtitle: "App version and information", color: "#8e8e93" },
];


export default function ProfileScreen() {
      const { user } = useUserStore();
      const token = useAuthStore((state) => state.token); // <-- add this line
const [stats, setStats] = useState([
    { label: "Chats", value: 0 },
    { label: "Friends", value: 0 },
    { label: "Groups", value: 0 },
  ]);
      const logout = useAuthStore((state) => state.logout);
      const router = useRouter();
      useEffect(() => {
  const fetchStats = async () => {
    try {
      if (!token) {
        console.log("⚠️ No token, logging out");
        handleLogout();
        return;
      }

      const res = await api.get("/users", {
        headers: { Authorization: `Bearer ${token}` },
      });

      const users = res.data || [];

      setStats([
        { label: "Chats", value: 0 },
        { label: "Friends", value: users.length > 0 ? users.length - 1 : 0 },
        { label: "Groups", value: 0 },
      ]);
    } catch (err) {
      console.error("Error fetching stats:", err.message);

      if (err.response?.status === 401) {
        console.log("🚪 Token expired or invalid → Logging out");
        handleLogout(); // auto logout
      } else {
        // fallback
        setStats([
          { label: "Chats", value: 0 },
          { label: "Friends", value: 0 },
          { label: "Groups", value: 0 },
        ]);
      }
    }
  };

  fetchStats();
}, [token]);

     const handleLogout = () => {
        logout();               // clear token + user
     router.replace("/login"); // redirect to login page
  };

  const renderMenuItem = (item) => (
    <TouchableOpacity key={item.id} style={styles.menuItem} activeOpacity={0.7}>
      <View style={[styles.menuIcon, { backgroundColor: `${item.color}15` }]}>
        <Text style={styles.menuIconText}>{item.icon}</Text>
      </View>
      <View style={styles.menuContent}>
        <Text style={styles.menuTitle}>{item.title}</Text>
        <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
      </View>
      <Text style={styles.menuArrow}>›</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>⚙️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <TouchableOpacity style={styles.headerButton}>
          <Text style={styles.headerButtonText}>✏️</Text>
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri: "https://i.pravatar.cc/150?img=12" }}
            style={styles.avatar}
          />
          <TouchableOpacity style={styles.cameraButton}>
            <Text style={styles.cameraIcon}>📷</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{user?.name || 'john Doe'}</Text>
        <Text style={styles.email}>{user?.email || 'john.doe@example.com'}</Text>
        <Text style={styles.status}>💚 Available</Text>

        <TouchableOpacity style={styles.editButton}>
          <Text style={styles.editButtonText}>Edit Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Stats Section */}
      <View style={styles.statsSection}>
        {stats.map((stat, index) => (
          <View key={index} style={styles.statItem}>
            <Text style={styles.statValue}>{stat.value}</Text>
            <Text style={styles.statLabel}>{stat.label}</Text>
          </View>
        ))}
      </View>

      {/* Account Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.menuContainer}>
          {menuItems.slice(0, 4).map(renderMenuItem)}
        </View>
      </View>

      {/* Settings Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Settings</Text>
        <View style={styles.menuContainer}>
          {menuItems.slice(4, 6).map(renderMenuItem)}
        </View>
      </View>

      {/* Support Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Support</Text>
        <View style={styles.menuContainer}>
          {menuItems.slice(6, 8).map(renderMenuItem)}
        </View>
      </View>

      {/* Logout Button */}
      <View style={styles.logoutSection}>
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}
>
          <Text style={styles.logoutIcon}>🚪</Text>
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>ChatApp v2.1.0</Text>
        <Text style={styles.footerSubtext}>Made with ❤️</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#f5f5f5",
    justifyContent: "center",
    alignItems: "center",
  },
  headerButtonText: {
    fontSize: 18,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  profileSection: {
    backgroundColor: "#fff",
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    position: "relative",
    marginBottom: 20,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  cameraButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#4267B2",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 3,
    borderColor: "#fff",
  },
  cameraIcon: {
    fontSize: 16,
  },
  name: {
    fontSize: 26,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  email: {
    fontSize: 16,
    color: "#666",
    marginBottom: 5,
  },
  status: {
    fontSize: 14,
    color: "#42c767",
    marginBottom: 20,
    fontWeight: "500",
  },
  editButton: {
    backgroundColor: "#4267B2",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
  },
  editButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  statsSection: {
    flexDirection: "row",
    backgroundColor: "#fff",
    marginBottom: 20,
    paddingVertical: 20,
    justifyContent: "space-around",
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1a1a1a",
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1a1a1a",
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  menuContainer: {
    backgroundColor: "#fff",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuIcon: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  menuIconText: {
    fontSize: 20,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 2,
  },
  menuSubtitle: {
    fontSize: 13,
    color: "#666",
  },
  menuArrow: {
    fontSize: 20,
    color: "#ccc",
    fontWeight: "300",
  },
  logoutSection: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#ff3b30",
  },
  logoutIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#ff3b30",
  },
  footer: {
    alignItems: "center",
    paddingBottom: 40,
  },
  footerText: {
    fontSize: 14,
    color: "#999",
    marginBottom: 5,
  },
  footerSubtext: {
    fontSize: 12,
    color: "#ccc",
  },
});
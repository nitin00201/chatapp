import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ScrollView } from "react-native";

const { width, height } = Dimensions.get("window");
import { useUserStore } from "../../store/useUserStore"



export default function HomeScreen() {
    const { user } = useUserStore();

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} style={styles.scrollView}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.profileSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user?.name[0] || 'NA'}</Text>
            </View>
            <View>
              <Text style={styles.greeting}>Good Morning</Text>
              <Text style={styles.username}>{user?.name || 'user'}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.notificationButton}>
            <Text style={styles.notificationIcon}>🔔</Text>
          </TouchableOpacity>
        </View>

        {/* Welcome Section */}
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeTitle}>What would you like to do?</Text>
          <Text style={styles.welcomeSubtitle}>Explore features and connect with friends</Text>
        </View>

        {/* Quick Actions Grid */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={[styles.quickActionCard, styles.primaryCard]} activeOpacity={0.8}>
            <View style={styles.iconContainer}>
              <Text style={styles.cardIcon}>💬</Text>
            </View>
            <Text style={styles.quickActionTitle}>New Chat</Text>
            <Text style={styles.quickActionDesc}>Start conversation</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.quickActionCard, styles.secondaryCard]} activeOpacity={0.8}>
            <View style={styles.iconContainer}>
              <Text style={styles.cardIcon}>👥</Text>
            </View>
            <Text style={styles.quickActionTitle}>Find Friends</Text>
            <Text style={styles.quickActionDesc}>Discover people</Text>
          </TouchableOpacity>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>42</Text>
            <Text style={styles.statLabel}>Active Chats</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Friends</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Groups</Text>
          </View>
        </View>

        {/* Main Feature Cards */}
        <View style={styles.mainCards}>
          <TouchableOpacity style={[styles.featureCard, styles.trendingCard]} activeOpacity={0.8}>
            <View style={styles.cardContent}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🎯</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Trending Chats</Text>
                <Text style={styles.featureSubtitle}>Join popular conversations happening now</Text>
              </View>
              <Text style={styles.cardArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.featureCard, styles.discoverCard]} activeOpacity={0.8}>
            <View style={styles.cardContent}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>🌟</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Discover</Text>
                <Text style={styles.featureSubtitle}>Explore new communities and topics</Text>
              </View>
              <Text style={styles.cardArrow}>›</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.featureCard, styles.settingsCard]} activeOpacity={0.8}>
            <View style={styles.cardContent}>
              <View style={styles.featureIconContainer}>
                <Text style={styles.featureIcon}>⚙️</Text>
              </View>
              <View style={styles.featureTextContainer}>
                <Text style={styles.featureTitle}>Settings</Text>
                <Text style={styles.featureSubtitle}>Customize your app experience</Text>
              </View>
              <Text style={styles.cardArrow}>›</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityCard}>
            <View style={styles.activityIconContainer}>
              <Text style={styles.activityIcon}>💬</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>New message from Alice</Text>
              <Text style={styles.activityTime}>2 minutes ago</Text>
            </View>
          </View>
          
          <View style={styles.activityCard}>
            <View style={styles.activityIconContainer}>
              <Text style={styles.activityIcon}>👥</Text>
            </View>
            <View style={styles.activityContent}>
              <Text style={styles.activityTitle}>Bob joined your group</Text>
              <Text style={styles.activityTime}>1 hour ago</Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacer */}
        <View style={styles.bottomSpacer} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: "#fff",
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#4267B2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '700',
  },
  greeting: {
    color: '#666',
    fontSize: 14,
  },
  username: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: '600',
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationIcon: {
    fontSize: 20,
  },
  welcomeSection: {
    paddingHorizontal: 20,
    paddingVertical: 25,
    backgroundColor: '#fff',
    marginBottom: 15,
  },
  welcomeTitle: {
    color: '#1a1a1a',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  welcomeSubtitle: {
    color: '#666',
    fontSize: 16,
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  quickActionCard: {
    width: (width - 50) / 2,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  primaryCard: {
    backgroundColor: '#4267B2',
  },
  secondaryCard: {
    backgroundColor: '#42c767',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardIcon: {
    fontSize: 22,
  },
  quickActionTitle: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  quickActionDesc: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  statCard: {
    backgroundColor: '#fff',
    width: (width - 60) / 3,
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  mainCards: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  featureCard: {
    marginBottom: 12,
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  trendingCard: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#ff3b30',
  },
  discoverCard: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#34c759',
  },
  settingsCard: {
    backgroundColor: '#fff',
    borderLeftWidth: 4,
    borderLeftColor: '#007aff',
  },
  cardContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  featureIcon: {
    fontSize: 24,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    color: '#1a1a1a',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  featureSubtitle: {
    color: '#666',
    fontSize: 14,
  },
  cardArrow: {
    fontSize: 24,
    color: '#ccc',
    fontWeight: '300',
  },
  activitySection: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: 15,
  },
  activityCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  activityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  activityIcon: {
    fontSize: 18,
  },
  activityContent: {
    flex: 1,
  },
  activityTitle: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1a1a1a',
    marginBottom: 2,
  },
  activityTime: {
    fontSize: 13,
    color: '#999',
  },
  bottomSpacer: {
    height: 30,
  },
});
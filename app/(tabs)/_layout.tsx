import { Tabs } from 'expo-router';
import { View, StyleSheet, Pressable, Text, Platform } from 'react-native';
import { Colors } from '@/constants/colors';
import { Radius, Shadow, Spacing } from '@/constants/spacing';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';

function TabBar({ state, descriptors, navigation }: BottomTabBarProps) {
  const tabs = [
    { name: 'index', label: 'Home', icon: '⊙' },
    { name: 'transactions', label: 'Transactions', icon: '↕' },
    { name: 'categories', label: 'Categories', icon: '⊞' },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {state.routes.map((route, i) => {
          const tab = tabs.find((t) => t.name === route.name) ?? tabs[i];
          const isFocused = state.index === i;

          return (
            <Pressable
              key={route.key}
              style={styles.tab}
              onPress={() => {
                if (!isFocused) navigation.navigate(route.name);
              }}
            >
              <View style={[styles.iconWrap, isFocused && styles.iconWrapActive]}>
                <Text style={[styles.icon, isFocused && styles.iconActive]}>{tab.icon}</Text>
              </View>
              <Text style={[styles.label, isFocused && styles.labelActive]}>
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs tabBar={(props) => <TabBar {...props} />} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="index" />
      <Tabs.Screen name="transactions" />
      <Tabs.Screen name="categories" />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    paddingHorizontal: Spacing.base,
    paddingBottom: Platform.OS === 'ios' ? 24 : Spacing.base,
    paddingTop: Spacing.sm,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    gap: 3,
  },
  iconWrap: {
    width: 44,
    height: 32,
    borderRadius: Radius.sm,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconWrapActive: {
    backgroundColor: Colors.brandLight,
  },
  icon: {
    fontSize: 18,
    color: Colors.textTertiary,
  },
  iconActive: {
    color: Colors.brand,
  },
  label: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textTertiary,
  },
  labelActive: {
    color: Colors.brand,
    fontWeight: '600',
  },
});

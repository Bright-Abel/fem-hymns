import { clsx } from 'clsx';
import { Tabs } from 'expo-router';
import { HeartPlus, House, Settings } from 'lucide-react-native';
import { Text, View } from 'react-native';

import { tabs } from '@/constants/data';
import { components } from '@/constants/theme';
import { useSettings } from '@/context/SettingsContext';

const tabBar = components.tabBar;

// Church brand color tokens from the logo
export const BRAND_COLORS = {
  activeIcon: '#005697', // Royal Blue (Logo Primary)
  inactiveDark: '#64748B', // Slate Inactive (Dark Mode)
  inactiveLight: '#94A3B8', // Slate Inactive (Light Mode)
  activeText: '#005697', // Royal Blue Text
  darkBg: '#132032', // Deep Slate/Blue Card (Dark Mode)
  lightBg: '#FFFFFF', // Clean White (Light Mode)
  darkBorder: '#1D2F47', // Divider in Dark Mode
  lightBorder: '#E2E8F0', // Divider in Light Mode
};

interface TabIconProps {
  focused: boolean;
  title: string;
  isDark: boolean;
}

const TabIcon = ({ focused, title, isDark }: TabIconProps) => {
  const iconColor = focused
    ? BRAND_COLORS.activeIcon
    : isDark
      ? BRAND_COLORS.inactiveDark
      : BRAND_COLORS.inactiveLight;

  return (
    <View className='gap-1 items-center justify-center'>
      <View className='size-17 items-center justify-center'>
        {title === 'Home' ? (
          <House color={iconColor} size={24} strokeWidth={focused ? 2.5 : 2} />
        ) : title === 'Settings' ? (
          <Settings
            color={iconColor}
            size={24}
            strokeWidth={focused ? 2.5 : 2}
          />
        ) : (
          <HeartPlus
            color={iconColor}
            size={24}
            strokeWidth={focused ? 2.5 : 2}
          />
        )}
      </View>
      <Text
        className={clsx(
          'text-xs font-rubik',
          focused
            ? 'text-brand-blue font-rubik-bold'
            : isDark
              ? 'text-slate-400'
              : 'text-slate-500',
        )}
      >
        {title}
      </Text>
    </View>
  );
};

const TabsLayout = () => {
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          height: tabBar.height,
          backgroundColor: isDark ? BRAND_COLORS.darkBg : BRAND_COLORS.lightBg,
          borderTopWidth: 1,
          borderTopColor: isDark
            ? BRAND_COLORS.darkBorder
            : BRAND_COLORS.lightBorder,
          // iOS Shadow
          shadowColor: isDark ? '#000000' : '#64748B',
          shadowOffset: { width: 0, height: -4 },
          shadowOpacity: isDark ? 0.3 : 0.08,
          shadowRadius: 12,
          // Android Shadow
          elevation: 12,
        },
        tabBarItemStyle: {
          paddingVertical: tabBar.height / 2 - tabBar.iconFrame / 1.6,
        },
        tabBarIconStyle: {
          width: tabBar.iconFrame,
          height: tabBar.iconFrame,
          alignItems: 'center',
        },
      }}
    >
      {tabs.map((item) => (
        <Tabs.Screen
          key={item.name}
          name={item.name}
          options={{
            title: item.title,
            tabBarIcon: ({ focused }) => (
              <TabIcon focused={focused} title={item.title} isDark={isDark} />
            ),
          }}
        />
      ))}
    </Tabs>
  );
};

export default TabsLayout;

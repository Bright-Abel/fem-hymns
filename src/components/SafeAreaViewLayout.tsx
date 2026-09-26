import { clsx } from 'clsx';
import { Platform, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useSettings } from '@/context/SettingsContext';

const SafeAreaViewLayout = ({
  children,
  className,
  statusBG,
  barStyle,
  background,
  edges = ['top', 'right', 'bottom', 'left'],
  ...safeAreaProps
}: SafeAreaViewLayoutProps) => {
  const { theme } = useSettings();
  const isDark = theme === 'dark';
  const surface = background ?? (isDark ? '#0B131F' : '#F8FAFC');
  const statusBarColor = statusBG ?? surface;
  const resolvedBarStyle =
    barStyle ?? (isDark ? 'light-content' : 'dark-content');

  return (
    <SafeAreaView
      {...safeAreaProps}
      edges={edges}
      className={clsx('flex-1', className)}
      style={{
        backgroundColor: surface,
        paddingHorizontal: 16,
        paddingTop: 8,
        // ...(Platform.OS === 'android' ? { paddingTop: 8 } : null),
      }}
    >
      <StatusBar
        animated
        barStyle={resolvedBarStyle}
        backgroundColor={statusBarColor}
        translucent={Platform.OS === 'android'}
      />
      {children}
    </SafeAreaView>
  );
};

export default SafeAreaViewLayout;

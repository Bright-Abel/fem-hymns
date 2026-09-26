import { Text, View } from 'react-native';

import AllSongHeader from '@/components/all-songs/AllSongHeader';
import SafeAreaViewLayout from '@/components/SafeAreaViewLayout';
import { useSettings } from '@/context/SettingsContext';

const About = () => {
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  return (
    <SafeAreaViewLayout>
      <AllSongHeader isDark={isDark} text='About' />

      {/* Body Content */}
      <View className='flex-1 px-6 pt-8'>
        <Text className='text-lg font-rubik text-[#3B4262] dark:text-slate-200 leading-8 tracking-wide'>
          This App was developed to uplift you and edify you, help your
          spiritual growth, and assist in personal fellowship with the Lord.
        </Text>
      </View>
    </SafeAreaViewLayout>
  );
};

export default About;

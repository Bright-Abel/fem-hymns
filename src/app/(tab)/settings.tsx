// src/screens/SettingsScreen.tsx
import Slider from '@react-native-community/slider';
import { FastForward, FileMusic, Repeat } from 'lucide-react-native';
import { ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';

import SafeAreaViewLayout from '@/components/SafeAreaViewLayout';
import { useSettings } from '@/context/SettingsContext';

const Settings = () => {
  const {
    horizontalScroll,
    setHorizontalScroll,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    repeatAudioByStanza,
    setRepeatAudioByStanza,
    autoPlayAudio,
    setAutoPlayAudio,
  } = useSettings();

  const isDark = theme === 'dark';
  const iconColor = isDark ? '#FFFFFF' : '#005697';

  return (
    <SafeAreaViewLayout>
      {/* Header px-5 pt-4 pb-3 */}
      <View className=' border-b border-slate-200 dark:border-brand-dark-border'>
        <Text className='text-3xl font-extrabold text-brand-blue font-rubik-bold tracking-tight'>
          Settings
        </Text>
      </View>

      <ScrollView
        className='flex-1 px-5'
        contentContainerStyle={{ paddingVertical: 20, paddingBottom: 60 }}
        showsVerticalScrollIndicator={false}
      >
        {/* SECTION 1: GENERAL */}
        <Text className='text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400 tracking-wider mb-4 font-rubik-bold'>
          GENERAL
        </Text>

        <View className='flex-row items-center justify-between py-3'>
          <View className='flex-row items-center flex-1 pr-3'>
            <FastForward color={iconColor} size={20} />
            <Text className='text-base font-rubik-medium text-slate-900 dark:text-white ml-3'>
              Horizontal Scroll Numbers
            </Text>
          </View>
          <Switch
            value={horizontalScroll}
            onValueChange={setHorizontalScroll}
            trackColor={{
              false: isDark ? '#1D2F47' : '#CBD5E1',
              true: '#005697',
            }}
            thumbColor='#FFFFFF'
          />
        </View>

        <View className='h-[1px] bg-slate-200 dark:bg-brand-dark-border my-4' />

        {/* SECTION 2: THEME */}
        <Text className='text-base font-rubik-semibold text-slate-900 dark:text-white mb-1'>
          Select Theme
        </Text>
        <Text className='text-xs text-slate-500 dark:text-slate-400 mb-3 font-rubik'>
          {isDark ? 'Dark Theme' : 'Light Theme'}
        </Text>

        {/* Light Option */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setTheme('light')}
          className='flex-row items-center justify-between py-3.5'
        >
          <Text className='text-base font-rubik text-slate-900 dark:text-white'>
            Light Theme
          </Text>
          <View
            className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
              !isDark ? 'border-brand-blue' : 'border-slate-500'
            }`}
          >
            {!isDark && (
              <View className='w-2.5 h-2.5 rounded-full bg-brand-blue' />
            )}
          </View>
        </TouchableOpacity>

        <View className='h-[1px] bg-slate-100 dark:bg-white/5 my-1' />

        {/* Dark Option */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setTheme('dark')}
          className='flex-row items-center justify-between py-3.5'
        >
          <Text className='text-base font-rubik text-slate-900 dark:text-white'>
            Dark Theme
          </Text>
          <View
            className={`w-5 h-5 rounded-full border-2 items-center justify-center ${
              isDark ? 'border-brand-blue' : 'border-slate-400'
            }`}
          >
            {isDark && (
              <View className='w-2.5 h-2.5 rounded-full bg-brand-blue' />
            )}
          </View>
        </TouchableOpacity>

        <View className='h-[1px] bg-slate-200 dark:bg-brand-dark-border my-4' />

        {/* SECTION 3: FONT SETTING */}
        <Text className='text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400 tracking-wider mb-3 font-rubik-bold'>
          FONT SETTING
        </Text>

        <View className='mb-2'>
          <Text className='text-base font-rubik text-slate-900 dark:text-white mb-1'>
            Font Size
          </Text>
          <Text className='text-xl font-bold text-brand-blue font-rubik-bold'>
            {fontSize.toFixed(2)}
          </Text>
        </View>

        {/* Slider (14 to 36) */}
        <View className='py-2'>
          <Slider
            style={{ width: '100%', height: 40 }}
            minimumValue={14}
            maximumValue={36}
            step={1}
            value={fontSize}
            onValueChange={setFontSize}
            minimumTrackTintColor='#005697'
            maximumTrackTintColor={isDark ? '#1D2F47' : '#CBD5E1'}
            thumbTintColor={isDark ? '#FFFFFF' : '#005697'}
          />
        </View>

        <View className='h-[1px] bg-slate-200 dark:bg-brand-dark-border my-4' />

        {/* SECTION 4: AUDIO SETTING */}
        <Text className='text-xs uppercase font-extrabold text-slate-500 dark:text-slate-400 tracking-wider mb-4 font-rubik-bold'>
          AUDIO SETTING
        </Text>

        {/* Repeat Audio Switch */}
        <View className='flex-row items-center justify-between py-3'>
          <View className='flex-row items-center flex-1 pr-3'>
            <Repeat size={22} color={iconColor} />
            <Text className='text-base font-rubik-medium text-slate-900 dark:text-white ml-3 flex-1'>
              Repeat Audio base on the number of stanza
            </Text>
          </View>
          <Switch
            value={repeatAudioByStanza}
            onValueChange={setRepeatAudioByStanza}
            trackColor={{
              false: isDark ? '#1D2F47' : '#CBD5E1',
              true: '#005697',
            }}
            thumbColor='#FFFFFF'
          />
        </View>

        {/* Auto Play Audio Switch */}
        <View className='flex-row items-center justify-between py-3'>
          <View className='flex-row items-center flex-1 pr-3'>
            <FileMusic size={22} color={iconColor} />
            <Text className='text-base font-rubik-medium text-slate-900 dark:text-white ml-3'>
              Auto Play Audio
            </Text>
          </View>
          <Switch
            value={autoPlayAudio}
            onValueChange={setAutoPlayAudio}
            trackColor={{
              false: isDark ? '#1D2F47' : '#CBD5E1',
              true: '#E31D2B',
            }}
            thumbColor='#FFFFFF'
          />
        </View>
      </ScrollView>
    </SafeAreaViewLayout>
  );
};

export default Settings;

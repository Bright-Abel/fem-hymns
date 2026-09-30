import { Music4 } from 'lucide-react-native';
import { ScrollView, Text, View } from 'react-native';

import SafeAreaViewLayout from '@/components/SafeAreaViewLayout';
import { HymnLyrics } from '@/components/hymn/HymnLyrics';
import { churchAnthem } from '@/constants/data';
import { useSettings } from '@/context/SettingsContext';
import AllSongHeader from '../all-songs/AllSongHeader';

const anthem = churchAnthem;

const stanzas: StanzaItem[] = anthem.stanzas.map((stanza, index) => ({
  id: stanza.id,
  stanza_number: stanza.stanza_number ?? index + 1,
  is_chorus: stanza.is_chorus,
  sequence: index,
  text: stanza.text,
}));

export default function ChurchAnthemComp() {
  const { theme, fontSize } = useSettings();
  const isDark = theme === 'dark';

  return (
    <SafeAreaViewLayout>
      <AllSongHeader isDark={isDark} text='Church Anthem' />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className='flex-1'
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <View className='px-5 pt-4'>
          <View className='rounded-[28px] border border-brand-blue/20 bg-brand-blue-surface p-5 dark:bg-brand-blue/10'>
            <View className='mb-3 flex-row items-center'>
              <View className='mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-brand-blue dark:bg-brand-blue/30'>
                <Music4 size={22} color='#FFFFFF' />
              </View>
              <View className='flex-1'>
                <Text className='text-xs font-rubik-bold uppercase tracking-[1.5px] text-brand-blue dark:text-brand-blue-light'>
                  Anthem
                </Text>
                <Text className='text-xs font-rubik text-slate-500 dark:text-slate-400'>
                  {anthem.hymn.author}
                </Text>
              </View>
            </View>

            <Text className='text-2xl font-rubik-extrabold text-slate-900 dark:text-white'>
              {anthem.hymn.title}
            </Text>

            <View className='mt-4 flex-row flex-wrap items-center gap-2'>
              <Text className='rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-rubik-bold uppercase tracking-[1.2px] text-brand-blue dark:bg-slate-900/60 dark:text-brand-blue-light'>
                {anthem.hymn.category}
              </Text>
              {anthem.hymn.key_signature && (
                <Text className='rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-rubik-bold uppercase tracking-[1.2px] text-slate-700 dark:bg-slate-900/60 dark:text-slate-300'>
                  {anthem.hymn.key_signature}
                </Text>
              )}
              {anthem.hymn.meter && (
                <Text className='rounded-full bg-white/70 px-2.5 py-1 text-[10px] font-rubik-bold uppercase tracking-[1.2px] text-slate-700 dark:bg-slate-900/60 dark:text-slate-300'>
                  {anthem.hymn.meter}
                </Text>
              )}
            </View>
          </View>
        </View>

        <View className='px-5 pt-6'>
          <HymnLyrics stanzas={stanzas} fontSize={fontSize} />
        </View>
      </ScrollView>
    </SafeAreaViewLayout>
  );
}

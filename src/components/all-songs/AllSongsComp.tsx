// app/(home)/all-songs.tsx
import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import SafeAreaViewLayout from '@/components/SafeAreaViewLayout';
import { SearchInput } from '@/components/SearchInput';
import { handleSelectHymn } from '@/constants/function';
import { useSettings } from '@/context/SettingsContext';
import { getHymnsNumeric } from '@/services/hymnService';
import AllSongHeader from './AllSongHeader';

const AllSongsComp = () => {
  const db = useSQLiteContext();
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const [hymns, setHymns] = useState<HymnSummary[]>([]);

  useEffect(() => {
    async function loadHymns() {
      try {
        const data = await getHymnsNumeric(db, search);
        setHymns(data);
      } catch (e) {
        console.error('Failed to query hymns in All Songs screen:', e);
      }
    }
    loadHymns();
  }, [search, db]);

  return (
    <SafeAreaViewLayout>
      <AllSongHeader isDark={isDark} text='All Songs' />

      {/* Search Bar */}
      <View className='px-4 pt-4 pb-2'>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder='Search by title, number, or lyric...'
        />
      </View>

      {/* Sequential Hymn List */}
      <FlatList
        data={hymns}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingHorizontal: 16,
          paddingVertical: 12,
          paddingBottom: 40,
        }}
        ListEmptyComponent={
          <View className='items-center justify-center py-24'>
            <Text className='text-sm font-rubik text-slate-400'>
              No hymns found
            </Text>
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => handleSelectHymn(item.hymn_number)}
            className='flex-row items-center py-4 border-b border-slate-100 dark:border-brand-dark-border active:opacity-60'
          >
            {/* Circular Royal Blue Badge */}
            <View className='w-9 h-9 rounded-full bg-brand-blue-surface dark:bg-brand-blue/25 border border-brand-blue/20 items-center justify-center mr-4'>
              <Text className='text-xs font-rubik-bold text-brand-blue dark:text-white'>
                {item.hymn_number}
              </Text>
            </View>

            {/* Hymn Title */}
            <Text
              numberOfLines={1}
              className='text-base font-rubik-medium text-slate-900 dark:text-white flex-1 tracking-tight'
            >
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />
    </SafeAreaViewLayout>
  );
};

export default AllSongsComp;

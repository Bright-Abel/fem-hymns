import { useSQLiteContext } from 'expo-sqlite';
import { useEffect, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';

import AllSongHeader from '@/components/all-songs/AllSongHeader';
import SafeAreaViewLayout from '@/components/SafeAreaViewLayout';
import { SearchInput } from '@/components/SearchInput';
import { handleSelectHymn } from '@/constants/function';
import { useSettings } from '@/context/SettingsContext';
import { getHymnsNumeric } from '@/services/hymnService';

export default function NumbersScreen() {
  const db = useSQLiteContext();
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const [hymns, setHymns] = useState<HymnSummary[]>([]);

  useEffect(() => {
    async function loadData() {
      const data = await getHymnsNumeric(db, search);
      setHymns(data);
    }
    loadData();
  }, [db, search]);

  // const handleSelectHymn = (hymnNumber: number) => {
  //   router.push({
  //     pathname: '/hynm/[id]',
  //     params: { id: hymnNumber.toString() },
  //   });
  // };

  return (
    <SafeAreaViewLayout>
      <AllSongHeader isDark={isDark} text='Numbers Screen' />

      {/* Search Bar */}
      <View className='px-5 pt-4 pb-2'>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder='Search hymn number or text...'
        />
      </View>

      {/* 6-Column Numbers Grid */}
      <View className='flex-1 px-3 pt-2'>
        <FlatList
          data={hymns}
          keyExtractor={(item) => item.id.toString()}
          numColumns={6}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 8,
          }}
          ListEmptyComponent={
            <View className='items-center justify-center py-20'>
              <Text className='text-sm font-rubik text-slate-400'>
                No hymns found matching "{search}"
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => handleSelectHymn(item.hymn_number)}
              className='flex-1 mx-1 py-2.5 rounded-2xl items-center justify-center bg-white dark:bg-[#132032] border border-slate-200 dark:border-[#1D2F47] shadow-sm active:scale-95'
            >
              <Text className='text-[9px] font-rubik-bold uppercase tracking-wider text-brand-blue dark:text-slate-400'>
                SONG
              </Text>
              <Text className='text-base font-rubik-extrabold text-slate-900 dark:text-white mt-0.5'>
                {item.hymn_number}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>
    </SafeAreaViewLayout>
  );
}

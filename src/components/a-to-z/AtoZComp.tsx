import { useSettings } from '@/context/SettingsContext';
import { useRouter } from 'expo-router';
import { useSQLiteContext } from 'expo-sqlite';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  SectionList,
  SectionListProps,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import sectionListGetItemLayout from 'react-native-section-list-get-item-layout';
import AllSongHeader from '../all-songs/AllSongHeader';
import SafeAreaViewLayout from '../SafeAreaViewLayout';

import { SearchInput } from '@/components/SearchInput';

import { getHymnsAlphabetical } from '@/services/hymnService';
import HymnRowItem from './HymnRowItem';

const ITEM_HEIGHT = 58;
const HEADER_HEIGHT = 42;

interface HymnSection {
  title: string;
  data: HymnSummary[];
}

const AtoZComp = () => {
  const router = useRouter();
  const db = useSQLiteContext();
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  const [search, setSearch] = useState('');
  const [hymns, setHymns] = useState<HymnSummary[]>([]);
  const sectionListRef = useRef<SectionList<HymnSummary, HymnSection>>(null);
  const pendingSectionRef = useRef<number | null>(null);

  useEffect(() => {
    async function loadHymns() {
      try {
        const data = await getHymnsAlphabetical(db, search);
        setHymns(data);
      } catch (e) {
        console.error('Failed to load alphabetical hymns:', e);
      }
    }
    loadHymns();
  }, [search, db]);

  const sections = useMemo(() => {
    const grouped: { [key: string]: HymnSummary[] } = {};

    hymns.forEach((hymn) => {
      const firstChar = hymn.title.trim().charAt(0).toUpperCase();
      const letter = /[A-Z]/.test(firstChar) ? firstChar : '#';
      if (!grouped[letter]) {
        grouped[letter] = [];
      }
      grouped[letter].push(hymn);
    });

    const keys = Object.keys(grouped).filter((key) => grouped[key].length > 0);

    // Sort A-Z first, then place '#' at the end
    keys.sort((a, b) => {
      if (a === '#') return 1;
      if (b === '#') return -1;
      return a.localeCompare(b);
    });

    return keys.map((letter) => ({
      title: letter,
      data: grouped[letter],
    }));
  }, [hymns]);

  const handleSelectHymn = useCallback(
    (hymnNumber: number) => {
      router.push({
        pathname: '/hynm/[id]',
        params: { id: hymnNumber.toString() },
      });
    },
    [router],
  );

  const getItemLayout = useMemo<
    NonNullable<SectionListProps<HymnSummary, HymnSection>['getItemLayout']>
  >(() => {
    const calculateLayout = sectionListGetItemLayout({
      getItemHeight: () => ITEM_HEIGHT,
      getSectionHeaderHeight: () => HEADER_HEIGHT,
      getSectionFooterHeight: () => 0,
      listHeaderHeight: 0,
    });

    return (data, index) => calculateLayout(data ?? [], index);
  }, []);

  const scrollToSection = useCallback(
    (sectionIndex: number) => {
      if (!sectionListRef.current || !sections[sectionIndex]) return;

      pendingSectionRef.current = sectionIndex;
      sectionListRef.current.scrollToLocation({
        sectionIndex,
        itemIndex: 0,
        animated: true,
      });
    },
    [sections],
  );
  return (
    <SafeAreaViewLayout>
      <AllSongHeader isDark={isDark} text='All Songs' />

      <View className='px-4 pt-4 pb-2'>
        <SearchInput
          value={search}
          onChangeText={setSearch}
          placeholder='Search by title, number, or lyric...'
        />
      </View>

      {/* Section List & Quick Scroll Strip */}
      <View className='flex-1 flex-row'>
        <SectionList
          ref={sectionListRef}
          sections={sections}
          keyExtractor={(item) => item.id.toString()}
          getItemLayout={getItemLayout}
          onScrollToIndexFailed={() => {
            const sectionIndex = pendingSectionRef.current;
            if (sectionIndex === null) return;

            requestAnimationFrame(() => {
              sectionListRef.current?.scrollToLocation({
                sectionIndex,
                itemIndex: 0,
                animated: true,
              });
            });
          }}
          showsVerticalScrollIndicator={false}
          initialNumToRender={20}
          maxToRenderPerBatch={30}
          windowSize={11}
          contentContainerStyle={{
            paddingLeft: 16,
            paddingRight: 36,
            paddingBottom: 40,
          }}
          ListEmptyComponent={
            <View className='items-center justify-center py-24'>
              <Text className='text-sm font-rubik text-slate-400'>
                No hymns found
              </Text>
            </View>
          }
          renderSectionHeader={({ section: { title } }) => (
            <View
              style={{ height: HEADER_HEIGHT }}
              className='bg-brand-light-bg dark:bg-brand-dark-bg justify-center'
            >
              <View className='flex-row items-center'>
                <Text className='text-lg font-rubik-extrabold text-brand-blue dark:text-brand-blue-light'>
                  {title}
                </Text>
                <View className='flex-1 h-[1px] bg-slate-200 dark:bg-brand-dark-border ml-3' />
              </View>
            </View>
          )}
          renderItem={({ item }) => (
            <HymnRowItem item={item} onPress={handleSelectHymn} />
          )}
        />

        {/* Quick Letter Navigation Strip */}
        {!search && sections.length > 0 && (
          <View className='absolute right-0 top-0 bottom-4 justify-center items-center py-2 px-1'>
            {sections.map((sec, idx) => (
              <TouchableOpacity
                key={sec.title}
                hitSlop={{ top: 8, bottom: 8, left: 12, right: 12 }}
                onPress={() => scrollToSection(idx)}
                className='py-0.5 px-1.5 items-center justify-center'
              >
                <Text className='text-[11px] font-rubik-bold text-slate-400 dark:text-slate-500 active:text-brand-blue'>
                  {sec.title}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    </SafeAreaViewLayout>
  );
};

export default AtoZComp;

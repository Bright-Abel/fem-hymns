import { Bookmark, Heart } from 'lucide-react-native';
import { Text, View } from 'react-native';

import type { TabType } from './favoriteTypes';

export function EmptySavedState({ activeTab }: { activeTab: TabType }) {
  return (
    <View className='items-center justify-center px-6 py-28'>
      <View className='mb-4 h-16 w-16 items-center justify-center rounded-full bg-brand-blue-surface dark:bg-brand-blue/20'>
        {activeTab === 'favorites' ? (
          <Heart size={30} color='#005697' />
        ) : (
          <Bookmark size={30} color='#005697' />
        )}
      </View>
      <Text className='text-center text-base font-rubik-bold text-slate-800 dark:text-white'>
        No {activeTab} yet
      </Text>
      <Text className='mt-1 text-center text-xs font-rubik leading-5 text-slate-400 dark:text-slate-500'>
        {activeTab === 'favorites'
          ? 'Tap the heart icon on any hymn to keep your favorite songs here.'
          : 'Tap the bookmark icon on any hymn to mark it for quick access.'}
      </Text>
    </View>
  );
}

import { Trash2 } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

import type { SavedRowProps } from './favoriteTypes';

export function SavedHymnRow({
  item,
  isDark,
  onPress,
  onRemove,
}: SavedRowProps) {
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => onPress(item.hymn_number)}
      className='flex-row items-center border-b border-slate-100 py-4 active:opacity-60 dark:border-brand-dark-border/60'
    >
      <View className='mr-3.5 h-9 w-9 items-center justify-center rounded-full border border-brand-blue/20 bg-brand-blue-surface dark:bg-brand-blue/20'>
        <Text className='text-xs font-rubik-bold text-brand-blue dark:text-white'>
          {item.hymn_number}
        </Text>
      </View>

      <View className='mr-2 flex-1'>
        <Text
          numberOfLines={1}
          className='text-base font-rubik-medium tracking-tight text-slate-900 dark:text-white'
        >
          {item.title}
        </Text>
        {item.category && (
          <Text className='mt-0.5 text-[11px] font-rubik-medium uppercase tracking-wider text-brand-red'>
            {item.category}
          </Text>
        )}
      </View>

      <TouchableOpacity
        onPress={() => onRemove(item)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        className='rounded-full p-2 active:bg-slate-200 dark:active:bg-slate-800'
      >
        <Trash2 size={18} color={isDark ? '#64748B' : '#94A3B8'} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

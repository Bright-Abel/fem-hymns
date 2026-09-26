import { Link } from 'expo-router';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Heart,
  Settings,
} from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

export function HymnHeader({
  hymnNumber,
  isDark,
  onBack,
  onPrevious,
  onNext,
  handleToggleBookmark,
  handleToggleFavorite,
  isBookmarked,
  isFavorite,
}: HymnHeaderProps) {
  const mutedIcon = isDark ? '#94A3B8' : '#005697';

  return (
    <View className='flex-row w-full items-center justify-between pt-2 pb-3 border-b border-slate-200 dark:border-brand-dark-border'>
      <TouchableOpacity
        activeOpacity={0.7}
        accessibilityRole='button'
        accessibilityLabel='Go back'
        onPress={onBack}
        className='p-1 -ml-1 rounded-full'
      >
        <ChevronLeft size={28} color={isDark ? '#FFFFFF' : '#005697'} />
      </TouchableOpacity>

      <View className='flex-row items-center space-x-2'>
        <TouchableOpacity
          disabled={hymnNumber <= 1}
          accessibilityRole='button'
          accessibilityLabel='Previous hymn'
          onPress={onPrevious}
          className={`p-1.5 rounded-full ${hymnNumber <= 1 ? 'opacity-30' : 'active:bg-slate-200 dark:active:bg-slate-800'}`}
        >
          <ChevronLeft size={20} color={mutedIcon} />
        </TouchableOpacity>

        <View className='px-3 py-1 rounded-full bg-brand-blue-surface dark:bg-brand-blue/20'>
          <Text className='text-xs font-rubik-bold text-brand-blue dark:text-brand-blue-light'>
            HYMN {hymnNumber}
          </Text>
        </View>

        <TouchableOpacity
          disabled={hymnNumber >= 300}
          accessibilityRole='button'
          accessibilityLabel='Next hymn'
          onPress={onNext}
          className={`p-1.5 rounded-full ${hymnNumber >= 300 ? 'opacity-30' : 'active:bg-slate-200 dark:active:bg-slate-800'}`}
        >
          <ChevronRight size={20} color={mutedIcon} />
        </TouchableOpacity>
      </View>

      <View className='flex-row items-center space-x-1'>
        <TouchableOpacity
          onPress={handleToggleFavorite}
          activeOpacity={0.7}
          className='p-2 rounded-full active:bg-slate-200 dark:active:bg-slate-800'
        >
          <Heart
            size={22}
            color={isFavorite ? '#E31D2B' : isDark ? '#94A3B8' : '#64748B'}
            fill={isFavorite ? '#E31D2B' : 'none'}
          />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleToggleBookmark}
          activeOpacity={0.7}
          className='p-2 rounded-full active:bg-slate-200 dark:active:bg-slate-800'
        >
          <Bookmark
            size={22}
            color={isBookmarked ? '#005697' : isDark ? '#94A3B8' : '#64748B'}
            fill={isBookmarked ? (isDark ? '#38BDF8' : '#005697') : 'none'}
          />
        </TouchableOpacity>

        <Link href={'/(tab)/settings'} asChild>
          <Settings size={24} color={isDark ? '#FFFFFF' : '#005697'} />
        </Link>
      </View>

      {/* <View className='w-7' /> */}
    </View>
  );
}

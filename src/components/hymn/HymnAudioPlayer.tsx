import { Music, Pause, Play, RotateCcw } from 'lucide-react-native';
import { Text, TouchableOpacity, View } from 'react-native';

interface HymnAudioPlayerProps {
  hymnNumber: number;
  isDark: boolean;
  isPlaying: boolean;
  repeatAudioByStanza: boolean;
  repeatCount: number;
  totalVerses: number;
  onRestart: () => void;
  onToggle: () => void;
}

export function HymnAudioPlayer({
  hymnNumber,
  isDark,
  isPlaying,
  repeatAudioByStanza,
  repeatCount,
  totalVerses,
  onRestart,
  onToggle,
}: HymnAudioPlayerProps) {
  return (
    <View className='absolute bottom-6 left-6 right-6 bg-brand-light-card dark:bg-brand-dark-card border border-slate-200 dark:border-brand-dark-border rounded-3xl p-4 shadow-xl flex-row items-center justify-between'>
      <View className='flex-row items-center flex-1 mr-3'>
        <View className='w-10 h-10 rounded-2xl bg-brand-blue-surface dark:bg-brand-blue/20 items-center justify-center mr-3'>
          <Music size={20} color={isDark ? '#38BDF8' : '#005697'} />
        </View>
        <View className='flex-1'>
          <Text
            numberOfLines={1}
            className='text-xs font-rubik-bold text-slate-900 dark:text-white'
          >
            Hymn Tune #{hymnNumber}
          </Text>
          {repeatAudioByStanza && (
            <Text className='text-[10px] font-rubik text-brand-red'>
              Repeat active ({repeatCount + 1}/{totalVerses})
            </Text>
          )}
        </View>
      </View>

      <View className='flex-row items-center space-x-2'>
        <TouchableOpacity
          accessibilityRole='button'
          accessibilityLabel='Restart hymn audio'
          onPress={onRestart}
          className='p-2 rounded-full bg-slate-100 dark:bg-brand-dark-surface active:opacity-60'
        >
          <RotateCcw size={16} color={isDark ? '#FFFFFF' : '#005697'} />
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole='button'
          accessibilityLabel={
            isPlaying ? 'Pause hymn audio' : 'Play hymn audio'
          }
          onPress={onToggle}
          className='w-12 h-12 rounded-full bg-brand-blue items-center justify-center active:scale-95 shadow-md'
        >
          {isPlaying ? (
            <Pause size={20} color='#FFFFFF' />
          ) : (
            <Play size={20} color='#FFFFFF' />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

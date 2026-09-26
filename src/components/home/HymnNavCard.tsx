import { useSettings } from '@/context/SettingsContext';
import { ArrowRight } from 'lucide-react-native';
// import { Ionicons } from '@expo/vector-icons';
import { Text, TouchableOpacity, View } from 'react-native';

export function HymnNavCard({
  title,
  subtitle,
  icon,
  badgeText,
  accent = 'blue',
  onPress,
}: HymnNavCardProps) {
  const { theme } = useSettings();
  const isDark = theme === 'dark';
  const isRed = accent === 'red';

  // Dynamic icon colors
  //   const iconColor = isRed
  //     ? isDark
  //       ? '#F87171'
  //       : '#E31D2B'
  //     : isDark
  //       ? '#38BDF8'
  //       : '#005697';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      className='bg-white dark:bg-[#132032] border border-slate-200 dark:border-[#1D2F47] rounded-3xl p-5 mb-4 flex-row items-center justify-between shadow-sm active:scale-[0.99] transition-transform'
    >
      <View className='flex-row items-center flex-1 mr-3'>
        {/* Leading Icon Circle / Box */}
        <View
          className={`w-12 h-12 rounded-2xl items-center justify-center mr-4 ${
            isRed
              ? 'bg-[#FDE8E9] dark:bg-[rgba(227,29,43,0.2)]'
              : 'bg-[#EBF4FB] dark:bg-[rgba(0,86,151,0.25)]'
          }`}
        >
          {icon}
        </View>

        {/* Text Container */}
        <View className='flex-1'>
          <View className='flex-row items-center'>
            <Text className='text-lg font-rubik-bold text-slate-900 dark:text-white tracking-tight'>
              {title}
            </Text>
            {badgeText && (
              <View
                className={`px-2 py-0.5 rounded-full ml-2 ${
                  isRed
                    ? 'bg-[#FDE8E9] dark:bg-[rgba(227,29,43,0.25)]'
                    : 'bg-[#EBF4FB] dark:bg-[rgba(0,86,151,0.25)]'
                }`}
              >
                <Text
                  className={`text-[10px] font-rubik-bold uppercase ${
                    isRed
                      ? 'text-[#E31D2B] dark:text-[#F87171]'
                      : 'text-[#005697] dark:text-[#38BDF8]'
                  }`}
                >
                  {badgeText}
                </Text>
              </View>
            )}
          </View>

          {subtitle && (
            <Text className='text-xs font-rubik text-slate-500 dark:text-slate-400 mt-0.5'>
              {subtitle}
            </Text>
          )}
        </View>
      </View>

      {/* Trailing Chevron */}
      <ArrowRight size={20} color={isDark ? '#64748B' : '#94A3B8'} />
    </TouchableOpacity>
  );
}

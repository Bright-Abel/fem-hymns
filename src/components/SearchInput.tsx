import { useSettings } from '@/context/SettingsContext';
import { Search, X } from 'lucide-react-native';
import {
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from 'react-native';

interface SearchInputProps extends TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  containerClassName?: string;
}

export function SearchInput({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search by hymn number or lyrics...',
  containerClassName = '',
  ...rest
}: SearchInputProps) {
  const { theme } = useSettings();
  const isDark = theme === 'dark';

  const handleClear = () => {
    onChangeText('');
    if (onClear) onClear();
  };

  return (
    <View
      className={`flex-row items-center bg-white dark:bg-[#132032] border border-slate-200 dark:border-[#1D2F47] rounded-2xl px-4 py-3 shadow-sm ${containerClassName}`}
    >
      <Search
        size={18}
        color={isDark ? '#64748B' : '#005697'}
        style={{ marginRight: 8 }}
      />
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={isDark ? '#64748B' : '#94A3B8'}
        className='flex-1 text-base font-rubik text-slate-900 dark:text-white p-0'
        returnKeyType='search'
        autoCapitalize='none'
        autoCorrect={false}
        {...rest}
      />
      {value.length > 0 && (
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={handleClear}
          className='p-1 rounded-full bg-slate-100 dark:bg-slate-800 ml-2'
        >
          <X size={14} color={isDark ? '#94A3B8' : '#64748B'} />
        </TouchableOpacity>
      )}
    </View>
  );
}

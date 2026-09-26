import { Text, View } from 'react-native';

interface HymnLyricsProps {
  stanzas: StanzaItem[];
  fontSize: number;
}

export function HymnLyrics({ stanzas, fontSize }: HymnLyricsProps) {
  return (
    <View>
      {stanzas.map((stanza) => {
        const lines = stanza.text.split('\n').map((line) => line.trim());

        if (stanza.is_chorus === 1) {
          return (
            <View
              key={stanza.id}
              className='my-4 p-5 rounded-2xl bg-brand-blue-surface/60 dark:bg-brand-blue/10 border-l-4 border-brand-blue'
            >
              <Text className='text-xs uppercase font-rubik-bold text-brand-blue dark:text-brand-blue-light mb-2'>
                Chorus
              </Text>
              {lines.map((line, index) => (
                <Text
                  key={`${stanza.id}-${index}`}
                  style={{ fontSize, lineHeight: fontSize * 1.5 }}
                  className='font-rubik-medium italic text-slate-800 dark:text-slate-200'
                >
                  {line}
                </Text>
              ))}
            </View>
          );
        }

        return (
          <View key={stanza.id} className='mb-6'>
            <View className='flex-row items-center mb-2'>
              <View className='w-6 h-6 rounded-full bg-slate-200 dark:bg-brand-dark-surface items-center justify-center mr-2'>
                <Text className='text-[11px] font-rubik-bold text-slate-700 dark:text-slate-300'>
                  {stanza.stanza_number}
                </Text>
              </View>
            </View>

            <View className='pl-8'>
              {lines.map((line, index) => (
                <Text
                  key={`${stanza.id}-${index}`}
                  style={{ fontSize, lineHeight: fontSize * 1.55 }}
                  className='font-rubik text-slate-900 dark:text-slate-100 mb-0.5'
                >
                  {line}
                </Text>
              ))}
            </View>
          </View>
        );
      })}
    </View>
  );
}

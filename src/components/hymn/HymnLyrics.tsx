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
        const verseNumber = stanza.stanza_number ?? 1;

        if (stanza.is_chorus === 1) {
          return (
            <View
              key={stanza.id}
              className='mb-4 rounded-2xl border-l-4 border-brand-blue bg-brand-blue-surface/60 p-5 dark:bg-brand-blue/10'
            >
              <Text className='mb-2 text-xs font-rubik-bold uppercase tracking-[0.2em] text-brand-blue dark:text-brand-blue-light'>
                Chorus
              </Text>
              {lines.map((line, index) => (
                <Text
                  key={`${stanza.id}-${index}`}
                  style={{ fontSize, lineHeight: fontSize * 1.5 }}
                  className='italic   text-slate-800 dark:text-slate-200'
                >
                  {line}
                </Text>
              ))}
            </View>
          );
        }

        return (
          <View key={stanza.id} className='mb-4'>
            <Text className=' text-[11px] font-rubik-bold uppercase tracking-[0.2em] text-brand-blue dark:text-brand-blue-light'>
              Verse {verseNumber}
            </Text>

            <View>
              {lines.map((line, index) => (
                <Text
                  key={`${stanza.id}-${index}`}
                  style={{ fontSize, lineHeight: fontSize * 1.55 }}
                  className='mb-0.5 font-rubik-medium italic text-slate-900 dark:text-slate-100'
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

import { SQLiteProvider } from 'expo-sqlite';
import React, { useState } from 'react';
import { Text, View } from 'react-native';

const DB_NAME = 'hymnal.db';

export function DatabaseProvider({ children }: { children: React.ReactNode }) {
  const [error, setError] = useState<string | null>(null);

  if (error) {
    return (
      <View className='flex-1 justify-center items-center bg-white dark:bg-[#121212] p-6'>
        <Text className='text-red-500 font-bold text-center'>{error}</Text>
      </View>
    );
  }

  return (
    <SQLiteProvider
      databaseName={DB_NAME}
      assetSource={{ assetId: require('../../assets/hymnal.db') }}
      onError={(databaseError) => {
        console.error('Database setup error:', databaseError);
        setError(databaseError.message || 'Failed to initialize database');
      }}
    >
      {children}
    </SQLiteProvider>
  );
}

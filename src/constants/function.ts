import { router } from 'expo-router';

export const handleSelectHymn = (hymnNumber: number) => {
  router.push({
    pathname: '/hynm/[id]',
    params: { id: hymnNumber.toString() },
  });
};

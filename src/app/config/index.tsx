import { useQuery } from '@tanstack/react-query';
import { Pressable, Text } from 'react-native';
import { getInstallerAppConfig } from '~/data/installer-app-config';

export default function ConfigPage() {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['installer-app-config'],
    queryFn: getInstallerAppConfig
  });

  if (isLoading) {
    return <Text>Loading...</Text>;
  }

  if (!data) {
    return <Text>No data</Text>;
  }

  return (
    <Pressable onPress={() => refetch()}>
      <Text>Fetch config</Text>
      <Text>{JSON.stringify(data)}</Text>
    </Pressable>
  );
}

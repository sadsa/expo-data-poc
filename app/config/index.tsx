import { Pressable, Text } from 'react-native';
import { getInstallerAppConfig } from '~/data/installer-app-config';

async function fetchConfig() {
  const data = await getInstallerAppConfig();
  alert(JSON.stringify(data));
}

export default function ConfigPage() {
  return (
    <Pressable onPress={() => fetchConfig()}>
      <Text>Fetch config</Text>
    </Pressable>
  );
}

import { View } from 'react-native';
import { Link } from 'expo-router';

export default function Page() {
  return (
    <View>
      <Link href="/config">Installer App Config</Link>
    </View>
  );
}

import { View, Pressable, Text } from 'react-native';
import { Link } from 'expo-router';
import { useSession } from '~/context/session-provider';

export default function IndexPage() {
  const { signOut } = useSession();
  return (
    <View>
      <Text>Index Page</Text>
      <Link href="/config">
        <Text>Config</Text>
      </Link>
      <Pressable
        onPress={signOut}
        accessibilityRole="button"
        aria-label="Sign Out"
      >
        <Text>Sign Out</Text>
      </Pressable>
    </View>
  );
}

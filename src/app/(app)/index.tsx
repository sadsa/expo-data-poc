import { View, Pressable, Text } from 'react-native';
import { useSession } from '~/context/session-provider';

export default function IndexPage() {
  const { signOut } = useSession();
  return (
    <View>
      <Text>Index Page</Text>
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

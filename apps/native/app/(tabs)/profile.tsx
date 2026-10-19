import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { authClient } from "@/lib/auth-client";
import { DESIGN_TOKENS } from "@/lib/design-tokens";
import { useColorScheme } from "@/lib/use-color-scheme";
import { ConnectedAccounts } from "@/components/connected-accounts";

const { spacing, radius, typography, touchTarget } = DESIGN_TOKENS;

export default function ProfileScreen() {
  const { theme } = useColorScheme();
  const { data: session } = authClient.useSession();

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    setIsSigningOut(true);
    setError(null);

    try {
      const result = await authClient.signOut();

      if (result.error) {
        throw new Error(result.error.message);
      }
    } catch {
      setError("Unable to sign out. Please try again.");
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
    >
      <View style={styles.content}>
        <Text style={[styles.title, { color: theme.text }]}>Profile</Text>

        <View
          style={[
            styles.card,
            {
              backgroundColor: theme.card,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.name, { color: theme.text }]}>
            {session?.user.name || "Your account"}
          </Text>

          {session?.user.email ? (
            <Text style={[styles.email, { color: theme.mutedText }]}>
              {session.user.email}
            </Text>
          ) : null}
        </View>

        {error ? (
          <Text
            accessibilityRole="alert"
            style={[styles.error, { color: theme.notification }]}
          >
            {error}
          </Text>
        ) : null}

        <ConnectedAccounts />

        <Pressable
          accessibilityRole="button"
          accessibilityState={{
            disabled: isSigningOut,
            busy: isSigningOut,
          }}
          onPress={handleSignOut}
          disabled={isSigningOut}
          style={[
            styles.signOutButton,
            {
              backgroundColor: theme.primary,
              opacity: isSigningOut ? 0.6 : 1,
            },
          ]}
        >
          {isSigningOut ? (
            <ActivityIndicator color={theme.onPrimary} />
          ) : (
            <Text style={[styles.buttonText, { color: theme.onPrimary }]}>
              Sign out
            </Text>
          )}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
    padding: spacing.lg,
  },
  title: {
    fontSize: typography.title,
    fontWeight: "700",
  },
  card: {
    padding: spacing.md,
    borderWidth: 1,
    borderRadius: radius.md,
    gap: spacing.sm,
  },
  name: {
    fontSize: typography.body,
    fontWeight: "600",
  },
  email: {
    fontSize: typography.body,
  },
  error: {
    fontSize: typography.body,
  },
  signOutButton: {
    minHeight: touchTarget.minimum,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.md,
    borderRadius: radius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: typography.body,
    fontWeight: "600",
  },
});

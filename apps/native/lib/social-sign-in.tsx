import { useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";

import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";

export function SocialSignIn() {
  const { theme } = useColorScheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await authClient.signIn.social({
        provider: "google",
        callbackURL: "/",
      });

      if (result.error) {
        setError(result.error.message || "Google sign-in failed");
      }
    } catch {
      setError("Something went wrong with Google sign-in");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={{ gap: 12, marginTop: 16 }}>
      <Text style={{ textAlign: "center", color: theme.text }}>OR</Text>

      {error && <Text style={{ color: theme.notification }}>{error}</Text>}

      <TouchableOpacity
        onPress={handleGoogleSignIn}
        disabled={isLoading}
        style={{
          padding: 14,
          borderWidth: 1,
          borderColor: theme.border,
          alignItems: "center",
          opacity: isLoading ? 0.5 : 1,
        }}
      >
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={{ color: theme.text }}>Continue with Google</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

import { useCallback, useState } from "react";
import { useFocusEffect } from "expo-router";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

import { authClient } from "@/lib/auth-client";
import { useColorScheme } from "@/lib/use-color-scheme";

type Account = {
  providerId: string;
};

export function ConnectedAccounts() {
  const { theme } = useColorScheme();

  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLinking, setIsLinking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadAccounts = useCallback(async () => {
    try {
      const { data, error } = await authClient.listAccounts();

      if (error) {
        throw new Error(error.message);
      }

      setAccounts(data ?? []);
      setError(null);
    } catch {
      setError("Unable to load connected accounts.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      let active = true;

      const fetchAccounts = async () => {
        try {
          const { data, error } = await authClient.listAccounts();

          if (error) {
            throw new Error(error.message);
          }

          if (active) {
            setAccounts(data ?? []);
            setError(null);
          }
        } catch {
          if (active) {
            setError("Unable to load connected accounts.");
          }
        } finally {
          if (active) {
            setIsLoading(false);
          }
        }
      };

      void fetchAccounts();

      return () => {
        active = false;
      };
    }, []),
  );

  const handleConnectGoogle = async () => {
    if (isLinking || accounts.some((a) => a.providerId === "google")) {
      return;
    }

    setIsLinking(true);
    setError(null);

    try {
      const sessionResult = await authClient.getSession();

      console.log("Session before linking:", {
        hasSession: !!sessionResult.data?.session,
        userId: sessionResult.data?.user?.id,
        email: sessionResult.data?.user?.email,
        error: sessionResult.error?.message,
      });

      const { error } = await authClient.linkSocial({
        provider: "google",
        callbackURL: "/profile",
      });

      if (error) {
        throw new Error(error.message);
      }

      await loadAccounts();
    } catch {
      setError("Unable to connect Google. Please try again.");
    } finally {
      setIsLinking(false);
    }
  };

  const isGoogleConnected = accounts.some(
    (account) => account.providerId === "google",
  );

  const hasPassword = accounts.some(
    (account) => account.providerId === "credential",
  );

  return (
    <View style={{ gap: 16 }}>
      <Text
        style={{
          color: theme.text,
          fontWeight: "600",
          fontSize: 18,
        }}
      >
        Connected accounts
      </Text>

      {isLoading ? (
        <ActivityIndicator />
      ) : (
        <View style={{ gap: 16 }}>
          {hasPassword && (
            <Text style={{ color: theme.text }}>
              Email / Password — Connected
            </Text>
          )}

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={{ color: theme.text }}>Google</Text>

            {isGoogleConnected ? (
              <Text style={{ color: theme.mutedText }}>Connected</Text>
            ) : (
              <Pressable
                accessibilityRole="button"
                accessibilityState={{
                  disabled: isLinking,
                  busy: isLinking,
                }}
                disabled={isLinking}
                onPress={handleConnectGoogle}
                style={{
                  backgroundColor: theme.primary,
                  padding: 12,
                  borderRadius: 8,
                  opacity: isLinking ? 0.6 : 1,
                }}
              >
                {isLinking ? (
                  <ActivityIndicator color={theme.onPrimary} />
                ) : (
                  <Text style={{ color: theme.onPrimary }}>Connect Google</Text>
                )}
              </Pressable>
            )}
          </View>
        </View>
      )}

      {error && (
        <Text accessibilityRole="alert" style={{ color: theme.notification }}>
          {error}
        </Text>
      )}
    </View>
  );
}

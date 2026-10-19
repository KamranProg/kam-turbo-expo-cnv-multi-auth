import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { SignIn } from "@/components/sign-in";
import { SocialSignIn } from "@/lib/social-sign-in";

export default function LoginScreen() {
  return (
    <View style={styles.container}>
      <SignIn />
      <SocialSignIn />

      <Link href="/signup" style={styles.link}>
        {"Don't have an account? Sign up"}
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  link: {
    marginTop: 24,
    textAlign: "center",
  },
});

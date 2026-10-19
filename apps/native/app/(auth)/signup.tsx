import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";

import { SignUp } from "@/components/sign-up";
import { SocialSignIn } from "@/lib/social-sign-in";

export default function SignupScreen() {
  return (
    <View style={styles.container}>
      <SignUp />
      <SocialSignIn />

      <Link href="/login" style={styles.link}>
        Already have an account? Log in
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

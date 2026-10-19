import { StyleSheet } from "react-native";

export const authFormStyles = StyleSheet.create({
  card: {
    marginTop: 16,
    padding: 16,
    borderWidth: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
  },
  errorContainer: {
    marginBottom: 12,
    padding: 12,
    borderWidth: 1,
    borderRadius: 8,
  },
  errorText: {
    fontSize: 14,
    lineHeight: 20,
    flexShrink: 1,
  },
  input: {
    borderWidth: 1,
    padding: 12,
    fontSize: 16,
    marginBottom: 12,
  },
  button: {
    padding: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

import { useForm } from "@tanstack/react-form";
import { useState } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { authClient } from "@/lib/auth-client";
import { signInSchema } from "@/lib/auth-schemas";
import { getErrorMessage } from "@/lib/form-errors";
import { useColorScheme } from "@/lib/use-color-scheme";

import { authFormStyles as styles } from "@/components/styles/auth-form.styles";

function SignIn() {
  const { theme } = useColorScheme();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signInSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.signIn.email(
        {
          email: value.email.trim(),
          password: value.password,
        },
        {
          onError({ error }) {
            setError(
              error.code === "INVALID_EMAIL_OR_PASSWORD" ||
                error.code === "INVALID_CREDENTIALS"
                ? "Incorrect email or password. If you registered with Google, use Continue with Google."
                : error.message || "Unable to sign in. Please try again.",
            );
          },
          onSuccess() {
            setError(null);
            formApi.reset();
          },
        },
      );
    },
  });

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: theme.card, borderColor: theme.border },
      ]}
    >
      <Text style={[styles.title, { color: theme.text }]}>Sign In</Text>

      <form.Subscribe
        selector={(state) => ({
          isSubmitting: state.isSubmitting,
          validationError: getErrorMessage(state.errorMap.onSubmit),
        })}
      >
        {({ isSubmitting, validationError }) => {
          const formError = error ?? validationError;

          return (
            <>
              {formError ? (
                <View
                  accessibilityRole="alert"
                  style={[
                    styles.errorContainer,
                    {
                      backgroundColor: theme.card,
                      borderColor: theme.notification,
                    },
                  ]}
                >
                  <Text style={[styles.errorText, { color: theme.text }]}>
                    {formError}
                  </Text>
                </View>
              ) : null}

              <form.Field name="email">
                {(field) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: theme.background,
                      },
                    ]}
                    placeholder="Email"
                    placeholderTextColor={theme.text}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={(value) => {
                      field.handleChange(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                  />
                )}
              </form.Field>

              <form.Field name="password">
                {(field) => (
                  <TextInput
                    style={[
                      styles.input,
                      {
                        color: theme.text,
                        borderColor: theme.border,
                        backgroundColor: theme.background,
                      },
                    ]}
                    placeholder="Password"
                    placeholderTextColor={theme.text}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={(value) => {
                      field.handleChange(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                    secureTextEntry
                    onSubmitEditing={form.handleSubmit}
                  />
                )}
              </form.Field>

              <TouchableOpacity
                onPress={form.handleSubmit}
                disabled={isSubmitting}
                style={[
                  styles.button,
                  {
                    backgroundColor: theme.primary,
                    opacity: isSubmitting ? 0.5 : 1,
                  },
                ]}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#ffffff" />
                ) : (
                  <Text style={styles.buttonText}>Sign In</Text>
                )}
              </TouchableOpacity>
            </>
          );
        }}
      </form.Subscribe>
    </View>
  );
}

export { SignIn };

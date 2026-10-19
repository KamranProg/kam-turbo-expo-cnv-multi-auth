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
import { signUpSchema } from "@/lib/auth-schemas";
import { getErrorMessage } from "@/lib/form-errors";
import { useColorScheme } from "@/lib/use-color-scheme";

import { authFormStyles as styles } from "@/components/styles/auth-form.styles";

function SignUp() {
  const { theme } = useColorScheme();
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
    validators: {
      onSubmit: signUpSchema,
    },
    onSubmit: async ({ value, formApi }) => {
      await authClient.signUp.email(
        {
          name: value.name.trim(),
          email: value.email.trim(),
          password: value.password,
        },
        {
          onError(error) {
            setError(error.error?.message || "Failed to sign up");
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
      <Text style={[styles.title, { color: theme.text }]}>Create Account</Text>

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

              <form.Field name="name">
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
                    placeholder="Name"
                    placeholderTextColor={theme.text}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChangeText={(value) => {
                      field.handleChange(value);
                      if (error) {
                        setError(null);
                      }
                    }}
                  />
                )}
              </form.Field>

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
                  <Text style={styles.buttonText}>Sign Up</Text>
                )}
              </TouchableOpacity>
            </>
          );
        }}
      </form.Subscribe>
    </View>
  );
}

export { SignUp };

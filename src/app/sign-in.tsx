import React, { useState } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, TextInput, View } from 'react-native';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import * as z from 'zod';

import { useSession } from '~/context/session-provider';

const schema = z.object({
  username: z.string().min(1, {
    message: 'Username is required'
  }),
  password: z
    .string()
    .min(1, {
      message: 'Password is required'
    })
    .min(6, 'Password must be at least 6 characters')
});

export type FormType = z.infer<typeof schema>;

export type SignInFormProps = {
  onSubmit?: SubmitHandler<FormType>;
};

export default function SignInPage() {
  const [submitError, setSubmitError] = useState('');
  const { signIn } = useSession();
  const {
    handleSubmit,
    control,
    formState: { errors }
  } = useForm<FormType>({
    resolver: zodResolver(schema),
    defaultValues: {
      username: '',
      password: ''
    }
  });

  const onSubmit = async (data: FormType) => {
    try {
      await signIn(data.username, data.password);
      // Navigate after signing in. You may want to tweak this to ensure sign-in is
      // successful before navigating.
      router.replace('/');
    } catch (error) {
      setSubmitError((error as any).message);
    }
  };

  return (
    <View
      style={{
        padding: 50,
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Controller
        control={control}
        rules={{
          required: true
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Username"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            aria-label="Username Input"
            accessibilityRole="text"
            autoComplete="username"
            textContentType="username"
          />
        )}
        name="username"
      />
      {errors.username && <Text>{errors.username.message}</Text>}

      <Controller
        control={control}
        rules={{
          required: true,
          maxLength: 100
        }}
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            placeholder="Password"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
            aria-label="Password Input"
            autoComplete="password"
            textContentType="password"
            secureTextEntry
            accessibilityRole="text"
          />
        )}
        name="password"
      />
      {errors.password && <Text>{errors.password.message}</Text>}

      <Pressable
        onPress={handleSubmit(onSubmit)}
        accessibilityRole="button"
        aria-label="Submit Button"
      >
        <Text>Submit</Text>
      </Pressable>

      {submitError && (
        <Text accessibilityRole="alert" aria-label="Submit Error">
          Error: {submitError}
        </Text>
      )}
    </View>
  );
}

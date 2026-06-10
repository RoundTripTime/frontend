import { type ReactNode } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  type StyleProp,
  type TextInputProps,
  type TextStyle,
  type ViewStyle,
} from 'react-native';

import { useAppTheme, type AppTheme } from '@/src/theme';

type FormFieldProps = Omit<TextInputProps, 'style'> & {
  children?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  disabled?: boolean;
  error?: ReactNode;
  helper?: ReactNode;
  inputStyle?: StyleProp<TextStyle>;
  label?: ReactNode;
  left?: ReactNode;
  right?: ReactNode;
};

export function FormField({
  children,
  containerStyle,
  disabled = false,
  editable,
  error,
  helper,
  inputStyle,
  label,
  left,
  right,
  ...inputProps
}: FormFieldProps) {
  const theme = useAppTheme();
  const styles = createStyles(theme);
  const isEditable = editable ?? !disabled;
  const hasError = Boolean(error);

  return (
    <View style={[styles.field, disabled && styles.disabled, containerStyle]}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      {children ? (
        children
      ) : (
        <View style={[styles.inputRow, hasError && styles.inputError]}>
          {left ? <View>{left}</View> : null}
          <TextInput
            {...inputProps}
            editable={isEditable}
            placeholderTextColor={theme.semantic.placeholder}
            style={[styles.input, inputStyle]}
          />
          {right ? <View>{right}</View> : null}
        </View>
      )}
      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helper ? (
        <Text style={styles.helperText}>{helper}</Text>
      ) : null}
    </View>
  );
}

const createStyles = (theme: AppTheme) =>
  StyleSheet.create({
    disabled: { opacity: 0.45 },
    errorText: {
      color: theme.semantic.danger,
      fontWeight: '700',
    },
    field: {
      backgroundColor: theme.semantic.surface,
      borderRadius: theme.radius.md,
      gap: theme.spacing.sm,
      padding: theme.spacing.md,
    },
    helperText: {
      color: theme.semantic.textMuted,
      fontWeight: '700',
    },
    input: {
      color: theme.semantic.text,
      flex: 1,
      minWidth: 0,
      padding: 0,
    },
    inputError: {
      borderColor: theme.semantic.danger,
    },
    inputRow: {
      alignItems: 'center',
      backgroundColor: theme.semantic.input,
      borderColor: theme.semantic.input,
      borderRadius: theme.radius.md,
      borderWidth: 1,
      flexDirection: 'row',
      gap: theme.spacing.sm,
      paddingHorizontal: theme.spacing.md,
      paddingVertical: theme.spacing.md,
    },
    label: {
      color: theme.semantic.text,
      fontWeight: '800',
    },
  });

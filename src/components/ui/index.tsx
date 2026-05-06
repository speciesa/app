import React from 'react';
import {
  ActivityIndicator, StyleSheet, Text, TouchableOpacity,
  View, ViewStyle, TextStyle,
} from 'react-native';

// ── Button ─────────────────────────────────────────────────────────────────

type ButtonVariant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
}

export function Button({
  label, onPress, variant = 'primary', loading, disabled, style,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      style={[btnStyles.base, btnStyles[variant], isDisabled && btnStyles.disabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.75}
    >
      {loading
        ? <ActivityIndicator color={variant === 'primary' ? '#fff' : '#1D9E75'} />
        : <Text style={[btnStyles.label, btnStyles[`${variant}Label` as keyof typeof btnStyles] as TextStyle]}>
            {label}
          </Text>
      }
    </TouchableOpacity>
  );
}

const btnStyles = StyleSheet.create({
  base: { padding: 13, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  primary: { backgroundColor: '#1D9E75' },
  secondary: { backgroundColor: '#E1F5EE', borderWidth: 0.5, borderColor: '#9FE1CB' },
  ghost: { backgroundColor: 'transparent', borderWidth: 0.5, borderColor: '#C5C3BB' },
  disabled: { opacity: 0.5 },
  label: { fontSize: 15, fontWeight: '500' },
  primaryLabel: { color: '#fff' },
  secondaryLabel: { color: '#085041' },
  ghostLabel: { color: '#5F5E5A' },
});


// ── Card ───────────────────────────────────────────────────────────────────

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: number;
}

export function Card({ children, style, padding = 14 }: CardProps) {
  return (
    <View style={[cardStyles.card, { padding }, style]}>
      {children}
    </View>
  );
}

const cardStyles = StyleSheet.create({
  card: {
    backgroundColor: '#F1EFE8',
    borderRadius: 14,
    borderWidth: 0.5,
    borderColor: '#E8E6DE',
  },
});


// ── Badge ──────────────────────────────────────────────────────────────────

type BadgeColor = 'green' | 'blue' | 'amber' | 'red' | 'gray';

const BADGE_COLORS: Record<BadgeColor, { bg: string; text: string }> = {
  green: { bg: '#EAF3DE', text: '#3B6D11' },
  blue:  { bg: '#E6F1FB', text: '#185FA5' },
  amber: { bg: '#FAEEDA', text: '#854F0B' },
  red:   { bg: '#FAECE7', text: '#993C1D' },
  gray:  { bg: '#F1EFE8', text: '#5F5E5A' },
};

interface BadgeProps {
  label: string;
  color?: BadgeColor;
  style?: ViewStyle;
}

export function Badge({ label, color = 'green', style }: BadgeProps) {
  const colors = BADGE_COLORS[color];
  return (
    <View style={[badgeStyles.badge, { backgroundColor: colors.bg }, style]}>
      <Text style={[badgeStyles.text, { color: colors.text }]}>{label}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  badge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, alignSelf: 'flex-start' },
  text: { fontSize: 11, fontWeight: '600' },
});


// ── Skeleton ───────────────────────────────────────────────────────────────

import Animated, { useSharedValue, useAnimatedStyle, withRepeat, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';

interface SkeletonProps {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({ width = '100%', height = 16, borderRadius = 8, style }: SkeletonProps) {
  const opacity = useSharedValue(0.4);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(1, { duration: 700 }),
      -1,
      true,
    );
  }, []);

  const animStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ width, height, borderRadius, backgroundColor: '#E8E6DE' }, animStyle, style]}
    />
  );
}


// ── TaxonRow skeleton ──────────────────────────────────────────────────────

export function TaxonRowSkeleton() {
  return (
    <View style={skeletonStyles.row}>
      <Skeleton width={46} height={46} borderRadius={10} />
      <View style={skeletonStyles.body}>
        <Skeleton width="60%" height={14} />
        <Skeleton width="40%" height={11} style={{ marginTop: 6 }} />
      </View>
    </View>
  );
}

export function TaxonListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <View>
      {Array.from({ length: count }).map((_, i) => (
        <TaxonRowSkeleton key={i} />
      ))}
    </View>
  );
}

const skeletonStyles = StyleSheet.create({
  row: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 10,
    borderBottomWidth: 0.5, borderBottomColor: '#E8E6DE', gap: 12,
  },
  body: { flex: 1, gap: 4 },
});


// ── Empty state ────────────────────────────────────────────────────────────

interface EmptyStateProps {
  emoji?: string;
  title: string;
  subtitle?: string;
  action?: { label: string; onPress: () => void };
}

export function EmptyState({ emoji = '🔍', title, subtitle, action }: EmptyStateProps) {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.emoji}>{emoji}</Text>
      <Text style={emptyStyles.title}>{title}</Text>
      {subtitle && <Text style={emptyStyles.subtitle}>{subtitle}</Text>}
      {action && (
        <TouchableOpacity style={emptyStyles.actionBtn} onPress={action.onPress}>
          <Text style={emptyStyles.actionText}>{action.label}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const emptyStyles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  emoji: { fontSize: 48, marginBottom: 16 },
  title: { fontSize: 17, fontWeight: '500', color: '#2C2C2A', textAlign: 'center' },
  subtitle: { fontSize: 14, color: '#888780', textAlign: 'center', marginTop: 8, lineHeight: 20 },
  actionBtn: { marginTop: 20, paddingHorizontal: 20, paddingVertical: 10, backgroundColor: '#E1F5EE', borderRadius: 20 },
  actionText: { color: '#085041', fontWeight: '500', fontSize: 14 },
});


// ── Error state ────────────────────────────────────────────────────────────

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export function ErrorState({ message = 'Что-то пошло не так', onRetry }: ErrorStateProps) {
  return (
    <View style={emptyStyles.container}>
      <Text style={emptyStyles.emoji}>⚠️</Text>
      <Text style={emptyStyles.title}>{message}</Text>
      {onRetry && (
        <TouchableOpacity style={emptyStyles.actionBtn} onPress={onRetry}>
          <Text style={emptyStyles.actionText}>Повторить</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

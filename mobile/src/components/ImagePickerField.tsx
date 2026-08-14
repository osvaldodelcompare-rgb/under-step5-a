import React, { useState } from 'react';
import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { uploadsApi } from '../api/uploads.api';
import { colors, radius, spacing, typography } from '../theme/theme';

interface ImagePickerFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  aspectRatio?: [number, number];
}

export function ImagePickerField({
  label,
  value,
  onChange,
  aspectRatio = [16, 9],
}: ImagePickerFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handlePick() {
    setError(null);

    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      setError('Necesitamos permiso para acceder a tus fotos');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: aspectRatio,
      quality: 0.8,
    });

    if (result.canceled || !result.assets?.[0]) return;

    const asset = result.assets[0];
    setUploading(true);
    try {
      const uploaded = await uploadsApi.uploadImage({
        uri: asset.uri,
        mimeType: asset.mimeType,
        fileName: asset.fileName,
      });
      onChange(uploaded.url);
    } catch (err: any) {
      setError(
        err?.response?.data?.message ??
          'No pudimos subir la imagen. Probá de nuevo.',
      );
    } finally {
      setUploading(false);
    }
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>{label}</Text>

      <Pressable
        onPress={handlePick}
        disabled={uploading}
        style={[styles.box, { aspectRatio: aspectRatio[0] / aspectRatio[1] }]}
      >
        {value ? (
          <Image source={{ uri: value }} style={styles.image} />
        ) : (
          <Text style={styles.placeholder}>
            {uploading ? 'Subiendo…' : '+ Elegir imagen'}
          </Text>
        )}

        {uploading && value ? (
          <View style={styles.overlay}>
            <ActivityIndicator color={colors.text} />
          </View>
        ) : null}
      </Pressable>

      {value ? (
        <Pressable onPress={() => onChange('')}>
          <Text style={styles.removeText}>Quitar imagen</Text>
        </Pressable>
      ) : null}

      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginBottom: spacing.md },
  label: {
    ...typography.caption,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: spacing.xs,
  },
  box: {
    width: '100%',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  image: { width: '100%', height: '100%' },
  placeholder: { color: colors.textFaint, fontSize: 13 },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(11,11,15,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    color: colors.textFaint,
    fontSize: 12,
    marginTop: spacing.xs,
  },
  error: {
    color: colors.danger,
    fontSize: 12,
    marginTop: spacing.xs,
  },
});

// Mismo criterio que en la web: esto es un conector modular a un enlace
// externo. Cuando se construya el flujo real de perfiles de banda dentro
// de la app, alcanza con reemplazar este componente.
import React from 'react';
import { Alert, Linking } from 'react-native';
import { Button } from './Button';

const BAND_SIGNUP_URL = process.env.EXPO_PUBLIC_BAND_SIGNUP_URL || '';

export function BandSignupButton() {
  function handlePress() {
    if (BAND_SIGNUP_URL) {
      Linking.openURL(BAND_SIGNUP_URL);
      return;
    }
    Alert.alert(
      'Muy pronto',
      'Los perfiles de banda todavía no están disponibles en la app.',
    );
  }

  return (
    <Button label="🎸 Sos una banda?" variant="ghost" onPress={handlePress} />
  );
}

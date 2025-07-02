import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface InputSpinnerProps {
  value: number;
  onChange: (newValue: number) => void;
  min?: number;
  max?: number;
  step?: number;
  label?: string;
}

const InputSpinner: React.FC<InputSpinnerProps> = ({
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
  label = '',
}) => {
  const decrease = () => {
    if (value - step >= min) {
      onChange(value - step);
    }
  };

  const increase = () => {
    if (value + step <= max) {
      onChange(value + step);
    }
  };

  return (
    <View style={styles.container}>
      {label !== '' && <Text style={styles.label}>{label}</Text>}
      <View style={styles.spinnerContainer}>
        <TouchableOpacity style={styles.button} onPress={decrease}>
          <Ionicons name="remove" size={20} color="#334155" />
        </TouchableOpacity>
        <Text style={styles.valueText}>{value}</Text>
        <TouchableOpacity style={styles.button} onPress={increase}>
          <Ionicons name="add" size={20} color="#334155" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InputSpinner;

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
  },
  label: {
    fontSize: 14,
    color: '#475569',
    marginBottom: 4,
    fontWeight: '600',
  },
  spinnerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f8fafc',
  },
  button: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#e2e8f0',
  },
  valueText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
  },
});

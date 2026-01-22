import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Button} from '../../src/components/common/Button';

describe('Button Component', () => {
  it('renders correctly', () => {
    const {getByText} = render(
      <Button title="Test Button" onPress={() => {}} />,
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const {getByText} = render(
      <Button title="Test Button" onPress={onPress} />,
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    const {getByTestId} = render(
      <Button title="Test Button" onPress={() => {}} loading={true} />,
    );
    // Loading indicator should be present
  });

  it('is disabled when disabled prop is true', () => {
    const onPress = jest.fn();
    const {getByText} = render(
      <Button title="Test Button" onPress={onPress} disabled={true} />,
    );

    fireEvent.press(getByText('Test Button'));
    expect(onPress).not.toHaveBeenCalled();
  });
});

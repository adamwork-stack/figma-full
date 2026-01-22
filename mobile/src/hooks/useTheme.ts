import {useTheme as useStyledTheme} from 'styled-components/native';
import {Theme} from '../theme/theme';

export const useTheme = (): Theme => {
  return useStyledTheme() as Theme;
};

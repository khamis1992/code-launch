import type { ITheme } from '@xterm/xterm';

const style = getComputedStyle(document.documentElement);
const cssVar = (token: string) => style.getPropertyValue(token) || undefined;

export function getTerminalTheme(overrides?: ITheme): ITheme {
  return {
    cursor: cssVar('--codelaunch-elements-terminal-cursorColor'),
    cursorAccent: cssVar('--codelaunch-elements-terminal-cursorColorAccent'),
    foreground: cssVar('--codelaunch-elements-terminal-textColor'),
    background: cssVar('--codelaunch-elements-terminal-backgroundColor'),
    selectionBackground: cssVar('--codelaunch-elements-terminal-selection-backgroundColor'),
    selectionForeground: cssVar('--codelaunch-elements-terminal-selection-textColor'),
    selectionInactiveBackground: cssVar('--codelaunch-elements-terminal-selection-backgroundColorInactive'),

    // ansi escape code colors
    black: cssVar('--codelaunch-elements-terminal-color-black'),
    red: cssVar('--codelaunch-elements-terminal-color-red'),
    green: cssVar('--codelaunch-elements-terminal-color-green'),
    yellow: cssVar('--codelaunch-elements-terminal-color-yellow'),
    blue: cssVar('--codelaunch-elements-terminal-color-blue'),
    magenta: cssVar('--codelaunch-elements-terminal-color-magenta'),
    cyan: cssVar('--codelaunch-elements-terminal-color-cyan'),
    white: cssVar('--codelaunch-elements-terminal-color-white'),
    brightBlack: cssVar('--codelaunch-elements-terminal-color-brightBlack'),
    brightRed: cssVar('--codelaunch-elements-terminal-color-brightRed'),
    brightGreen: cssVar('--codelaunch-elements-terminal-color-brightGreen'),
    brightYellow: cssVar('--codelaunch-elements-terminal-color-brightYellow'),
    brightBlue: cssVar('--codelaunch-elements-terminal-color-brightBlue'),
    brightMagenta: cssVar('--codelaunch-elements-terminal-color-brightMagenta'),
    brightCyan: cssVar('--codelaunch-elements-terminal-color-brightCyan'),
    brightWhite: cssVar('--codelaunch-elements-terminal-color-brightWhite'),

    ...overrides,
  };
}

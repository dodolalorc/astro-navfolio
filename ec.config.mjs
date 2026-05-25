import fs from 'node:fs';
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { defineEcConfig, setAlpha } from 'astro-expressive-code';
import { parse } from 'smol-toml';

const siteToml = parse(fs.readFileSync(new URL('./src/config/site.toml', import.meta.url), 'utf8'));

const code = {
  lightTheme: 'github-light',
  darkTheme: 'github-dark',
  lineNumbers: true,
  wrap: true,
  preserveIndent: true,
  collapseStyle: 'collapsible-auto',
  ...(siteToml.config?.code ?? {}),
};

const isDarkCodeTheme = ({ theme }) => theme.name === code.darkTheme;

export default defineEcConfig({
  plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
  defaultLocale: 'zh-CN',
  themes: [code.lightTheme, code.darkTheme],
  themeCssRoot: ':root',
  themeCssSelector: (theme) =>
    theme.name === code.darkTheme ? '[data-theme="dark"]' : '[data-theme="light"]',
  useDarkModeMediaQuery: false,
  removeUnusedThemes: true,
  defaultProps: {
    wrap: code.wrap,
    preserveIndent: code.preserveIndent,
    showLineNumbers: code.lineNumbers,
    collapseStyle: code.collapseStyle,
  },
  frames: {
    extractFileNameFromCode: true,
  },
  styleOverrides: {
    borderRadius: '1px',
    borderWidth: '1px',
    borderColor: 'var(--paper-line-strong)',
    uiFontFamily: 'var(--font-meta)',
    uiFontSize: '0.88rem',
    codeFontFamily: 'var(--font-code)',
    codeFontSize: '0.9rem',
    codeLineHeight: '1.65',
    codePaddingBlock: '1rem',
    codePaddingInline: '1.15rem',
    codeBackground: 'var(--paper-surface-muted)',
    frames: {
      editorActiveTabBackground: 'var(--paper-surface-muted)',
      editorActiveTabIndicatorTopColor: 'var(--paper-accent)',
      editorTabBarBackground: 'var(--paper-control)',
      editorBackground: 'var(--paper-surface-muted)',
      frameBoxShadowCssValue: 'var(--paper-shadow)',
      inlineButtonBackgroundActiveOpacity: '0.16',
      inlineButtonBackgroundHoverOrFocusOpacity: '0.1',
      terminalTitlebarBackground: 'var(--paper-control)',
      terminalBackground: 'var(--paper-surface-muted)',
      tooltipSuccessBackground: ({ theme }) =>
        setAlpha(theme.colors['terminal.ansiGreen'] || '#3f8f58', 0.94),
    },
    textMarkers: {
      lineMarkerAccentWidth: '0.2rem',
      backgroundOpacity: '0.24',
      borderOpacity: '0.62',
      markBackground: (context) =>
        isDarkCodeTheme(context) ? 'rgba(120, 151, 255, 0.26)' : 'rgba(82, 111, 190, 0.14)',
      markBorderColor: (context) =>
        isDarkCodeTheme(context) ? 'rgba(168, 188, 255, 0.74)' : 'rgba(82, 111, 190, 0.38)',
      insBackground: (context) =>
        isDarkCodeTheme(context) ? 'rgba(82, 164, 112, 0.24)' : 'rgba(62, 138, 86, 0.13)',
      insBorderColor: (context) =>
        isDarkCodeTheme(context) ? 'rgba(133, 205, 156, 0.68)' : 'rgba(62, 138, 86, 0.36)',
      delBackground: (context) =>
        isDarkCodeTheme(context) ? 'rgba(207, 96, 86, 0.22)' : 'rgba(184, 74, 65, 0.12)',
      delBorderColor: (context) =>
        isDarkCodeTheme(context) ? 'rgba(238, 147, 137, 0.64)' : 'rgba(184, 74, 65, 0.34)',
    },
    collapsibleSections: {
      closedBackgroundColor: 'var(--paper-control)',
    },
  },
});

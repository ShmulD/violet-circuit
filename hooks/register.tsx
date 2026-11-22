import type { Register, ThemeMessageRule, ThemeSetArgs, ThemeSound, ThemeStyle } from 'claude-code'

import { makeColors } from './make-colors.js'
import { SCENE } from './scene.js'

// Violet Circuit: a dark, neon violet tech look for the whole desktop app.
const { theme, problems } = makeColors({
  label: 'Violet Circuit',
  only: 'dark',
  roles: {
    accent: '#a855f7',
    danger: '#f43f5e',
    success: '#34d399',
    warning: '#fbbf24',
    pro: '#22d3ee',
  },
  codeTheme: { dark: 'dracula' },
  dark: {
    gray: {
      anchors: {
        'surface-0': '#0b0716',
        'surface-1': '#120c22',
        'surface-2': '#170f2b',
        'surface-3': '#1d1434',
        'text-primary': '#f3edff',
        'text-secondary': '#cdc1ea',
        'text-muted': '#a093c8',
      },
    },
    git: {
      added: '#34d399',
      removed: '#f43f5e',
      modified: '#fbbf24',
      merged: '#c084fc',
      closed: '#fb7185',
      conflicting: '#fb923c',
      draft: '#a093c8',
    },
  },
})

// Message colors with no style rule, so plain rows match too.
theme.inputs.dark = {
  ...theme.inputs.dark,
  'bg-user-message': '#1e1238',
  'text-user-message': '#f3edff',
  'bg-assistant-message': '#110a20',
  'text-assistant-message': '#ece4ff',
}

// A chamfered card with a neon outline and corner brackets.
const chamfer: ThemeMessageRule = {
  color: '#f3edff',
  backgroundColor: '#1e1238',
  paddingX: 18,
  paddingY: 14,
  shadow: { y: 0, blur: 18, color: '#7c3aed55' },
  fill: {
    vector: {
      viewBox: 64,
      slice: 14,
      paths: [
        { d: 'M10 0H64V54L54 64H0V10Z', color: '#1e1238' },
        { d: 'M10 0.75H63.25V53.7L53.7 63.25H0.75V10.3Z', strokeWidth: 1.5, color: '#9b5cf6' },
        { d: 'M3 12V3H12', strokeWidth: 2, color: '#e9d5ff' },
        { d: 'M61 52V61H52', strokeWidth: 2, color: '#67e8f9' },
      ],
    },
  },
}

const reply: ThemeMessageRule = {
  color: '#ece4ff',
  backgroundColor: '#110a20',
  radius: [2, 14, 14, 2],
  paddingX: 18,
  paddingY: 12,
  fill: {
    gradient: {
      angle: 90,
      stops: [
        { at: 0, color: '#8b5cf6' },
        { at: 0.006, color: '#8b5cf6' },
        { at: 0.007, color: '#150c28' },
        { at: 1, color: '#0f091d' },
      ],
    },
  },
  borderColor: '#2a1a4d',
  borderWidth: 1,
}

const STYLE: ThemeStyle = {
  Text: { fontFamily: ['sans'], fontSize: 15, lineHeight: 24 },
  Heading: { fontFamily: ['mono'], color: '#d8b4fe', letterSpacing: 1, fontWeight: 'semibold' },
  UserMessage: chamfer,
  AssistantMessage: reply,
  ToolUse: {
    color: '#c4b5fd',
    fontFamily: ['code'],
    backgroundColor: '#0e0919',
    borderColor: '#3b2566',
    borderWidth: 1,
    radius: 6,
    paddingX: 10,
    paddingY: 4,
  },
}

// Low synth hum, faint static and rare data blips. Cues are short and soft.
const SOUND: ThemeSound = {
  ambience: {
    reverb: 0.45,
    layers: [
      { wave: 'sine', drone: true, notes: ['A1', 'E2'], gain: 0.22, filter: { type: 'lowpass', hz: 300, to: 520 } },
      { wave: 'saw', drone: true, notes: ['A2'], gain: 0.05, filter: { type: 'lowpass', hz: 400, to: 900 }, tremolo: { hz: 0.12, depth: 0.5 } },
      { wave: 'brown', drone: true, gain: 0.06, filter: { type: 'lowpass', hz: 600 } },
      { wave: 'bell', scatter: 0.08, notes: ['E6', 'B6', 'F#6', 'C#7'], gain: 0.07, release: 1.2, pan: 0.4 },
    ],
  },
  cues: {
    send: { layers: [{ wave: 'sine', notes: ['A4'], glide: 12, gain: 0.25, release: 0.18 }] },
    tool: { layers: [{ wave: 'triangle', notes: ['E6'], gain: 0.08, release: 0.04 }] },
    compact: { layers: [{ wave: 'pink', gain: 0.15, release: 0.6, filter: { type: 'bandpass', hz: 3000, to: 300 } }] },
    done: { reverb: 0.35, layers: [{ wave: 'bell', notes: ['A5', 'C#6', 'E6'], step: 0.08, gain: 0.22, release: 0.9 }] },
    ask: { layers: [{ wave: 'sine', notes: ['E5', 'A5'], step: 0.12, gain: 0.22, release: 0.3 }] },
    error: { layers: [{ wave: 'saw', notes: ['A3'], glide: -7, gain: 0.12, release: 0.35, filter: { type: 'lowpass', hz: 900 } }] },
    click: { layers: [{ wave: 'bell', notes: ['A4', 'B4', 'C#5', 'E5', 'F#5', 'A5'], gain: 0.12, release: 0.5 }] },
  },
}

const BASE: ThemeSetArgs = {
  colors: theme,
  overrideColorScheme: 'dark',
  backdrop: { scene: 'violet-circuit', glass: { blur: 22, tint: '#0d0819', opacity: 0.72 } },
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    const unpainted = problems.find(line => line.startsWith("Desktop won't paint"))
    if (unpainted !== undefined) {
      $.ui.toast(unpainted)
    }

    let set
    try {
      set = await $.theme.set({ ...BASE, style: STYLE, sound: SOUND })
    } catch (error) {
      $.ui.log(String(error))
      try {
        set = await $.theme.set({ ...BASE, style: STYLE })
      } catch (error2) {
        $.ui.log(String(error2))
        set = await $.theme.set(BASE)
      }
    }

    if (!set.isDrawn) {
      $.ui.status(set.reason)
    }
    return next(e)
  })

  on('ui.render', { component: 'Backdrop' }, ($, e, next) => {
    if (e.surface !== 'desktop' && e.surface !== 'mobile') {
      return next(e)
    }
    const { Svg } = $.ui.resolve(e)
    return <Svg source={SCENE} alt="A violet grid floor with glowing circuit traces" isInteractive />
  })
}

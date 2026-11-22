// The live backdrop: a violet void with a receding neon grid, circuit traces
// carrying data pulses in the corners, a slow rotating ring and drifting motes.

function rand(seed: number): () => number {
  let s = seed
  return () => {
    s = (s * 16807) % 2147483647
    return (s - 1) / 2147483646
  }
}

function grid(): string {
  const vx = 800
  const hy = 640
  const out: string[] = []
  for (let i = -14; i <= 14; i++) {
    const x = vx + i * 140
    out.push(`<line x1="${vx + i * 18}" y1="${hy}" x2="${x}" y2="1000"/>`)
  }
  return out.join('')
}

function rows(): string {
  const out: string[] = []
  for (let i = -1; i < 12; i++) {
    const y = 640 + i * 40
    out.push(`<line x1="0" y1="${y}" x2="1600" y2="${y}"/>`)
  }
  return out.join('')
}

function motes(): string {
  const r = rand(7)
  const out: string[] = []
  for (let i = 0; i < 34; i++) {
    const x = Math.round(r() * 1600)
    const y = Math.round(r() * 1000)
    const size = (0.8 + r() * 2.2).toFixed(1)
    const dur = Math.round(26 + r() * 30)
    const delay = -Math.round(r() * dur)
    const fill = r() > 0.7 ? '#67e8f9' : '#c084fc'
    out.push(
      `<circle class="mote" cx="${x}" cy="${y}" r="${size}" fill="${fill}" style="animation-duration:${dur}s;animation-delay:${delay}s"/>`,
    )
  }
  return out.join('')
}

const TRACE_TL = [
  'M0 120 H160 L220 180 H420',
  'M0 200 H90 L150 260 V420',
  'M120 0 V70 L180 130 H300 L340 90 H520',
  'M260 0 V40 L300 80 H360',
  'M0 320 H40 L80 360 V520 L120 560',
]

const TRACE_BR = [
  'M1600 860 H1460 L1400 800 H1220',
  'M1600 760 H1520 L1470 710 V560',
  'M1480 1000 V930 L1420 870 H1300 L1260 910 H1100',
  'M1340 1000 V960 L1300 920 H1240',
]

function traces(paths: string[], cls: string): string {
  return paths
    .map(
      (d, i) =>
        `<path d="${d}" class="wire"/><path d="${d}" class="pulse ${cls}" style="animation-delay:${-i * 1.7}s"/>`,
    )
    .join('')
}

function nodes(points: [number, number][]): string {
  return points
    .map(([x, y]) => `<rect x="${x - 4}" y="${y - 4}" width="8" height="8" class="node"/>`)
    .join('')
}

export const SCENE = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">
<style>
.wire{fill:none;stroke:#3b1f6e;stroke-width:1.5}
.pulse{fill:none;stroke:#c084fc;stroke-width:2;stroke-linecap:round;stroke-dasharray:40 900;stroke-dashoffset:940;opacity:.85;animation:flow 9s linear infinite}
.pulse.cy{stroke:#67e8f9}
.node{fill:#0b0716;stroke:#8b5cf6;stroke-width:1.5}
.grid line{stroke:#7c3aed;stroke-width:1}
.rows{animation:roll 7s linear infinite}
.horizon{animation:breathe 10s ease-in-out infinite}
.ring{transform-origin:1330px 230px;animation:spin 90s linear infinite}
.ring2{transform-origin:1330px 230px;animation:spin 140s linear infinite reverse}
.mote{opacity:.55;animation-name:rise;animation-timing-function:linear;animation-iteration-count:infinite}
.scan{animation:scan 16s linear infinite}
@keyframes flow{to{stroke-dashoffset:0}}
@keyframes roll{to{transform:translateY(40px)}}
@keyframes breathe{0%,100%{opacity:.55}50%{opacity:.9}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes rise{0%{transform:translateY(0);opacity:0}15%{opacity:.6}85%{opacity:.6}100%{transform:translateY(-260px);opacity:0}}
@keyframes scan{0%{transform:translateY(-120px)}100%{transform:translateY(1120px)}}
@media (prefers-reduced-motion: reduce){.pulse{stroke-dashoffset:470}}
</style>
<defs>
<radialGradient id="glowTop" cx="50%" cy="20%" r="70%">
<stop offset="0" stop-color="#2a1055"/><stop offset=".55" stop-color="#120926"/><stop offset="1" stop-color="#07040f"/>
</radialGradient>
<radialGradient id="glowSide" cx="8%" cy="92%" r="45%">
<stop offset="0" stop-color="#6d28d9" stop-opacity=".35"/><stop offset="1" stop-color="#6d28d9" stop-opacity="0"/>
</radialGradient>
<radialGradient id="glowCyan" cx="88%" cy="18%" r="30%">
<stop offset="0" stop-color="#22d3ee" stop-opacity=".12"/><stop offset="1" stop-color="#22d3ee" stop-opacity="0"/>
</radialGradient>
<linearGradient id="fadeGrid" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="1"/>
</linearGradient>
<mask id="gridMask"><rect x="0" y="640" width="1600" height="360" fill="url(#fadeGrid)"/></mask>
<linearGradient id="horizonLine" x1="0" y1="0" x2="1" y2="0">
<stop offset="0" stop-color="#a855f7" stop-opacity="0"/><stop offset=".5" stop-color="#e9d5ff"/><stop offset="1" stop-color="#a855f7" stop-opacity="0"/>
</linearGradient>
<linearGradient id="scanBand" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#a855f7" stop-opacity="0"/><stop offset=".5" stop-color="#a855f7" stop-opacity=".05"/><stop offset="1" stop-color="#a855f7" stop-opacity="0"/>
</linearGradient>
<pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="#4c2a8a" opacity=".45"/></pattern>
</defs>
<!-- ground -->
<rect width="1600" height="1000" fill="url(#glowTop)"/>
<rect width="1600" height="640" fill="url(#dots)"/>
<rect width="1600" height="1000" fill="url(#glowSide)"/>
<rect width="1600" height="1000" fill="url(#glowCyan)"/>
<!-- grid floor -->
<g mask="url(#gridMask)" opacity=".38">
<g class="grid">${grid()}</g>
<g class="grid"><g class="rows">${rows()}</g></g>
</g>
<g class="horizon">
<rect x="0" y="636" width="1600" height="8" fill="url(#horizonLine)" opacity=".35"/>
<rect x="200" y="639" width="1200" height="2" fill="url(#horizonLine)"/>
</g>
<!-- rings -->
<g opacity=".5">
<circle cx="1330" cy="230" r="150" fill="none" stroke="#3b1f6e" stroke-width="1"/>
<g class="ring"><circle cx="1330" cy="230" r="120" fill="none" stroke="#8b5cf6" stroke-width="2" stroke-dasharray="60 24 8 24"/></g>
<g class="ring2"><circle cx="1330" cy="230" r="92" fill="none" stroke="#22d3ee" stroke-width="1" stroke-dasharray="2 10" opacity=".8"/>
<polygon points="1330,168 1384,199 1384,261 1330,292 1276,261 1276,199" fill="none" stroke="#a855f7" stroke-width="1.2" opacity=".7"/></g>
</g>
<!-- circuits -->
${traces(TRACE_TL, '')}
${traces(TRACE_BR, 'cy')}
${nodes([[420, 180], [150, 420], [520, 90], [360, 80], [120, 560], [1220, 800], [1470, 560], [1100, 910], [1240, 920]])}
<!-- motes -->
<g>${motes()}</g>
<!-- scan band -->
<rect class="scan" x="0" y="0" width="1600" height="120" fill="url(#scanBand)"/>
</svg>`

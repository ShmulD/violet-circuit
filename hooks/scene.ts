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
    const cls = r() > 0.7 ? 'mc' : 'mv'
    out.push(
      `<circle cx="${x}" cy="${y}" r="${size}" class="mote ${cls}" style="animation-duration:${dur}s;animation-delay:${delay}s"/>`,
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
svg{--g0:#2a1055;--g1:#120926;--g2:#07040f;--side:#6d28d9;--sideo:.35;--cyo:.12;--dot:#4c2a8a;--grid:#7c3aed;--gridop:.38;--hz:#e9d5ff;--hz2:#a855f7;--wire:#3b1f6e;--pv:#c084fc;--pc:#67e8f9;--node:#0b0716;--nodes:#8b5cf6;--r0:#3b1f6e;--r1:#8b5cf6;--r2:#22d3ee;--r3:#a855f7;--scan:#a855f7}
@media (prefers-color-scheme: light){svg{--g0:#fbf9ff;--g1:#eee7fc;--g2:#ddd1f5;--side:#a78bfa;--sideo:.30;--cyo:.18;--dot:#b9a6e8;--grid:#8b5cf6;--gridop:.30;--hz:#6d28d9;--hz2:#a78bfa;--wire:#d4c6f5;--pv:#7c3aed;--pc:#0891b2;--node:#fbf9ff;--nodes:#7c3aed;--r0:#cdbdf3;--r1:#8b5cf6;--r2:#0891b2;--r3:#7c3aed;--scan:#7c3aed}}
.s0{stop-color:var(--g0)}.s1{stop-color:var(--g1)}.s2{stop-color:var(--g2)}
.sd{stop-color:var(--side);stop-opacity:var(--sideo)}.sd0{stop-color:var(--side);stop-opacity:0}
.cyg{stop-color:#22d3ee;stop-opacity:var(--cyo)}.cyg0{stop-color:#22d3ee;stop-opacity:0}
.hzm{stop-color:var(--hz)}.hze{stop-color:var(--hz2);stop-opacity:0}
.scm{stop-color:var(--scan);stop-opacity:.05}.sce{stop-color:var(--scan);stop-opacity:0}
.dot{fill:var(--dot);opacity:.45}
.wire{fill:none;stroke:var(--wire);stroke-width:1.5}
.pulse{fill:none;stroke:var(--pv);stroke-width:2;stroke-linecap:round;stroke-dasharray:40 900;stroke-dashoffset:940;opacity:.85;animation:flow 9s linear infinite}
.pulse.cy{stroke:var(--pc)}
.node{fill:var(--node);stroke:var(--nodes);stroke-width:1.5}
.gridwrap{opacity:var(--gridop)}
.grid line{stroke:var(--grid);stroke-width:1}
.rows{animation:roll 7s linear infinite}
.horizon{animation:breathe 10s ease-in-out infinite}
.ring{transform-origin:1330px 230px;animation:spin 90s linear infinite}
.ring2{transform-origin:1330px 230px;animation:spin 140s linear infinite reverse}
.rg0{fill:none;stroke:var(--r0);stroke-width:1}
.rg1{fill:none;stroke:var(--r1);stroke-width:2;stroke-dasharray:60 24 8 24}
.rg2{fill:none;stroke:var(--r2);stroke-width:1;stroke-dasharray:2 10;opacity:.8}
.rg3{fill:none;stroke:var(--r3);stroke-width:1.2;opacity:.7}
.mote{opacity:.55;animation-name:rise;animation-timing-function:linear;animation-iteration-count:infinite}
.mv{fill:var(--pv)}.mc{fill:var(--pc)}
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
<radialGradient id="glowTop" cx="50%" cy="20%" r="70%"><stop offset="0" class="s0"/><stop offset=".55" class="s1"/><stop offset="1" class="s2"/></radialGradient>
<radialGradient id="glowSide" cx="8%" cy="92%" r="45%"><stop offset="0" class="sd"/><stop offset="1" class="sd0"/></radialGradient>
<radialGradient id="glowCyan" cx="88%" cy="18%" r="30%"><stop offset="0" class="cyg"/><stop offset="1" class="cyg0"/></radialGradient>
<linearGradient id="fadeGrid" x1="0" y1="0" x2="0" y2="1">
<stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".35" stop-color="#fff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="1"/>
</linearGradient>
<mask id="gridMask"><rect x="0" y="640" width="1600" height="360" fill="url(#fadeGrid)"/></mask>
<linearGradient id="horizonLine" x1="0" y1="0" x2="1" y2="0"><stop offset="0" class="hze"/><stop offset=".5" class="hzm"/><stop offset="1" class="hze"/></linearGradient>
<linearGradient id="scanBand" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sce"/><stop offset=".5" class="scm"/><stop offset="1" class="sce"/></linearGradient>
<pattern id="dots" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" class="dot"/></pattern>
</defs>
<!-- ground -->
<rect width="1600" height="1000" fill="url(#glowTop)"/>
<rect width="1600" height="640" fill="url(#dots)"/>
<rect width="1600" height="1000" fill="url(#glowSide)"/>
<rect width="1600" height="1000" fill="url(#glowCyan)"/>
<!-- grid floor -->
<g mask="url(#gridMask)" class="gridwrap">
<g class="grid">${grid()}</g>
<g class="grid"><g class="rows">${rows()}</g></g>
</g>
<g class="horizon">
<rect x="0" y="636" width="1600" height="8" fill="url(#horizonLine)" opacity=".35"/>
<rect x="200" y="639" width="1200" height="2" fill="url(#horizonLine)"/>
</g>
<!-- rings -->
<g opacity=".5">
<circle cx="1330" cy="230" r="150" class="rg0"/>
<g class="ring"><circle cx="1330" cy="230" r="120" class="rg1"/></g>
<g class="ring2"><circle cx="1330" cy="230" r="92" class="rg2"/>
<polygon points="1330,168 1384,199 1384,261 1330,292 1276,261 1276,199" class="rg3"/></g>
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

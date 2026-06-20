/** Synthesizes a dice-rolling sound using Web Audio API — no external files. */
export function playDiceRollSound(numDice = 1): void {
  let ctx: AudioContext
  try {
    ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
  } catch {
    return
  }

  const now = ctx.currentTime
  const totalBounces = Math.min(5 + numDice * 3, 14)

  // ── Bounce click sounds (die hitting the table) ─────────────────────────────
  for (let i = 0; i < totalBounces; i++) {
    // Physics: gaps between bounces grow exponentially (each bounce slower)
    const t = now + computeBounceTime(i, numDice)
    const vol = Math.max(0.03, 0.55 * Math.pow(0.72, i))
    const pitchVariance = 0.5 + Math.random() * 0.5

    // White noise burst — the sharp "click" of plastic/resin on wood
    const duration = Math.max(0.008, 0.045 - i * 0.002)
    const bufLen = Math.floor(ctx.sampleRate * duration)
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate)
    const raw = buf.getChannelData(0)
    for (let j = 0; j < bufLen; j++) {
      raw[j] = (Math.random() * 2 - 1) * Math.exp(-j / (bufLen * 0.35))
    }
    const noise = ctx.createBufferSource()
    noise.buffer = buf

    const bp = ctx.createBiquadFilter()
    bp.type = 'bandpass'
    bp.frequency.value = (550 + pitchVariance * 500)
    bp.Q.value = 1.8

    const ng = ctx.createGain()
    ng.gain.setValueAtTime(vol * 0.8, t)
    ng.gain.exponentialRampToValueAtTime(0.0001, t + duration + 0.01)

    noise.connect(bp)
    bp.connect(ng)
    ng.connect(ctx.destination)
    noise.start(t)
    noise.stop(t + duration + 0.02)

    // Tonal resonance — the low-frequency "thunk"
    if (i < 7) {
      const osc = ctx.createOscillator()
      const og = ctx.createGain()
      osc.type = 'triangle'
      osc.frequency.setValueAtTime((200 + pitchVariance * 100), t)
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.04)
      og.gain.setValueAtTime(vol * 0.22, t)
      og.gain.exponentialRampToValueAtTime(0.0001, t + 0.05)
      osc.connect(og)
      og.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.06)
    }
  }

  // ── Spinning/sliding sound (die skidding across surface) ────────────────────
  const spinStart = now + 0.05
  const spinDur = 0.7 + numDice * 0.1
  const spinBuf = ctx.createBuffer(1, Math.floor(ctx.sampleRate * spinDur), ctx.sampleRate)
  const spinRaw = spinBuf.getChannelData(0)
  for (let j = 0; j < spinRaw.length; j++) {
    spinRaw[j] = (Math.random() * 2 - 1) * 0.1
  }
  const spinner = ctx.createBufferSource()
  spinner.buffer = spinBuf

  const hp = ctx.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 3000

  const sg = ctx.createGain()
  sg.gain.setValueAtTime(0.10, spinStart)
  sg.gain.linearRampToValueAtTime(0.05, spinStart + spinDur * 0.6)
  sg.gain.exponentialRampToValueAtTime(0.0001, spinStart + spinDur)

  spinner.connect(hp)
  hp.connect(sg)
  sg.connect(ctx.destination)
  spinner.start(spinStart)
  spinner.stop(spinStart + spinDur + 0.05)

  setTimeout(() => { try { ctx.close() } catch { /* ignore */ } }, 3500)
}

/** Computes the start time of bounce i, slowing down exponentially */
function computeBounceTime(i: number, numDice: number): number {
  let t = 0
  for (let k = 0; k < i; k++) {
    // First few bounces fast, then slower — like a real die slowing down
    t += 0.055 + k * 0.038 + (k > 4 ? (k - 4) * 0.045 : 0) + Math.random() * 0.015
  }
  return Math.min(t * (1 + numDice * 0.06), 1.35)
}

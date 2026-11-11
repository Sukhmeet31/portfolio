// An original, locally synthesised ambient loop. No audio assets are fetched.
const chords = [
  [57, 60, 64, 67],
  [53, 57, 60, 64],
  [60, 64, 67, 71],
  [55, 59, 62, 67],
];
const melody = [0, 2, 1, 3, 2, 1, 3, 0];
const beat = 60 / 76 / 2;
type Voice = { oscillator: OscillatorNode; envelope: GainNode };

export class WorkshopAudio {
  private context = new AudioContext();
  private master = this.context.createGain();
  private filter = this.context.createBiquadFilter();
  private voices = new Set<Voice>();
  private timer: ReturnType<typeof setInterval> | null = null;
  private revision = 0;
  private closed = false;
  private wantsPlayback = false;
  private step = 0;
  private nextNote = 0;

  constructor() {
    this.master.gain.value = 0;
    this.master.connect(this.context.destination);
    this.filter.type = "lowpass";
    this.filter.frequency.value = 1900;
    this.filter.connect(this.master);
    const delay = this.context.createDelay(1);
    const feedback = this.context.createGain();
    const wet = this.context.createGain();
    delay.delayTime.value = beat * 1.5;
    feedback.gain.value = 0.24;
    wet.gain.value = 0.2;
    this.filter.connect(delay);
    delay.connect(feedback);
    feedback.connect(delay);
    delay.connect(wet);
    wet.connect(this.master);
  }

  get isPlaying() {
    return !this.closed && this.context.state === "running" && this.timer !== null;
  }

  private note(
    midi: number,
    time: number,
    duration: number,
    gain: number,
    type: OscillatorType = "sine",
  ) {
    const oscillator = this.context.createOscillator();
    const envelope = this.context.createGain();
    oscillator.type = type;
    oscillator.frequency.value = 440 * 2 ** ((midi - 69) / 12);
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(gain, time + 0.045);
    envelope.gain.exponentialRampToValueAtTime(0.0001, time + duration);
    oscillator.connect(envelope);
    envelope.connect(this.filter);
    const voice = { oscillator, envelope };
    this.voices.add(voice);
    oscillator.onended = () => {
      oscillator.disconnect();
      envelope.disconnect();
      this.voices.delete(voice);
    };
    oscillator.start(time);
    oscillator.stop(time + duration + 0.05);
  }

  private schedule = () => {
    if (this.closed || this.context.state !== "running") return;
    // Avoid catching up a backlog if the browser has throttled timers.
    this.nextNote = Math.max(this.nextNote, this.context.currentTime + 0.015);
    while (this.nextNote < this.context.currentTime + 0.22) {
      const chord = chords[Math.floor(this.step / 8) % chords.length];
      if (this.step % 8 === 0) {
        chord.forEach((note) =>
          this.note(note, this.nextNote, beat * 7.5, 0.035),
        );
        this.note(chord[0] - 12, this.nextNote, beat * 6, 0.08);
      }
      this.note(
        chord[melody[this.step % 8]] + 12,
        this.nextNote,
        beat * 2.3,
        this.step % 2 ? 0.045 : 0.07,
        "triangle",
      );
      this.step++;
      this.nextNote += beat;
    }
  };

  private releaseVoices() {
    for (const voice of this.voices) {
      voice.oscillator.stop();
      voice.oscillator.disconnect();
      voice.envelope.disconnect();
    }
    this.voices.clear();
  }

  async setPlaying(play: boolean): Promise<boolean> {
    if (this.closed) return false;
    this.wantsPlayback = play;
    const revision = ++this.revision;
    if (this.timer !== null) {
      clearInterval(this.timer);
      this.timer = null;
    }
    const now = this.context.currentTime;
    this.master.gain.cancelScheduledValues(now);
    if (!play) {
      this.master.gain.setTargetAtTime(0, now, 0.015);
      await new Promise((resolve) => setTimeout(resolve, 70));
      if (revision !== this.revision || this.closed) return false;
      await this.context.suspend();
      this.releaseVoices();
      return false;
    }
    this.releaseVoices();
    await this.context.resume();
    if (revision !== this.revision || this.closed) {
      // A delayed browser permission can resume after a newer pause request.
      if (!this.closed && !this.wantsPlayback) await this.context.suspend();
      return false;
    }
    this.master.gain.setTargetAtTime(
      0.3, // Fixed at the former volume slider's 100% setting.
      this.context.currentTime,
      0.04,
    );
    this.nextNote = this.context.currentTime + 0.04;
    this.schedule();
    this.timer = setInterval(this.schedule, 100);
    return this.context.state === "running";
  }

  destroy() {
    if (this.closed) return;
    this.closed = true;
    this.revision++;
    if (this.timer !== null) clearInterval(this.timer);
    this.releaseVoices();
    this.master.disconnect();
    void this.context.close().catch(() => {});
  }
}

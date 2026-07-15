export class DialogueSystem {
  private currentText = '';
  private displayedText = '';
  private charIndex = 0;
  private typeSpeed = 0.03;
  private typeTimer = 0;
  private active = false;
  private callback: (() => void) | null = null;

  queue: string[] = [];

  show(text: string, callback?: () => void): void {
    if (this.active) {
      this.queue.push(text);
      if (callback) {
        this._pendingCallbacks.push(callback);
      }
      return;
    }

    this.currentText = text;
    this.displayedText = '';
    this.charIndex = 0;
    this.typeTimer = 0;
    this.active = true;
    this.callback = callback ?? null;
  }

  skip(): void {
    if (!this.active) return;
    this.displayedText = this.currentText;
    this.charIndex = this.currentText.length;
    this.active = false;

    if (this.callback) {
      const cb = this.callback;
      this.callback = null;
      cb();
    }
  }

  update(delta: number): string {
    if (!this.active) return this.displayedText;

    this.typeTimer += delta;
    if (this.typeTimer >= this.typeSpeed) {
      this.typeTimer = 0;
      if (this.charIndex < this.currentText.length) {
        this.displayedText += this.currentText[this.charIndex];
        this.charIndex++;
      } else {
        this.active = false;
        if (this.callback) {
          const cb = this.callback;
          this.callback = null;
          cb();
        }
      }
    }

    return this.displayedText;
  }

  isTyping(): boolean {
    return this.active;
  }

  advance(): void {
    if (this.active) {
      this.skip();
    } else if (this.queue.length > 0) {
      const next = this.queue.shift()!;
      const nextCb = this._pendingCallbacks.shift() ?? null;
      this.show(next, nextCb ?? undefined);
    }
  }

  private _pendingCallbacks: (() => void)[] = [];
}

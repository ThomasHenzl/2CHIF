export abstract class Ball {
  protected readonly box: HTMLDivElement;
  protected element: HTMLDivElement;
  protected readonly x: number;
  protected y: number;
  protected size: number;
  protected color: string;
  protected velocityY: number;
 
  constructor(box: HTMLDivElement, x: number, size: number, color: string) {
    this.box = box;
    this.x = x;
    this.size = size;
    this.color = color;
 
    this.y = 0;
 
    this.velocityY = 0;
 
    this.element = document.createElement('div');
    this.element.className = 'ball';
    this.element.style.width = `${size}px`;
    this.element.style.height = `${size}px`;
    this.element.style.backgroundColor = color;
    this.box.appendChild(this.element);
 
    this.updatePosition();
  }
 
  abstract get bounciness(): number;
 
  protected onReachedBottom(): boolean {
    return true;
  }
 
  public remove(): void {
    this.element.remove();
  }
 
  public update(): boolean {
    const gravity = 0.5; // Downward acceleration per frame
    const minVelocity = 0.5;
    this.velocityY += gravity;
    this.y += this.velocityY;
    const boxHeight = this.box.clientHeight;
    if (this.y + this.size > boxHeight) {
      this.y = boxHeight - this.size;
      if (Math.abs(this.velocityY) > minVelocity) {
        this.velocityY = -this.velocityY * this.bounciness;
        if (!this.onReachedBottom()) {
          return false;
        }
      } else {
        this.velocityY = 0;
      }
    }
 
    if (this.y < 0) {
      this.y = 0;
      this.velocityY = -this.velocityY * this.bounciness;
    }
 
    this.updatePosition();
    return true;
  }
  private updatePosition(): void {
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;
  }
}
 
export class GummyBall extends Ball {
  constructor(box: HTMLDivElement, x: number, size: number) {
    super(box, x, size, '#ff6b6b');
  }
  get bounciness(): number {
    return 0.6;
  }
  protected onReachedBottom(): boolean {
    this.element.style.transform = 'scaleX(1.3) scaleY(0.7)';
    setTimeout(() => (this.element.style.transform = 'scaleX(1) scaleY(1)'), 150);
    return true;
  }
}
 
export class SteelBall extends Ball {
  constructor(box: HTMLDivElement, x: number, size: number) {
    super(box, x, size, '#c0c0c0');
  }
  get bounciness(): number {
    return 0.9;
  }
  protected onReachedBottom(): boolean {
    return true;
  }
}
 
export class ColorBall extends Ball {
  constructor(box: HTMLDivElement, x: number, size: number) {
    super(box, x, size, '#000000');
  }
 
  get bounciness(): number {
    return 0.7;
  }
 
  protected onReachedBottom(): boolean {
    const colors = ['#780000', '#669bbc', '#ffb703', '#e9edc9', '#ff006e'];
    const realColor = colors[Math.floor(Math.random() * colors.length)]!;
 
    this.element.style.backgroundColor = realColor; // statt this.color
 
    return true;
  }
}
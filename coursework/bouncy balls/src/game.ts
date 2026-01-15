import { Ball, GummyBall, SteelBall, ColorBall } from "./ball";
 
export class BouncingBallGame {
    private readonly box: HTMLDivElement;
    private  balls: Ball[] = [];
 
    constructor(boxId: string) {
        this.box = document.getElementById(boxId)! as HTMLDivElement;
    }
    private getRandomX(): number {
        return Math.random() * this.box.clientWidth;
    }
 
    public addGummyBall(): void {
        const x = this.getRandomX();
        const ball: GummyBall = new GummyBall(this.box, x, 40);
        this.balls.push(ball);
    }
 
    public addSteelBall(): void {
        const x = this.getRandomX();
        const ball: SteelBall = new SteelBall(this.box, x, 40);
        this.balls.push(ball);
    }
    public addColorBall(): void {
        const x = this.getRandomX();
        const ball: ColorBall = new ColorBall(this.box, x, 40);
        this.balls.push(ball);
    }
    private gameLoop = (): void => {
    const aliveBalls: Ball[] = [];
    for (const ball of this.balls) {
      const isAlive = ball.update();
      if (!isAlive) {
        // Ball is dead - remove it from the DOM
        ball.remove();
      } else {
        aliveBalls.push(ball);
      }
    }
    this.balls = aliveBalls;
 
    requestAnimationFrame(this.gameLoop);
  };
  public start(): void {
    requestAnimationFrame(this.gameLoop);
  }
}
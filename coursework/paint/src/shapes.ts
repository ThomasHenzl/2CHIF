export abstract class Shape {
  constructor(protected svgContainer: SVGSVGElement, protected start: Point) {}

  public abstract updatePosition(start: Point, end: Point): void
  public abstract set tempMode(isTemp:boolean)
}

export type Point = {
  x: number;
  y: number;
};

export type Size = {
  width: number;
  height: number;
};

export class Circle extends Shape {
  private center: Point = { x: 0, y: 0 };
  private radius = 100;
  private  circleElement: SVGCircleElement

  constructor(svgContainer: SVGSVGElement, protected start: Point) {
    super(svgContainer, start);
    this.circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    svgContainer.appendChild(this.circleElement);
  }

  public override updatePosition(start: Point, end: Point):void{
    this.radius = Math.sqrt(
      Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)
    )
    this.center = start
        this.circleElement.setAttribute('r', `${this.radius}`);
    this.circleElement.setAttribute('cx', `${start.x}`);
    this.circleElement.setAttribute('cy', `${start.y}`);
    this.circleElement.setAttribute('fill', 'red');
  }
   public override set tempMode(isTemp:boolean  ){
    if(isTemp){
      this.circleElement.classList.add('temp')
    }else{
      this.circleElement.classList.remove('temp')
    }
   }
}

export class Rectangle extends Shape {
  private position: Point = { x: 0, y: 0 };
  private size: Size = { width: 0, height: 0 };

  constructor(svgContainer: SVGSVGElement, protected start: Point) {
    super(svgContainer, start);
    const circleElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    circleElement.setAttribute('x', `${start.x}`);
    circleElement.setAttribute('y', `${start.y}`);
    circleElement.setAttribute('width', `${100}`);
    circleElement.setAttribute('height', `${100}`);

    svgContainer.appendChild(circleElement);
  }
  public override updatePosition(start: Point, end: Point):void{

  }
}

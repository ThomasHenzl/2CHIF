import { Shape, Circle, Point  } from './shapes';

type DrawingState ={
  currentTempShape: Shape
  start: Point
}
export class ShapeManager {
  private shapes: Shape[] = [];
  private container: SVGSVGElement;
  private currentTool: DrawingState | undefined = undefined

  constructor(svgContainerId: string = 'drawing-canvas') {
    this.container = document.getElementById(svgContainerId) as unknown as SVGSVGElement;
    this.container?.addEventListener('mousedown', (event) => {
      this.handleMouseDown(event);
    });
    this.container?.addEventListener('mouseup', (event) => {
      this.handleMouseUp(event);
    });
    this.container?.addEventListener('mousemove', (event) => {
      this.handleMouseMove(event);
    });
    this.container?.addEventListener('mouseleave', (event) => {
      this.handleMouseLeave(event);
    });
  }

  private handleMouseDown(event: MouseEvent): void {
    const circleCenter = this.getSVGCoordinates(event);
    const circle = new Circle(this.container, circleCenter);
    circle.tempMode = true
    this.shapes.push(circle);
    this.currentTool ={
      currentTempShape: circle,
      start: circleCenter
    };
  }

  private handleMouseUp(event: MouseEvent): void {
    this.currentTool!.currentTempShape.tempMode = false
this.currentTool = undefined
}
    private handleMouseMove(event: MouseEvent): void {
      if(this.currentTool){
        this.currentTool.currentTempShape.updatePosition(
          this.currentTool.start,
          this.getSVGCoordinates(event)
        )
      }
  }

      private handleMouseLeave(event: MouseEvent): void {
        this.currentTool!.currentTempShape.tempMode = false
this.currentTool = undefined
  }
  private getSVGCoordinates(event: MouseEvent): Point {
    // This method converts mouse event coordinates to SVG coordinates
    // (position relative to the SVG's left/top, taking viewBox into account)
    // ⚠️ This method is a little bit tricky due to SVG coordinate systems.
    // Don't worry about the details for now. Just use it as a template
    // whenever you need to convert mouse event coordinates to SVG coordinates.
    // If you want to fully understand it, use your favorite AI assistant
    // to explain.

    // Mouse events give us screen coordinates (pixels from window edge)
    // But we need SVG coordinates (units from viewBox origin)
    const svgPoint = this.container.createSVGPoint();
    svgPoint.x = event.clientX;
    svgPoint.y = event.clientY;

    // Transform: screen space → SVG user space
    const transformed = svgPoint.matrixTransform(this.container.getScreenCTM()?.inverse());

    return {
      x: transformed?.x || 0,
      y: transformed?.y || 0,
    };
  }
}

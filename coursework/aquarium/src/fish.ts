// Note: If you have something that only holds data, but does not have any methods,
// use a `type` instead of a `class` in TypeScript.
type Bounds = {
  left: number;
  top: number;
  right: number;
  bottom: number;
};

// Global fish manager instance
let globalFishManager: FishManager | null = null

export function setGlobalFishManager(manager: FishManager) {
  globalFishManager = manager
}

// Check: Can you remember what an abstract class is?
export abstract class Fish {
  private readonly element: HTMLImageElement;
  protected x: number;
  protected y: number;
  protected speedX: number;
  protected speedY: number;
  protected width: number = 0;
  protected height: number = 0;
  protected facingRight: boolean = true;

  public loaded: boolean = false;

  // Check: Can you remember what a constructor is?
  constructor(protected aquarium: HTMLElement, src: string, startX: number, startY: number, speedX: number, speedY: number) {
    this.x = startX;
    this.y = startY;
    this.speedX = speedX;
    this.speedY = speedY;

    // Create the element representing the fish
    this.element = document.createElement('img');
    this.element.src = src;
    this.element.classList.add('fish');
    this.element.style.position = 'absolute';

    this.element.onload = () => {
      // This is an important trick. We need to wait for the image
      // to load before we can get its dimensions.
      // 
      // Read this article to learn more about naturalWidth and naturalHeight:
      // https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/naturalWidth
      this.width = this.element.naturalWidth * 0.33;
      this.height = this.element.naturalHeight * 0.33;
      this.element.width = this.width;
      this.element.height = this.height;
      this.loaded = true;
      this.draw();
    };

    this.aquarium.appendChild(this.element);
    
    // Register with global fish manager
    if (globalFishManager) {
      globalFishManager.addFish(this)
    }
  }

  // Check: Can you remember what an abstract method is?
  abstract update(): void;

  // Draw is not abstract, so extended classes can override it, 
  // but they don't have to.
  draw(): void {
    if (!this.loaded) {
      return;
    }
    this.element.style.left = `${this.x}px`;
    this.element.style.top = `${this.y}px`;

    // Note that the BASE CLASS does the work of mirroring the image
    // if the fish is moving in the wrong direction. This is correct because
    // this is a behavior that ALL fish should have.
    if (this.speedX < 0 && this.facingRight) {
      // Fish is moving left, but the image is facing right, we must mirror it
      this.element.style.transform = 'scaleX(-1)';
      this.facingRight = false;
    } else if (this.speedX > 0 && !this.facingRight) {
      // Fish is moving right, but the image is facing left, we must mirror it
      this.element.style.transform = 'scaleX(1)';
      this.facingRight = true;
    }
  }

  getBounds(): Bounds {
    // Learn: This is how you create an instance of a type.
    return {
      left: this.x,
      top: this.y,
      right: this.x + this.width,
      bottom: this.y + this.height,
    };
  }

  // Called when the fish is detected to be out of bounds
  handleOutOfBounds(_aquariumWidth: number, _aquariumHeight: number): void {
    // Do nothing by default
  }
}

// Check: Can you remember what `extends` means?
export abstract class HorizontalCheckingFish extends Fish {
  handleOutOfBounds(aquariumWidth: number, _aquariumHeight: number) {
    const bounds = this.getBounds();
    if (bounds.left < 0) {
      // Fish is out of bounds on the left
      this.x = 0;
      this.speedX = -this.speedX;
    } else if (bounds.right > aquariumWidth) {
      // Fish is out of bounds on the right
      this.x = aquariumWidth - this.width;
      this.speedX = -this.speedX;
    }
  }
}

export abstract class BoundsCheckingFish extends HorizontalCheckingFish {
  handleOutOfBounds(aquariumWidth: number, aquariumHeight: number) {
    super.handleOutOfBounds(aquariumWidth, aquariumHeight);

    const bounds = this.getBounds();
    if (bounds.top < 0) {
      this.y = 0;
      this.speedY = -this.speedY;
    } else if (bounds.bottom > aquariumHeight) {
      this.y = aquariumHeight - this.height;
      this.speedY = -this.speedY;
    }
  }
}

// HorizontalFish does not need vertical bounds checking,
// so it extends HorizontalCheckingFish.
export class HorizontalFish extends HorizontalCheckingFish {
  update() {
    // Move horizontally
    this.x += this.speedX;
  }
}

// CrissCrossFish extends BoundsCheckingFish,
// so it has both horizontal and vertical bounds checking.
export class CrissCrossFish extends BoundsCheckingFish {
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
  }
}

// TODO: Create at least two new fish classes
// (e.g. a fish that swims in a circle, a fish that swims in a square, 
// a fish that does not move at all, etc.)

// SinusFish extends HorizontalCheckingFish, so it has horizontal bounds checking.
export class SinusFish extends HorizontalCheckingFish {
  private baseY: number;
  private time: number = 0;

  constructor(aquarium: HTMLElement, src: string, startX: number, startY: number, speedX: number) {
    super(aquarium, src, startX, startY, speedX, 0);
    this.baseY = startY;
  }

  update() {
    this.x += this.speedX;
    this.time += 0.05;
    this.y = this.baseY + Math.sin(this.time) * 50; // Amplitude 50
  }
}

// StaticFish does not move at all
export class StaticFish extends Fish {
  update() {
    // Do nothing - fish stays in place
  }
}

// CircleFish swims in a circular pattern
export class CircleFish extends Fish {
  private baseX: number;
  private baseY: number;
  private radius: number;
  private time: number = 0;
  private speed: number;

  constructor(aquarium: HTMLElement, src: string, startX: number, startY: number, radius: number = 80, speed: number = 0.05) {
    super(aquarium, src, startX, startY, 0, 0);
    this.baseX = startX;
    this.baseY = startY;
    this.radius = radius;
    this.speed = speed;
  }

  update() {
    this.time += this.speed;
    this.x = this.baseX + Math.cos(this.time) * this.radius;
    this.y = this.baseY + Math.sin(this.time) * this.radius;
  }
}

export class FishManager {
  // Note that we use the base class `Fish` here.   
  private fishes: Fish[] = [];

  // Check: Can you remember what the `private` keyword does in 
  // the parameter list of the constructor?
  constructor(private aquarium: HTMLElement) {
  }

  addFish(fish: Fish) {
    this.fishes.push(fish);
  }

  update() {
    const width = this.aquarium.clientWidth;
    const height = this.aquarium.clientHeight;

    for (const fish of this.fishes) {
      if (!fish.loaded) {
        continue;
      }

      // Check: Can you remember what polymorphism is?
      fish.update();
      fish.handleOutOfBounds(width, height);
      fish.draw();
    }
  }
}
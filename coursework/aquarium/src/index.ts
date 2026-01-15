import './style.css'
import { FishManager, HorizontalFish, CrissCrossFish, SinusFish, StaticFish, CircleFish, setGlobalFishManager } from './fish'

const aquarium = document.getElementById('aquarium')!
const fishManager = new FishManager(aquarium)

// Set the global fish manager so fish register themselves
setGlobalFishManager(fishManager)

// Add fish to the aquarium
new HorizontalFish(aquarium, '/assets/fish1.png', 100, 150, 3, 0)
new HorizontalFish(aquarium, '/assets/fish2.png', 200, 250, -2, 0)
new CrissCrossFish(aquarium, '/assets/fish3.png', 300, 200, 2, 0.5)
new CrissCrossFish(aquarium, '/assets/fish4.png', 400, 300, -2.5, -1)
new SinusFish(aquarium, '/assets/fish5.png', 150, 150, 2)
new SinusFish(aquarium, '/assets/fish6.png', 500, 250, -1.5)
new StaticFish(aquarium, '/assets/fish1.png', 700, 200, 0, 0)
new CircleFish(aquarium, '/assets/fish3.png', 300, 150, 150, 0  .04)


// Animation loop
function animate() {
  fishManager.update()
  requestAnimationFrame(animate)
}

animate()
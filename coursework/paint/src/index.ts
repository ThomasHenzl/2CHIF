import { ShapeManager } from './ShapeManager';
import './styles.css';
import { ToolSelection, ToolType } from './ToolSelection';
const ToolSelectionWidget = new ToolSelection((toolType) => console.log(toolType));
const shapeManager = new ShapeManager();

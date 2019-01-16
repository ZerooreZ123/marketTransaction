


export { default as Annotate } from "./Annotate";
export { default as LabelAnnotation } from "./LabelAnnotation";
export { default as SvgPathAnnotation } from "./SvgPathAnnotation";
export { default as SvgHighOrLowAnnotation } from "./SvgHighOrLowAnnotation";
export { default as Label } from "./Label";

const halfWidth = 10;
const bottomWidth = 3;
const height = 20;
const textWidth = 30;

export function buyPath({ x, y }) {
	return `M${x} ${y} `
		+ `L${x + halfWidth} ${y + halfWidth} `
		+ `L${x + bottomWidth} ${y + halfWidth} `
		+ `L${x + bottomWidth} ${y + height} `
		+ `L${x - bottomWidth} ${y + height} `
		+ `L${x - bottomWidth} ${y + halfWidth} `
		+ `L${x - halfWidth} ${y + halfWidth} `
		+ "Z";
}

export function sellPath({ x, y }) {
	return `M${x} ${y} `
		+ `L${x + halfWidth} ${y - halfWidth} `
		+ `L${x + bottomWidth} ${y - halfWidth} `
		+ `L${x + bottomWidth} ${y - height} `
		+ `L${x - bottomWidth} ${y - height} `
		+ `L${x - bottomWidth} ${y - halfWidth} `
		+ `L${x - halfWidth} ${y - halfWidth} `
		+ "Z";
}

export function highPath({ x, y, direction, textShow, fontSize, offsetY }) {
  offsetY *= -1;
  let offsetX, offsetT;
  if(direction){
    offsetX = -1 * textWidth;
    offsetT = -3;
  }else{
    offsetX = textWidth;
    offsetT = 3;
  }
  return {
    pathD: `M${x} ${y} L${x + offsetX} ${y + offsetY} Z`,
    textProps: {
      x: x + offsetX + offsetT,
      y: y + offsetY + fontSize * 0.5 - 2,
      style: {
        textAnchor: ['start', 'end'][Number(direction)],
        fontSize: `${fontSize}px`
      }
    }
  }
}

export function lowPath({ x, y, direction, textShow, fontSize, offsetY }) {
  let offsetX, offsetT;
  if(direction){
    offsetX = -1 * textWidth;
    offsetT = -3;
  }else{
    offsetX = textWidth;
    offsetT = 3;
  }
  return {
    pathD: `M${x} ${y} L${x + offsetX} ${y + offsetY} Z`,
    textProps: {
      x: x + offsetX + offsetT,
      y: y + offsetY + fontSize * 0.5 - 2,
      style: {
        textAnchor: ['start', 'end'][Number(direction)],
        fontSize: `${fontSize}px`,
      }
    }
  }
}

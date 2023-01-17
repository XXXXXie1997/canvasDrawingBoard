import { IAnyObject } from "@/interface/IAnyObject";

// 绘制圆点
const drawCircle = (
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  radius: number
) => {
  context.beginPath();
  context.arc(x, y, radius, 0, Math.PI * 2);
  context.fill();
  context.closePath();
};
// 绘制线条
const drawLine = (
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  context.beginPath();
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
};
// 使用铅笔
const pencil = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  drawCircle(context, x1, y1, context ? context.lineWidth / 2 : 1);
  drawLine(context, x1, y1, x2, y2);
};
const eraser = (
  canvas: HTMLCanvasElement,
  context: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number
) => {
  const asin =
    (context.lineWidth / 2) * Math.sin(Math.atan((y2 - y1) / (x2 - x1)));
  const acos =
    (context.lineWidth / 2) * Math.cos(Math.atan((y2 - y1) / (x2 - x1)));
  const x3 = x1 + asin;
  const y3 = y1 - acos;
  const x4 = x1 - asin;
  const y4 = y1 + acos;
  const x5 = x2 + asin;
  const y5 = y2 - acos;
  const x6 = x2 - asin;
  const y6 = y2 + acos;
  context.save();
  context.beginPath();
  context.arc(x1, y1, context ? context.lineWidth / 2 : 1, 0, Math.PI * 2);
  context.clip();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.restore();
  context.save();
  context.beginPath();
  context.moveTo(x3, y3);
  context.lineTo(x5, y5);
  context.lineTo(x6, y6);
  context.lineTo(x4, y4);
  context.closePath();
  context.clip();
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.restore();
};

export const tools: IAnyObject = {
  pencil: pencil,
  eraser: eraser,
};

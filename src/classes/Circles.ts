import { Accessor, Signal, createEffect, createSignal } from "solid-js";


const stepTime = 10;


class Color {
  r: number;
  g: number;
  b: number;
  a: number;
  constructor(r: number, g: number, b: number, a: number = 1) {
    this.r = r;
    this.g = g;
    this.b = b;
    this.a = a;
  }
  toString() {
    return `rgb(${this.r}, ${this.g}, ${this.b})`;
  }
}

class Circle {
  x: number;
  y: number;
  radius: number;
  color: Color;
  ctx: CanvasRenderingContext2D;
  imageCtx: CanvasRenderingContext2D;
  quadrant : Function;
  coolDown: boolean = false;
  constructor(
    x: number,
    y: number,
    radius: number,
    color: Color,
    ctx: CanvasRenderingContext2D,
    imageCtx: CanvasRenderingContext2D
  ) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.color = color;
    this.ctx = ctx;
    this.imageCtx = imageCtx;
    this.quadrant = this.getQuadrant.bind(this);
  }
  //the circle cords are normalized, I need to convert them back the real
  //canvas size shift them down by half the canvas size and right by half the canvas size



  async draw() {
    await this.quadrantBlack();
    let canvasWidth = this.ctx.canvas.width;
    let canvasHeight = this.ctx.canvas.height;

    //normalize the coords

    let x = this.x * canvasWidth + canvasWidth / 2;
    let y = this.y * canvasHeight + canvasHeight / 2;
    let radius = this.radius * canvasWidth;

    this.ctx.beginPath();
    this.ctx.arc(x, y, radius, 0, 2 * Math.PI);
    this.ctx.fillStyle = this.color.toString();
    this.ctx.fill();
    this.ctx.closePath();
  }


  getQuadrant() {
    let xmin = this.x - this.radius;
    let xmax = this.x + this.radius;
    let ymin = this.y - this.radius;
    let ymax = this.y + this.radius;
    return {xmin, xmax, ymin, ymax};
  }

  getColorFromXY(x: number, y: number, ctx: CanvasRenderingContext2D) {
    let canvasWidth = this.ctx.canvas.width;
    let canvasHeight = this.ctx.canvas.height;
    x = x * canvasWidth  + canvasWidth / 2;
    y = y * canvasHeight  + canvasHeight / 2;
    let pixel = ctx.getImageData(x, y, 1, 1);
    let color = `rgb(${pixel?.data[0]}, ${pixel?.data[1]}, ${pixel?.data[2]})`;
    return color;
  }

  changeColor(color: Color) {
    //redraw the circle with the new color
    this.color = color;
    this.draw();
  }

  async quadrantBlack() {
    let width = this.ctx.canvas.width;
    let quadrant = this.quadrant;
    this.ctx.fillStyle = 'black';
    //turn coords back to canvas coords
    let canvasQuadrant = {
        xmin: Math.floor(quadrant().xmin * width  + width / 2),
        xmax: Math.ceil(quadrant().xmax* width  + width / 2),
        ymin: Math.floor(quadrant().ymin* width + width / 2),
        ymax: Math.ceil(quadrant().ymax* width + width / 2)
    };
    this.ctx.fillRect(canvasQuadrant.xmin, canvasQuadrant.ymin, canvasQuadrant.xmax - canvasQuadrant.xmin, canvasQuadrant.ymax - canvasQuadrant.ymin);
  }

  beginCoolDown() {
    this.coolDown = true;
    setTimeout(() => {
        this.coolDown = false;
    }, stepTime * 30);
  
  }
}

//we're gonna use absolute coordinates for the circles
//so the canvas is always a square from -1 to 1 the coords are normalized, then transformed to the canvas size
export class Circles {

  circles: Circle[] = [];
  canvas: HTMLCanvasElement;
  pictureCanvas: HTMLCanvasElement;
  image: HTMLImageElement;
  ctx: CanvasRenderingContext2D | null;
  width: Function;
  height: Function;
  mouseSignal: Signal<{ x: number; y: number }>;
  mousePos: Accessor<{ x: number; y: number }>;
  animation: Signal<boolean> = createSignal(false);
  disabled : boolean = false;

  constructor(canvas: HTMLCanvasElement, img: HTMLImageElement) {
    let newR = innerWidth > innerHeight ? innerHeight / 2 : innerWidth / 2;

    window.circles = this.circles;

    // this.pictureCanvasRef = document.createElement('canvas');
    this.pictureCanvas = document.createElement("canvas");
    let ctx = this.pictureCanvas.getContext("2d", { willReadFrequently: true });
    this.pictureCanvas.width = newR * 2;
    this.pictureCanvas.height = newR * 2;
    this.image = img;

    this.mouseSignal = createSignal({ x: 0, y: 0 });
    this.mousePos = this.mouseSignal[0];

    this.width = this.getWidth;
    this.height = this.getWidth;

    let refcanvas = canvas;
    this.canvas = refcanvas;
    this.ctx = this.canvas.getContext("2d", { willReadFrequently: true });
    this.canvas.width = newR * 2;
    this.canvas.height = newR * 2;

 
    //make sure image is loaded
    img.onload = async () => {
      ctx?.drawImage(img, 0, 0, newR * 2, newR * 2);
      let firstCircle = new Circle(
        0,
        0,
        0.5,
        this.getColorFromXY(0, 0, ctx!),
        this.ctx!,
        ctx!
      );
      this.circles.push(firstCircle);

      await this.drawAllCircles();
    };

    this.addEventListeners();

    
  }
  async drawAllCircles() {
    if (this.disabled) return;
    //it is a two dimensional array
    for (let i = 0; i < this.circles.length; i++) {
        await this.circles[i].draw();
    }

  }

  getWidth() {
    if (this.disabled) return;
    let newR = innerWidth > innerHeight ? innerHeight / 2 : innerWidth / 2;
    return newR * 2;
  }


  addEventListeners() {
    if (this.disabled) return;
    this.canvas.addEventListener("mousemove", (e) => {
      if (this.disabled) return;
        //the canvas is not in the middle of the screen
        //calculate the distance from canvas left edge to the edge of the screen
        let canvas = this.canvas.getBoundingClientRect();
        console.log(canvas)
        let left = canvas.left;
        let top = canvas.top;


        let x = ((e.clientX-left) - this.width() / 2) / this.width();
        let y = ((e.clientY - top) - this.width() / 2)/ this.width();
        this.mouseSignal[1]({ x: x, y: y });
        this.mousePos();
    });

    //exact same event listener but for touch events
    this.canvas.addEventListener("touchmove", (e) => {
      if (this.disabled) return;
        let canvas = this.canvas.getBoundingClientRect();
        let left = canvas.left;
        let top = canvas.top;

        let x = ((e.touches[0].clientX - left) - this.width() / 2) / this.width();
        let y = ((e.touches[0].clientY - top) - this.width() / 2) / this.width();
        this.mouseSignal[1]({ x: x, y: y });
        this.mousePos();
    });


    //on window resize, we need to resize the canvas
    window.addEventListener("resize", () => {
      if (this.disabled) return;
      let width = this.width();
      this.canvas.width = width ;
      this.canvas.height = width;
      this.pictureCanvas.width = width;
      this.pictureCanvas.height = width;
      let ctx = this.pictureCanvas.getContext("2d", { willReadFrequently: true });
      let otherCtx = this.canvas.getContext("2d", { willReadFrequently: true });
      ctx?.drawImage(this.image, 0, 0, width, width);
    //   otherCtx?.drawImage(this.pictureCanvas, 0, 0, width, width);
      this.drawAllCircles();
    });

    this.checkHover();
  }

  getColorFromXY(x: number, y: number, ctx: CanvasRenderingContext2D) {
    let canvasWidth = ctx.canvas.width;
    let canvasHeight = ctx.canvas.height;
    x = x * canvasWidth  + canvasWidth / 2;
    y = y * canvasWidth  + canvasHeight / 2;
    let pixel = ctx.getImageData(x, y, 1, 1);
    let color = new Color(pixel?.data[0], pixel?.data[1], pixel?.data[2]);
    return color;
  }


  checkHover() {
    if (this.disabled) return;
    //check if the mouse is hovering over a circle

    let animation = false;
    createEffect(async() => {
      if (this.disabled) return;
        let x = this.mousePos().x;
        let y = this.mousePos().y;;
        if(animation === false) {
            if(this.circles.length > 0) {
                //instead of searching which quadrant I am on/
                //create a binary search function that returns the correct circle
                for(let i = 0; i < this.circles.length; i++) {
                    let circle = this.circles[i];
                    if(circle.coolDown != true) {
                        if(x >= circle.quadrant().xmin && x <= circle.quadrant().xmax && y >= circle.quadrant().ymin && y <= circle.quadrant().ymax) {
                            let dsquared = (x - circle.x) * (x - circle.x) + (y - circle.y) * (y - circle.y);
                            let rsquared = circle.radius * circle.radius;
                            if(dsquared <= rsquared) {
                                await this.animateCircleSplit(circle, this.ctx!);
                                
                            }else{
                                circle.changeColor(this.getColorFromXY(circle.x, circle.y, circle.imageCtx));
                            }
                        };
                    }
                  
                    
                }
            }
        };

     

        //first we check each quadrant square to determine if the mouse 

    });

    
  }




 



  async animateCircleSplit(circle: Circle, ctx: CanvasRenderingContext2D) {
    if (this.disabled) return;
    //min radius is 0.1

    if (circle.radius <= 0.004) {
      return;
    }

    if(circle.coolDown === true) {
        return;
    }



    //let draw a black rectangle over the whole quadrant
    circle.quadrantBlack();

    //every 20ms we're draw a new circle the distance the circle is moving is from 
    //r to r/2 and we want it to take 1 second to get there so we need to decide how many steps we need to take
    let r = circle.radius;
    let stepSize = r/40;
    let x = circle.x;
    let y = circle.y;

    //we need 3 more circles
    let circle1 = new Circle(x, y, r, this.getColorFromXY(x, y, circle.imageCtx), ctx, circle.imageCtx);
    let circle2 = new Circle(x, y, r, this.getColorFromXY(x, y, circle.imageCtx), ctx, circle.imageCtx);
    let circle3 = new Circle(x, y, r, this.getColorFromXY(x, y, circle.imageCtx), ctx, circle.imageCtx);

    //append the new circles to the circles array
    


    circle.beginCoolDown();
    circle1.beginCoolDown();
    circle2.beginCoolDown();
    circle3.beginCoolDown();

    this.circles.push(circle1);
    this.circles.push(circle2);
    this.circles.push(circle3);



    console.log("original radius", r);


    //now also change horizontal 

    for (let i = 0; i <= 20; i++) {

        await circle.quadrantBlack();
        let newRadius = r - i * stepSize;
        circle.radius = newRadius;
        circle.x = x - i * stepSize;
        circle.y = y - i * stepSize;
        circle.changeColor(this.getColorFromXY(circle.x, circle.y, circle.imageCtx));

        circle1.radius = newRadius;
        circle1.x = x + i * stepSize;
        circle1.y = y - i * stepSize;
        circle1.changeColor(this.getColorFromXY(circle1.x, circle1.y, circle1.imageCtx));

        circle2.radius = newRadius;
        circle2.x = x - i * stepSize;
        circle2.y = y + i * stepSize;
        circle2.changeColor(this.getColorFromXY(circle2.x, circle2.y, circle2.imageCtx));

        circle3.radius = newRadius;
        circle3.x = x + i * stepSize;
        circle3.y = y + i * stepSize;
        circle3.changeColor(this.getColorFromXY(circle3.x, circle3.y, circle3.imageCtx));



        await circle.draw();
        await new Promise((resolve) => setTimeout(resolve, stepTime));
    }

    //make the circles be sorted
    //remove cicle from the array
  



    //all the circle get a cooldown 


    return;




  }

  exportCirclesData(filename: string = 'circles-data.json') {
    if (this.disabled) return;
    
    // Helper function to convert normalized coords (-1 to 1) to grid coords (0 to 250)
    const normalizedToGrid = (normalizedCoord: number): number => {
      return Math.round((normalizedCoord + 1) * 125); // -1 becomes 0, 1 becomes 250
    };
    
    // Helper function for precise grid coordinates (preserves decimal precision)
    const normalizedToGridPrecise = (normalizedCoord: number): number => {
      return (normalizedCoord + 1) * 125; // Exact conversion without rounding
    };
    
    // Helper function to convert normalized radius to grid radius (ensuring minimum of 1)
    const normalizedRadiusToGrid = (normalizedRadius: number): number => {
      return Math.max(1, Math.round(normalizedRadius * 125)); // Ensure minimum radius of 1
    };
    
    // Helper function for precise radius conversion
    const normalizedRadiusToGridPrecise = (normalizedRadius: number): number => {
      return normalizedRadius * 125; // Exact conversion
    };
    
    // Create exportable data structure
    const exportData = {
      timestamp: new Date().toISOString(),
      canvasSize: {
        width: this.canvas.width,
        height: this.canvas.height,
        virtualSize: { min: -1, max: 1 }, // Document the virtual coordinate system
        gridSize: { width: 250, height: 250 } // Document the export grid system
      },
      circleCount: this.circles.length,
      minRadius: 0.004, // Document the minimum radius limit
      coordinateSystem: "Grid-based: (0,0) = top-left, max = (250,250)",
      circles: this.circles.map(circle => ({
        // Original normalized coordinates (for reference)
        normalized: {
          x: circle.x,
          y: circle.y,
          radius: circle.radius
        },
        // Converted grid coordinates
        grid: {
          x: normalizedToGrid(circle.x),
          y: normalizedToGrid(circle.y),
          radius: normalizedRadiusToGrid(circle.radius)
        },
        // Precise grid coordinates (preserves all resolution)
        gridPrecise: {
          x: normalizedToGridPrecise(circle.x),
          y: normalizedToGridPrecise(circle.y),
          radius: normalizedRadiusToGridPrecise(circle.radius)
        },
        color: {
          r: circle.color.r,
          g: circle.color.g,
          b: circle.color.b,
          a: circle.color.a
        },
        coolDown: circle.coolDown
      }))
    };

    // Create and download the file
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    console.log(`Exported ${this.circles.length} circles to ${filename}`);
    return exportData;
  }

  // Optional: Import function to restore circles from saved data
  importCirclesData(data: any) {
    if (this.disabled) return;
    
    try {
      // Clear existing circles
      this.circles = [];
      
      // Recreate circles from data
      data.circles.forEach((circleData: any) => {
        const color = new Color(
          circleData.color.r,
          circleData.color.g,
          circleData.color.b,
          circleData.color.a
        );
        
        const circle = new Circle(
          circleData.x,
          circleData.y,
          circleData.radius,
          color,
          this.ctx!,
          this.pictureCanvas.getContext("2d", { willReadFrequently: true })!
        );
        
        circle.coolDown = circleData.coolDown;
        this.circles.push(circle);
      });
      
      // Redraw all circles
      this.drawAllCircles();
      console.log(`Imported ${this.circles.length} circles`);
      
    } catch (error) {
      console.error('Error importing circles data:', error);
    }
  }
}

// Add type declaration for window.circles
declare global {
  interface Window {
    circles: Circle[];
  }
}

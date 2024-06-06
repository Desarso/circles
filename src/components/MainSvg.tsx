import { onMount } from "solid-js";
import { For } from "solid-js/web";
import Cat from "../images/puppy_1_400x400.jpg";
import { createSignal } from "solid-js";

type Props = {};

function MainSvg({}: Props) {
  let globalIndex = 0;
  let [color, setColor] = createSignal("black");
  let canvas;
  let img;
  let [width, setWidth] = createSignal(0);
  let [height, setHeight] = createSignal(0);
  let [radious, setRadious] = createSignal(0);
  let [yoffset, setYoffset] = createSignal(0);
  let [xoffset, setXoffset] = createSignal(0);
  let ctx: any;
  let [canSplit, setCanSplit] = createSignal(true);

  const delay = (delayInms: number) => {
    return new Promise((resolve) => setTimeout(resolve, delayInms));
  };

  async function replaceWithFour(target: any, previous: any) {
    let shape = "circle";
    if (target.getAttribute("r") < 1) {
      return;
    }
    let classes = ["top-left", "top-right", "bottom-left", "bottom-right"];
    let parentElement = target.parentElement;
    let currentElement = target;
    let newElements = [];
    for (let i = 0; i < 4; i++) {
      let circle = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "circle"
      );
      circle.setAttribute("cx", target.getAttribute("cx"));
      circle.setAttribute("cy", target.getAttribute("cy"));
      circle.setAttribute("r", target.getAttribute("r"));
      circle.setAttribute("class", "circle");
      circle.setAttribute("fill", "rgb(229, 231, 214)");
      newElements.push(circle);
    }

    let currentCx: number = target.getAttribute("cx");
    let currentCy: number = target.getAttribute("cy");
    let currentR: number = target.getAttribute("r");
    let halfCurrentCx: number = currentCx / 2;
    let halfCurrentCy: number = currentCy / 2;
    let halfCurrentR: number = currentR / 2;

    // console.log(newElements[0]);
    target.remove();
    // parentElement.appendChild(newElements[0]);
    for (let i = 0; i < 4; i++) {
      await parentElement.appendChild(newElements[i]);
      // await delay(1);
    }

    await delay(5);
    for (let i = 0; i < 4; i++) {
      if (i === 0) {
        await newElements[i].setAttribute(
          "cx",
          (+currentCx - +halfCurrentR).toString()
        );
        await newElements[i].setAttribute(
          "cy",
          (+currentCy - +halfCurrentR).toString()
        );
        await newElements[i].setAttribute("r", (currentR / 2).toString());
        await newElements[i].setAttribute(
          "fill",
          getColorFromXY(
            +currentCx - +halfCurrentR - xoffset(),
            +currentCy - +halfCurrentR - yoffset()
          )
        );
      }
      if (i === 1) {
        await newElements[i].setAttribute(
          "cx",
          (+halfCurrentR + +currentCx).toString()
        );
        await newElements[i].setAttribute(
          "cy",
          (+currentCy - +halfCurrentR).toString()
        );
        await newElements[i].setAttribute("r", (currentR / 2).toString());
        await newElements[i].setAttribute(
          "fill",
          getColorFromXY(
            +halfCurrentR + +currentCx - xoffset(),
            +currentCy - +halfCurrentR - yoffset()
          )
        );
      }
      if (i === 2) {
        await newElements[i].setAttribute(
          "cx",
          (+currentCx - +halfCurrentR).toString()
        );
        await newElements[i].setAttribute(
          "cy",
          (+halfCurrentR + +currentCy).toString()
        );
        await newElements[i].setAttribute("r", (currentR / 2).toString());
        await newElements[i].setAttribute(
          "fill",
          getColorFromXY(
            +currentCx - +halfCurrentR - xoffset(),
            +halfCurrentR + +currentCy - yoffset()
          )
        );
      }
      if (i === 3) {
        await newElements[i].setAttribute(
          "cx",
          (+halfCurrentR + +currentCx).toString()
        );
        await newElements[i].setAttribute(
          "cy",
          (+halfCurrentR + +currentCy).toString()
        );
        await newElements[i].setAttribute("r", (currentR / 2).toString());
        await newElements[i].setAttribute(
          "fill",
          getColorFromXY(
            +halfCurrentR + +currentCx - xoffset(),
            +halfCurrentR + +currentCy - yoffset()
          )
        );
      }
    }

    await delay(10);
    for (let i = 0; i < 4; i++) {
      newElements[i].addEventListener("pointerenter", async (e) => {
        await delay(1);
        await replaceWithFour(e.target, previous);
      });
      newElements[i].addEventListener(
        "touchmove",
        async (e) => {
          let x = e.touches[0].clientX;
          let y = e.touches[0].clientY;
          let newElement = document.elementFromPoint(x, y);

          console.log(newElement?.nodeName);

          if (newElement?.nodeName === "circle" && canSplit() === true) {
            setCanSplit(false);
            await delay(6);
            await replaceWithFour(newElement, previous);
            setCanSplit(false);
          } else if (canSplit() === false && newElement?.nodeName === "svg") {
            setCanSplit(true);
          } else {
            return;
          }
        },
        { passive: true }
      );
    }
  }

  onMount(async () => {
    await delay(100);
    // console.log(innerHeight);
    // console.log(innerWidth);
    // let innerHeight = 2000;
    // let innerWidth = 2000;

    let newR = innerWidth > innerHeight ? innerHeight / 2 : innerWidth / 2;
    setRadious(newR);
    setYoffset(innerHeight / 2 - radious());
    setXoffset(innerWidth / 2 - radious());
    setWidth(innerWidth / 2);
    setHeight(innerHeight / 2);
    canvas = document.querySelector("canvas");
    img = await fetchAndProcessImage();
    canvas.width = newR * 2;
    canvas.height = newR * 2;
    ctx = canvas.getContext("2d", { willReadFrequently: true });
    ctx.drawImage(img, 0, 0, newR * 2, newR * 2);

    let pixel = await ctx.getImageData(100, 100, 1, 1);
    // console.log(img);
    // console.log(`rgb(${pixel.data[0]}, ${pixel.data[1]}, ${pixel.data[2]}, ${pixel.data[3]})`);
    setColor(
      `rgb(${pixel.data[0]}, ${pixel.data[1]}, ${pixel.data[2]}, ${pixel.data[3]})`
    );
    // if(pixel.data[3] === 0) location.reload();

    //add and event lister for touch and for hover
    let upload = document.querySelector(".upload") as HTMLDivElement;
    upload.addEventListener("click", async () => {
      await handleImageUpload();
    });

    let dot0 = document.querySelector("#dot0");

    dot0.addEventListener("pointerenter", async (e) => {
      replaceWithFour(e.target, "none");
    });
    dot0.addEventListener(
      "touchmove",
      async (e) => {
        replaceWithFour(e.target, "none");
      },
      { passive: true }
    );
  });

  function getColorFromXY(x: number, y: number) {
    let pixel = ctx.getImageData(x, y, 1, 1);
    let color = `rgb(${pixel.data[0]}, ${pixel.data[1]}, ${pixel.data[2]})`;
    // console.log(color);
    return color;
  }

  async function resetSvg() {
    let svg = document.querySelector("svg");
    let circles = document.querySelectorAll(".circle");
    circles.forEach((circle) => {
      circle.remove();
    });
    let color = getColorFromXY(width() / 2, height() / 2);
    let circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle"
    );
    circle.setAttribute("cx", width());
    circle.setAttribute("cy", height());
    circle.setAttribute("r", radious());
    circle.setAttribute("class", "circle");
    circle.setAttribute("fill", color);
    circle.addEventListener("pointerenter", async (e) => {
      await delay(1);
      await replaceWithFour(e.target, "none");
    });
    circle.addEventListener(
      "touchmove",
      async (e) => {
        replaceWithFour(e.target, "none");
      },
      { passive: true }
    );
    svg.appendChild(circle);
  }

  async function fetchAndProcessImage() {
    const host = "https://cors-anywhere.herokuapp.com/";
    const catapi = host + "https://api.thecatapi.com/v1/images/search";
    let url = "";
    await fetch(catapi)
      .then((response) => response.json())
      .then((data) => {
        url = data[0].url;
      });
    const response = await fetch(host + url);
    const blob = await response.blob();
    const image = await createImageBitmap(blob);

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = 500;
    canvas.height = 500;

    let startX, startY, sideLength;
    if (image.width > image.height) {
      sideLength = image.height;
      startX = (image.width - sideLength) / 2;
      startY = 0;
    } else {
      sideLength = image.width;
      startX = 0;
      startY = (image.height - sideLength) / 2;
    }

    ctx.drawImage(
      image,
      startX,
      startY,
      sideLength,
      sideLength,
      0,
      0,
      500,
      500
    );
    const dataURL = canvas.toDataURL();
    const resultImage = document.createElement("img");
    resultImage.src = dataURL;

    //attach to root
    return resultImage;
  }

  async function handleImageUpload() {
    //prompt user to upload image
    let input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.click();
    //turn the image into an image element

    input.addEventListener("change", async () => {
      let file = input.files[0];
      let reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async () => {
        let img = new Image();
        img.src = reader.result as string;
        img.onload = () => {
          let canvas = document.querySelector("canvas") as HTMLCanvasElement;
          let newR = innerWidth > innerHeight ? innerHeight / 2 : innerWidth / 2;
          canvas.width = newR * 2;
          canvas.height = newR * 2;
          let startX, startY, sideLength;
          if (img.width > img.height) {
            sideLength = img.height;
            startX = (img.width - sideLength) / 2;
            startY = 0;
          } else {
            sideLength = img.width;
            startX = 0;
            startY = (img.height - sideLength) / 2;
          }
          ctx.drawImage(
            img,
            startX,
            startY,
            sideLength,
            sideLength,
            0,
            0,
            newR * 2,
            newR * 2
          );
          const dataURL = canvas.toDataURL();
          const resultImage = document.createElement("img");
          resultImage.src = dataURL;
          resetSvg();
        };
      };
    });
  }

  return (
    <div class="dots">
      <svg>
        <circle
          id={`dot${globalIndex++}`}
          cx={width()}
          cy={height()}
          r={radious()}
          fill={color()}
        />
      </svg>
      <div class="upload">Upload</div>
      <canvas class="noDisplay"></canvas>
    </div>
  );
}

export default MainSvg;

//what needs to happend, maybe all the circles begin generated to certain definition
//then when each circle is hovered, then it will then first render the four circle on top of it,
//and then it will transition those four circles to a new position and change the size.

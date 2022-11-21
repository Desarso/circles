import { onMount } from 'solid-js';
import { For } from 'solid-js/web';
import Cat from '../images/puppy_1_400x400.jpg';
import { createSignal } from 'solid-js';

type Props = {}

function MainSvg({}: Props) {

    let number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let globalIndex = 0;
    let [color, setColor] = createSignal('black');
    let canvas;
    let img;
    let [width, setWidth] = createSignal(0);
    let [height, setHeight] = createSignal(0);
    let [radious, setRadious] = createSignal(0);
    let [yoffset, setYoffset] = createSignal(0);
    let [xoffset, setXoffset] = createSignal(0);
    let ctx : any;
    let [canSplit, setCanSplit] = createSignal(true);
    let previousX = -1000;


    const delay = (delayInms: number) => {
        return new Promise(resolve => setTimeout(resolve, delayInms));
      }



    async function replaceWithFour(target: any, previous : any) {
        let shape = "circle";
        if(target.getAttribute('r') < 1) { return};
        let classes = ["top-left", "top-right", "bottom-left", "bottom-right"];
        let parentElement = target.parentElement;
        let currentElement = target;
        let newElements = [];
        for(let i = 0; i < 4; i++) {
            let circle = document.createElementNS("http://www.w3.org/2000/svg",'circle');
            circle.setAttribute('cx', target.getAttribute('cx'));
            circle.setAttribute('cy', target.getAttribute('cy'));
            circle.setAttribute('r', target.getAttribute('r'));
            circle.setAttribute('class', 'circle');
            // circle.setAttribute('fill', 'black');
            newElements.push(circle);
        }
        
        let currentCx : number = target.getAttribute('cx');
        let currentCy : number = target.getAttribute('cy');
        let currentR : number = target.getAttribute('r');
        let halfCurrentCx : number = currentCx / 2;
        let halfCurrentCy : number = currentCy / 2;
        let halfCurrentR : number = currentR / 2;
      

        // console.log(newElements[0]);
        target.remove();
        // parentElement.appendChild(newElements[0]);
        for(let i = 0; i < 4; i++) {
            await parentElement.appendChild(newElements[i]);
            // await delay(1);
        }

        
        await delay(10);
        for(let i = 0; i < 4; i++) {
            if(i === 0){
                await newElements[i].setAttribute('cx', (+currentCx - +halfCurrentR).toString());
                await newElements[i].setAttribute('cy', (+currentCy - +halfCurrentR).toString());
                await newElements[i].setAttribute('r', (currentR/ 2).toString());
                await newElements[i].setAttribute('fill', getColorFromXY(+currentCx - +halfCurrentR - xoffset(), +currentCy - +halfCurrentR - yoffset()));
            }
            if(i===1){
                await newElements[i].setAttribute('cx', (+halfCurrentR + +currentCx).toString());
                await newElements[i].setAttribute('cy', (+currentCy - +halfCurrentR).toString());
                await newElements[i].setAttribute('r', (currentR / 2).toString());
                await newElements[i].setAttribute('fill', getColorFromXY(+halfCurrentR + +currentCx  - xoffset(), +currentCy - +halfCurrentR - yoffset()));
            }
            if(i===2){
                await newElements[i].setAttribute('cx', (+currentCx - +halfCurrentR).toString());
                await newElements[i].setAttribute('cy', (+halfCurrentR + +currentCy).toString());
                await newElements[i].setAttribute('r', (currentR / 2).toString());
                await newElements[i].setAttribute('fill', getColorFromXY(+currentCx - +halfCurrentR  - xoffset(), +halfCurrentR + +currentCy - yoffset()));
            }
            if(i===3){
                await newElements[i].setAttribute('cx', (+halfCurrentR + +currentCx).toString());
                await newElements[i].setAttribute('cy', (+halfCurrentR + +currentCy).toString());
                await newElements[i].setAttribute('r', (currentR / 2).toString());
                await newElements[i].setAttribute('fill', getColorFromXY(+halfCurrentR + +currentCx  - xoffset(), +halfCurrentR + +currentCy - yoffset()));
            }
          
        }

        await delay(100)
        for(let i = 0; i < 4; i++) {
            newElements[i].addEventListener('pointerenter', async(e) => {
                await delay(1);
                await replaceWithFour(e.target, "none");
              })
            newElements[i].addEventListener('touchmove', async (e) => {
                let x = e.touches[0].clientX;
                let y = e.touches[0].clientY;
                let newElement = document.elementFromPoint(x, y);

                console.log(newElement?.nodeName);
                
                if(newElement?.nodeName === "circle" && canSplit() === true) {
                    setCanSplit(false);
                    await delay(11)
                    await replaceWithFour(newElement, previous);
                    setCanSplit(false);
                }else if(canSplit() === false && newElement?.nodeName === 'svg') {
                    setCanSplit(true);
                }else{
                    return;
                }
              })
        }

    ;

    }


    onMount(async () => {
        await delay(100);
        // console.log(innerHeight);
        // console.log(innerWidth);
      
        let newR = innerWidth > innerHeight ? innerHeight / 2 : innerWidth / 2;
        setRadious(newR);
        setYoffset(innerHeight / 2 - radious());
        setXoffset(innerWidth / 2 - radious());
        setWidth(innerWidth/2);
        setHeight(innerHeight/2);
        canvas = document.querySelector('canvas');
        img = document.querySelector('img');                                                                                            
        canvas.width = newR*2;
        canvas.height = newR*2;
        ctx = canvas.getContext('2d',{willReadFrequently: true} );
        ctx.drawImage(img, 0, 0, newR*2, newR*2);

        let pixel = ctx.getImageData(100, 100, 1, 1);
        // console.log(img);
        // console.log(`rgb(${pixel.data[0]}, ${pixel.data[1]}, ${pixel.data[2]}, ${pixel.data[3]})`);
        setColor(`rgb(${pixel.data[0]}, ${pixel.data[1]}, ${pixel.data[2]}, ${pixel.data[3]})`);
        // if(pixel.data[3] === 0) location.reload();
    });

    function getColorFromXY(x : number, y : number) {
        let pixel = ctx.getImageData(x, y, 1, 1);
        let color = `rgb(${pixel.data[0]}, ${pixel.data[1]}, ${pixel.data[2]})`;
        // console.log(color);
        return color;
    }



  return (
    <div class='dots'>
        <svg>
             <circle id={`dot${globalIndex++}`}
             cx={width()} cy={height()} r={radious()} fill={color()}
             onPointerEnter={(e) => replaceWithFour(e.target, "none")}
             onTouchStart={(e) => {replaceWithFour(e.target, "none")}}
             />
          
            
        </svg>
        <img src={Cat} class="noDisplay"></img>
        <canvas class= "noDisplay">
        
         </canvas>
    </div>
  )
}

export default MainSvg


//what needs to happend, maybe all the circles begin generated to certain definition
//then when each circle is hovered, then it will then first render the four circle on top of it,
//and then it will transition those four circles to a new position and change the size.
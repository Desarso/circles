import { onMount } from 'solid-js';
import { For } from 'solid-js/web';
import Cat from '../images/cat_400x400.jpg';
import { createSignal } from 'solid-js';

type Props = {}

function MainSvg({}: Props) {

    let number = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    let globalIndex = 0;
    let [color, setColor] = createSignal('black');
    let canvas;
    let img;
    let ctx : any;


    const delay = (delayInms: number) => {
        return new Promise(resolve => setTimeout(resolve, delayInms));
      }



    async function replaceWithFour(e: any) {
        if(e.target.getAttribute('r') < 3) return;
        let classes = ["top-left", "top-right", "bottom-left", "bottom-right"];
        let parentElement = e.target.parentElement;
        let currentElement = e.target;
        let newElements = [];
        for(let i = 0; i < 4; i++) {
            let circle = document.createElementNS("http://www.w3.org/2000/svg",'circle');
            circle.setAttribute('cx', e.target.getAttribute('cx'));
            circle.setAttribute('cy', e.target.getAttribute('cy'));
            circle.setAttribute('r', e.target.getAttribute('r'));
            circle.setAttribute('class', 'circle');
            // circle.setAttribute('fill', 'black');
            newElements.push(circle);
        }
        
        let currentCx : number = e.target.getAttribute('cx');
        let currentCy : number = e.target.getAttribute('cy');
        let currentR : number = e.target.getAttribute('r');
        let halfCurrentCx : number = currentCx / 2;
        let halfCurrentCy : number = currentCy / 2;
        let halfCurrentR : number = currentR / 2;
      

        // console.log(newElements[0]);
        e.target.remove();
        // parentElement.appendChild(newElements[0]);
        for(let i = 0; i < 4; i++) {
            await parentElement.appendChild(newElements[i]);
            // await delay(1);
        }

        
        await delay(1);
        for(let i = 0; i < 4; i++) {
            if(i === 0){
                await newElements[i].setAttribute('cx', (+currentCx - +halfCurrentR).toString());
                await newElements[i].setAttribute('cy', (+currentCy - +halfCurrentR).toString());
                await newElements[i].setAttribute('r', (currentR/ 2).toString());
                await newElements[i].setAttribute('fill', getColorFromXY(+currentCx - +halfCurrentR, +currentCy - +halfCurrentR));
            }
            if(i===1){
                await newElements[i].setAttribute('cx', (+halfCurrentR + +currentCx).toString());
                await newElements[i].setAttribute('cy', (+currentCy - +halfCurrentR).toString());
                await newElements[i].setAttribute('r', (currentR / 2).toString());
                await newElements[i].setAttribute('fill', getColorFromXY(+halfCurrentR + +currentCx, +currentCy - +halfCurrentR));
            }
            if(i===2){
                await newElements[i].setAttribute('cx', (+currentCx - +halfCurrentR).toString());
                await newElements[i].setAttribute('cy', (+halfCurrentR + +currentCy).toString());
                await newElements[i].setAttribute('r', (currentR / 2).toString());
                await newElements[i].setAttribute('fill', getColorFromXY(+currentCx - +halfCurrentR, +halfCurrentR + +currentCy));
            }
            if(i===3){
                await newElements[i].setAttribute('cx', (+halfCurrentR + +currentCx).toString());
                await newElements[i].setAttribute('cy', (+halfCurrentR + +currentCy).toString());
                await newElements[i].setAttribute('r', (currentR / 2).toString());
                await newElements[i].setAttribute('fill', getColorFromXY(+halfCurrentR + +currentCx, +halfCurrentR + +currentCy));
            }
          
        }


        for(let i = 0; i < 4; i++) {
            await delay(100);
            newElements[i].addEventListener('pointerenter', (e) => {
                replaceWithFour(e);
              })
        }

    ;

    }


    onMount(async () => {
        await delay(10);
        canvas = document.querySelector('canvas');
        img = document.querySelector('img');
        canvas.width = 800;
        canvas.height = 800;
        ctx = canvas.getContext('2d',{willReadFrequently: true} );
        ctx.drawImage(img, 0, 0, 800, 800);

        let pixel = ctx.getImageData(100, 100, 1, 1);
        console.log(img);
        console.log(`rgb(${pixel.data[0]}, ${pixel.data[1]}, ${pixel.data[2]}, ${pixel.data[3]})`);
        setColor(`rgb(${pixel.data[0]}, ${pixel.data[1]}, ${pixel.data[2]}, ${pixel.data[3]})`);

    });

    function getColorFromXY(x : number, y : number) {
        let pixel = ctx.getImageData(x, y, 1, 1);
        let color = `rgb(${pixel.data[0]}, ${pixel.data[1]}, ${pixel.data[2]})`;
        console.log(color);
        return color;
    }



  return (
    <div class='dots'>
        <svg width={800} height={800}>
            {/* <For each={number}>
                {(item, hindex) => (\jobs\companies
                      <For each={number}>{
                        (i, index) => (
                            <circle cx={20+(index()*40)} cy={20+(hindex()*40)} r="20" fill='black' />
                        )
                    }
                    </For>
                )}
            </For> */}
             <circle id={`dot${globalIndex++}`}
             cx={400} cy={400} r="400" fill={color()}
             onPointerEnter={(e) => replaceWithFour(e)}
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
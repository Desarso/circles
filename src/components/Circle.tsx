import { onMount } from 'solid-js';
import { For } from 'solid-js/web';
import Cat from '../images/cat.jpg';
import { createSignal } from 'solid-js';
import { Circles } from '../classes/Circles';

type Props = {}

function Circle({}: Props) {
    
    const host = "https://cors-anywhere.herokuapp.com/"
    const catapi= host+"https://api.thecatapi.com/v1/images/search"
  
    onMount(async () => {
        let canvas = document.querySelector('canvas') as HTMLCanvasElement;
        let img = await fetchAndProcessImage() as HTMLImageElement;
        let main = new Circles(canvas, img);
        let upload = document.querySelector('.upload') as HTMLDivElement;
        upload.addEventListener('click', () => {
            handleImageUpload(main);
        });
    

    });

    async function fetchAndProcessImage() {
        let url = "";
        await fetch(
            catapi
        )
        .then(response => response.json())
        .then(data => {
            url = data[0].url;
        })
        const response = await fetch(host+url);
        const blob = await response.blob();
        const image = await createImageBitmap(blob);
    
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
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
    
        ctx.drawImage(image, startX, startY, sideLength, sideLength, 0, 0, 500, 500);
        const dataURL = canvas.toDataURL();
        const resultImage = document.createElement('img');
        resultImage.src = dataURL;

        //attach to root
        return resultImage;


    }


    async function handleImageUpload(main: Circles) {
        //prompt user to upload image
        let input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*';
        input.click();
        //turn the image into an image element

        input.addEventListener('change', async () => {
            let file = input.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                let img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    let canvas = document.querySelector('canvas') as HTMLCanvasElement;
                    let ctx = canvas.getContext('2d');
                    canvas.width = 500;
                    canvas.height = 500;
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
                    ctx.drawImage(img, startX, startY, sideLength, sideLength, 0, 0, 500, 500);
                    const dataURL = canvas.toDataURL();
                    const resultImage = document.createElement('img');
                    resultImage.src = dataURL;
                    main.disabled = true;
                    let other = new Circles(canvas, resultImage);
                }
            }
        });


    }






  return (
    <div class='dots'>
        <div class="upload">
            Upload
        </div>
        <canvas class= "noDispla">
        
         </canvas>
    </div>
  )
}

export default Circle


//what needs to happend, maybe all the circles begin generated to certain definition
//then when each circle is hovered, then it will then first render the four circle on top of it,
//and then it will transition those four circles to a new position and change the size.
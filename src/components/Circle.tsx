import { onMount } from 'solid-js';
import { For } from 'solid-js/web';
import Cat from '../images/cat.jpg';
import { createSignal } from 'solid-js';
import { Circles } from '../classes/Circles';

type Props = {}

function Circle({}: Props) {
    
    let circlesInstance: Circles | null = null;
  
    onMount(async () => {
        let canvas = document.querySelector('canvas') as HTMLCanvasElement;
        let img = await fetchAndProcessImage() as HTMLImageElement;
        circlesInstance = new Circles(canvas, img);
        
        // Setup event listeners after circlesInstance is created
        setupEventListeners();
    });

    function setupEventListeners() {
        let upload = document.querySelector('.upload') as HTMLDivElement;
        upload.addEventListener('click', () => {
            handleImageUpload(circlesInstance!);
        });

        // Add export button functionality with proper error handling
        let exportBtn = document.querySelector('.export') as HTMLDivElement;
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                console.log('Export button clicked, circlesInstance:', circlesInstance);
                if (circlesInstance) {
                    console.log('About to export, circles count:', circlesInstance.circles.length);
                    try {
                        circlesInstance.exportCirclesData(`circles-export-${Date.now()}.json`);
                        console.log('Export completed successfully');
                    } catch (error) {
                        console.error('Export failed:', error);
                    }
                } else {
                    console.error('Circles instance is null');
                }
            });
            console.log('Export button event listener added');
        } else {
            console.error('Export button not found');
        }
    }

    async function fetchAndProcessImage() {
        //`https://api.allorigins.win/get?url=${encodeURIComponent('https://api.thecatapi.com/v1/images/search')}`
        const catapi =  `https://api.allorigins.win/get?url=${encodeURIComponent('https://api.thecatapi.com/v1/images/search')}`
        console.log(catapi);
        let url = "";
        await fetch(
            catapi
        )
        .then(response => response.json())
        .then(data => {
            data = JSON.parse(data.contents);
            url = data[0].url;
        })
        const response = await fetch('https://corsproxy.io/?' + encodeURIComponent(url));
        const blob = await response.blob();
        const image = await createImageBitmap(blob);
    
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) throw new Error('Could not get canvas context');
        canvas.width = 4000;
        canvas.height = 4000;
    
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
    
        ctx.drawImage(image, startX, startY, sideLength, sideLength, 0, 0, 4000, 4000);
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
            if (!input.files || input.files.length === 0) return;
            let file = input.files[0];
            let reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                let img = new Image();
                img.src = reader.result as string;
                img.onload = () => {
                    let canvas = document.querySelector('canvas') as HTMLCanvasElement;
                    let ctx = canvas.getContext('2d');
                    if (!ctx) return;
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
                    circlesInstance = new Circles(canvas, resultImage);
                }
            }
        });


    }






  return (
    <div class='dots'>
        <div class="controls">
            <div class="upload">
                Upload
            </div>
            <div class="export">
                Export
            </div>
        </div>
        <canvas>
        
         </canvas>
    </div>
  )
}

export default Circle


//what needs to happend, maybe all the circles begin generated to certain definition
//then when each circle is hovered, then it will then first render the four circle on top of it,
//and then it will transition those four circles to a new position and change the size.
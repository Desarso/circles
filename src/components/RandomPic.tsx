import { Component, createSignal, onMount } from "solid-js";

const RandomPic: Component<{}> = (props) => {



    onMount(async () => {
        //fetch images from the cat api
        fetchAndProcessImage();
    });

    async function fetchAndProcessImage() {
        const catapi= "https://api.thecatapi.com/v1/images/search"
        let url = "";
        await fetch(catapi)
        .then(response => response.json())
        .then(data => {
            url = data[0].url;
        })
        const response = await fetch(url);
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


  
  return <div class="thingy">
  </div>;   
};

export default RandomPic;
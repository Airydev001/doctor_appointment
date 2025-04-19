export default {
    content: ['./src/**/*.{js,jsx,ts,tsx}', './index.html'],
   // 
   // or 'media' or 'class'
    // content: [
    //  "./index.html" ,
    //  './src/**/*.{js,jsx,ts,tsx}'  
    // ],
   theme: {
        extend: {
            colors:{
            primary:"#5f6fff"
            },
            "gridTemplateColumns":{
               auto: 'repeat(auto-fill, minmax(200px,1fr))' 
            }
        },
    },
   
    plugins: [],
}
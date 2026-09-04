const BACKEND_URL = "http://localhost:3000";
export const getImageUrl = (imagePath)=>{
    if(!imagePath){
        return "/placeholder-food.jpg";
    }
    if(imagePath.startsWith("http")){
        return imagePath;
    }
    return `${BACKEND_URL}${imagePath}`;
};
const url = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_REACT_CLOUDINARY_CLOUD_NAME}/auto/upload`

const uploadFile = async (file) => {
     const formData = new FormData();
     formData.append('file', file);
     formData.append('upload_preset', "chat-app-file");

     try {
          const response = await fetch(url, {
               method: "POST",
               body: formData,
               headers: {
                    'Content-Type': 'multipart/form-data'
               }
          })
          const resData = await response.json()
          return resData;
     } catch (error) {
          
          console.log("Error uploading file", error);
          return null;
     }
}

export default uploadFile


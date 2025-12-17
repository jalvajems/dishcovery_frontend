import axios from 'axios'

import { useState } from "react";

interface UploadResult {
    fileUrl: string | null;
    uploadToS3: (file: File) => Promise<string | null>;
    loading: boolean;
    error: string | null;
}
export const useAwsS3Upload=():UploadResult=>{
    const [fileUrl, setFileUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadToS3=async(file:File)=>{
        try {
            setLoading(true);
            setError(null);

            const {data}=await axios.post('/api/file/file-upload',{
                    fileName: file.name,
                    fileType: file.type,
                });
                console.log('datafetch',data.data);
                

            const  {uploadUrl,fileUrl}=data.data;
            console.log("upload url",uploadUrl);
            
            const s3Response=await fetch(uploadUrl,{
                method:"PUT",
                body:file,
                headers:{
                    "Content-Type":file.type,
                },
            });
            console.log("jhereeeeeeee");
            console.log(s3Response);
            
            
            if(!s3Response)throw new Error("s3 upload failed")
            
                setFileUrl(fileUrl)
                return fileUrl;
        } catch (error) {
            console.error("S3 upload error:", error);
            setError("Upload failed");
            return null;

        }finally {
            setLoading(false);
        }

    };
    return {fileUrl,uploadToS3,loading,error}

}
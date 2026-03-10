import API from "./apiInstance";

export const getSignedUrlApi = (fileName: string, fileType: string) => {
    return API.post('/file/file-upload', { fileName, fileType });
};

import { format } from "date-fns";
import { decamelize, decamelizeKeys } from "humps";

export function blobToFile(blob : any, fileName : string) {
    // Create a new File object from the Blob
    const file = new File([blob], fileName, { type: blob.type });
    return file;
}

export const createFormData = (data: any, formData = new FormData(), parentKey = '') => {
    for (const property in data) {
        if (data.hasOwnProperty(property)) {
            const key = decamelize(parentKey ? `${parentKey}[${property}]` : property);
            switch(typeof data[property]) {
                case 'object' : {
                    if (data[property] instanceof FileList) {
                        // If the property is a FileList, append each file to formData
                        const fileList = data[property];
                        for (let i = 0; i < fileList.length; i++) {
                            // Set FileList as multiple input with [] (Array)
                            formData.append(`${key}[${i}]`, fileList[i]);
                        }
                    } else if (data[property] instanceof File) {
                        // If the property is a File, append it to formData
                        formData.append(key, data[property]);
                    } else if (data[property] instanceof Date) {
                        formData.append(key, format( data[property], "yyyy-MM-dd HH:mm:ss"));
                    } else {
                        // If the property is an object (excluding FileList and File), recursively call createFormData
                        createFormData(data[property], formData, key);
                    }
                    break;
                }
                case 'boolean' : {
                    if(data[property] == true) formData.append(key, '1');
                    if(data[property] == false) formData.append(key, '0');
                    break;
                }
                default : {
                    formData.append(key, data[property]);
                    break;
                }
            }
        }
    }
    return formData;
};



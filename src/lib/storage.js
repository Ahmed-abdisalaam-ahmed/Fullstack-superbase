import { v4 as uuidv4} from 'uuid'
import supabase from './superbase';


export const uploadImage = async(file, userId , bucket = 'featured-image')=> {

    try {

        // file extension    shehab.jpeg   ['shehab' , ' jpeg']
        const fileExt = file.name.split('.').pop().toLowerCase();
        
        //  create a unique file path xaxaxxxs-wawewee.wwt.png 
        
        const filename = `${uuidv4()}.${fileExt}`;
        const filePath = `${userId}/${filename}`;

        // upload the file to supabase

        const {data , error} = await supabase.storage 

            .from(bucket)
            .upload(filePath,file, {
                contentType: file.type,
                cacheControl: '3600',
                upsert: true,
            })

            if(error) throw error;


            // get the puplic URL for the uploaded file 

            const { data: urlData } = supabase.storage.from(bucket).getPublicUrl(filePath)

            return {
                path: filePath,
                url: urlData.publicUrl
            }
    } catch (error) {
        console.error("Error uploading image: ", error)
        throw error
    }
}
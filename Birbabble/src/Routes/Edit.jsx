import Form from "../Components/Form"
import { data, useParams } from 'react-router';
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../client.js'

const Edit = () => {
    const { id } = useParams();
    const [currentPost, setCurrentPost] = useState(null);
    const [postImg, setPostImg] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const {data: dataA, error : errorA} = await supabase 
                .from('content')
                .select('*')
                .eq('id', id)
                .single();
            if (errorA) console.error(errorA);
            setCurrentPost(dataA);
            
            if (dataA.containsImg == true) {
                const { data: file, error : errorB } = await supabase.storage
                    .from('images')
                    .download(dataA.id + "");
                if (errorB) console.error(errorB);
                setPostImg(file);
            }
        }
        fetchData();
    }, [])

    return(
        <Form o={currentPost} img={postImg}/>
    )
}

export default Edit
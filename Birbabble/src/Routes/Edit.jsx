import Form from "../Components/Form"
import { Link } from "react-router";
import { CaretLeftIcon } from "@radix-ui/react-icons";
import { data, useParams } from 'react-router';
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../client.js'
import { Skeleton } from "@radix-ui/themes";

const Edit = () => {
    const [loading, setLoading] = useState(true);
    const { id } = useParams();
    const [currentPost, setCurrentPost] = useState(null);
    const [postImg, setPostImg] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
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
            setLoading(false);
        }
        fetchData();
    }, [])

    return(
        <>  
            <Link className='backButton' to="/">
                <CaretLeftIcon height="30" width="30"></CaretLeftIcon>
                Back
            </Link>
            {loading ? 
                <Skeleton className="formSkeleton"></Skeleton>
                :
                <Form o={currentPost} img={postImg}/>
            }
        </>
    )
}

export default Edit
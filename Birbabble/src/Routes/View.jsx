
import { supabase } from '../client'
import { Navigate, useNavigate } from "react-router"
import { useParams } from 'react-router';
import { TextField} from '@radix-ui/themes';
import { useEffect, useState } from 'react';
import './View.css'

const View = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [currentPost, setCurrentPost] = useState({comments: []});
    const [postImg, setPostImg] = useState(null);
    const [currentComment, setCurrentComment] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            let {data: dataA, error : errorA} = await supabase 
                .from('content')
                .select('*')
                .eq('id', id)
                .single();
            if (errorA) console.error(errorA);
                dataA.created_at = new Date(dataA.created_at).toLocaleString("en-US", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false
                    })
            setCurrentPost(dataA);
            
            if (dataA.containsImg == true) {
                const { data: file, error : errorB } = await supabase.storage
                    .from('images')
                    .download(dataA.id + "");
                if (errorB) console.error(errorB);
                setPostImg(file);
            }
        }
        fetchData()
    }, [])

    const onLike = async (e) => {
        e.preventDefault();
        setCurrentPost((prev) => ({
            ...prev,
            likes: prev.likes + 1
        }))
        const { data, error } = await supabase
            .from("content")
            .update({ likes: currentPost.likes + 1})     // fields you want to update
            .eq("id", id);       
        if (error) console.error(error);
    }

    const updateComment = (e) => {
        setCurrentComment(e.target.value);
    }

    const updateCommentDB = async (e) => {
        e.preventDefault();
        setCurrentPost((prev) => ({
            ...prev,
            comments: [...prev.comments, currentComment]
        }))
        setCurrentComment("");
        const { data, error } = await supabase
        .from("content")
        .update({comments: [...currentPost.comments, currentComment]})    
        .eq("id", id);       
        if (error) console.error(error);
    }

    const eraseFromDB = async (e) => {
        e.preventDefault();
        const { error : errorA } = await supabase
        .from("content")
        .delete() 
        .eq("id", id);   
        if (errorA) console.error(errorA);
        if (postImg != null) {
            const { error : errorB } = await supabase.storage
            .from("images")
            .remove([id + ""]);
            if (errorB) console.error(errorB);
        }
        navigate("/");
    }

    const changeToEdit = (e) => {
        e.preventDefault();
        navigate(`/edit/${id}`);
    }


    return (
        <div className='View'>
            <div className='utilityButtons'>
                <button className='pageButton edit' onClick={changeToEdit} ></button>
                <button className='pageButton erase' onClick={eraseFromDB}></button>
            </div>
            <div className='upperSection'>
                <div className='mainInfo'>
                    <h2>{currentPost.title}</h2>
                    {currentPost.tag != "" ? 
                        <h4 className="tag">{currentPost.tag}</h4> 
                        :
                        <></>
                    }
                    <h4>{"Posted: " + currentPost.created_at}</h4>
                    <div className="likeButtonContainer">
                        <button className="likeButton" onClick={onLike}></button>
                        <h4>{currentPost.likes}</h4>
                    </div>
                </div>
                {postImg != null ? 
                    <img src={postImg != null ? URL.createObjectURL(postImg) : null}></img>
                    :
                    <></>
                }
                
            </div>
            <div className='lowerSection'>
                <p className='description'>{currentPost.description}</p>
                <div className='commentContainer'>
                    <form className='commentForm' onSubmit={updateCommentDB}>
                        <TextField.Root className='textRoot commentInput' variant="soft" placeholder="Make a comment!" value={currentComment} onChange={updateComment}></TextField.Root>
                        <input type="submit" className="submit pageButton" value="Post"></input>
                    </form>
                    <div className='comments'>
                        {currentPost.comments.map((o, i) => {
                            return <p key={i} className='comment'>{o}</p>
                        })}
                    </div>
                </div>
            </div>  
        </div>
    )
}

export default View
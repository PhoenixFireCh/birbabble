import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router"
import { supabase } from '../client'
import { TextField, TextArea } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useDropzone } from "react-dropzone";
import './Form.css'

const Form = ({o, img}) => {
    const navigate = useNavigate();
    const [birds, setBirds] = useState([]);
    const [search, setSearch] = useState("");
    const [response, setResponse] = useState({
        title:'',
        description: '',
        tag: '',
        containsImg: false,
    })
    const [uploadedImage, setImg] = useState(null)
    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        maxFiles: 1,
        maxSize: 1 * 1024 * 1024, // 1MB
        accept: {
        "image/png": [],
        "image/jpeg": [],
        "image/webp": []
        },
        onDrop: (incomingFiles) => {
            setImg(incomingFiles[0])
            setResponse((prev) => ({...prev,
            containsImg: true
        }))
        }
    });
    const previewImgActive = uploadedImage != null;

    useEffect(() => {
        if (o != null) {
            setResponse(o);
            setImg(img);
        }
    }, [o, img])

    useEffect(() => {
        const fetchData = async () => {
            if (search != '') {
                const response = await fetch('https://ornithophile.vercel.app/api/birds?common_name=' + search);
                const json = await response.json();
                setBirds(json);
            }
        }
        const timeout = setTimeout(() => {
            fetchData().catch(console.error)
        }, 500);
        return () => clearTimeout(timeout)
    }, [search]) // Due to the sheer amount of data (over 11,000 birds), searching must be handled on the server.

    const submitToDB = async (e) => {
        e.preventDefault()
        //Post
        if (o == null) {
            const { data: dataA , error : errorA } =  await supabase
                .from('content')
                .insert(response)
                .select()
                .single();
            if (errorA) console.error("UPLOAD DATA: " + errorA);

            //FILE MANAGEMENT
            if (uploadedImage != null) {
                const id = dataA.id; 
                const { data: dataB , error: errorB } = await supabase.storage
                    .from('images')
                    .upload(`${id}`, uploadedImage);
                if (errorB) console.error("IMAGE UPLOAD: " + errorB);
            }
        } else {
            const { data: dataA , error : errorA } =  await supabase
                .from('content')
                .update(response)
                .eq("id", response.id);
            if (errorA) console.error("UPLOAD DATA: " + errorA);
            if (uploadedImage != null) {
                const { data: dataB , error: errorB } = await supabase.storage
                    .from('images')
                    .upload(`${response.id}`, uploadedImage, {
                        upsert: true
                    });
                if (errorB) console.error("IMAGE UPLOAD: " + errorB);
            } else if (img != null) {
                //Attempts to delete the img if uploaded image is null but there is an image returned.
                const { data: dataB , error: errorB } = await supabase.storage
                    .from('images')
                    .remove([response.id + ""])
            }
        }
        navigate("/")
    }

    const updateResponse = (e) => {
        e.preventDefault();
        const {name, value} = e.target;
        setResponse((prev) => ({
            ...prev,
            [name]: value
        }))
    }

    const updateSearch = (e) => {
        e.preventDefault();
        setSearch(e.target.value);
    }

    const onTagClick = (e) => {
        e.preventDefault();
        setResponse((prev) => ({...prev,
            tag:e.target.value
        }))
    }

    const clearImage = (e) => {
        e.preventDefault();
        setImg(null);
        setResponse((prev) => ({...prev,
            containsImg: false
        }))
    }

    return (
        <form className="Form" onSubmit={submitToDB}>
            <div className="upperSection">
                <div className="mainInputs">
                    <TextField.Root name='title' className='textRoot titleText' variant="soft" placeholder="Title" onChange={updateResponse} value={response.title}></TextField.Root>
                    <div className="tagForm">
                        <TextField.Root name='search' className='textRoot' variant="soft" placeholder="Search birds" onChange={updateSearch}>
                            <TextField.Slot className='textField'>
                                <MagnifyingGlassIcon height="30" width="30" />
                            </TextField.Slot>
                        </TextField.Root>
                        <h4 className="tag">{response.tag}</h4>
                    </div>
                    <div className="tagsContainer">
                        {birds.length == 0 ? 
                            (<h4 className="tagsPlaceholder">No birds? Search for tags!</h4>) 
                            : 
                            (<>
                                {birds.map((o) => {
                                    return <button key={o.id} value={o.common_name} onClick={onTagClick} className="tag selectableTags">
                                        {o.common_name}
                                    </button>
                                })}
                            </>)
                        }
                    </div>
                </div>
                <div className={(!previewImgActive ? '' : 'shifted') + ' imageInput'}>
                    {!previewImgActive ? (<>
                            <div {...getRootProps({className: "dropzone"})}>
                                <input {...getInputProps()} />
                                <p>Drag and drop an image! (1MB Max)</p>
                            </div>
                            </>)
                        :
                        (<>
                            <button className="clearImage" onClick={clearImage}>X</button>
                            <img className="previewImg" src={previewImgActive ? URL.createObjectURL(uploadedImage) : null}></img>
                        </>)
                    }
                </div>
            </div>
            <div className="lowerSection">
                <TextArea name="description" className="description descriptionArea" placeholder="Description" value={response.description} onChange={updateResponse}/>
                <input type="submit" className="submit pageButton" value={o == null ? "Create Post" : "Edit Post"}></input>
            </div>
        </form>
    )
}

export default Form
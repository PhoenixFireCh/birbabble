import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router"
import { supabase } from '../client'
import { TextField, TextArea } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useDropzone } from "react-dropzone";
import './Form.css'

const Form = ({o, edit}) => {
    const navigate = useNavigate();
    const [birds, setBirds] = useState([]);
    const [search, setSearch] = useState("");
    const [response, setResponse] = useState({
        title: o == null ? '' : o.title,
        description: o == null ? '' : o.description,
        tag: o == null ? '' : o.tag,
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
        }
    });
    const previewImgActive = uploadedImage != null;


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
        if (o) { //Edit

        } else { //Post
            e.preventDefault();
            const { data: dataA , error : errorA } =  await supabase
                .from('content')
                .insert(response)
                .select()
                .single();
            if (errorA) console.error("UPLOAD DATA: " + errorA);

            //FILE MANAGEMENT (Can't find any other way to reduce the number of API calls that utilizes supabase ID)
            if (uploadedImage != null) {
                const id = dataA.id; 
                const { data: dataB , error: errorB } = await supabase.storage
                    .from('images')
                    .upload(`${id}`, uploadedImage);
                if (errorB) console.error("IMAGE UPLOAD: " + errorB);
            }
            navigate("/")
        }
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
    }

    return (
        <form className="Form" onSubmit={submitToDB}>
            <div className="upperSection">
                <div className="mainInputs">
                    <TextField.Root name='title' className='textRoot titleText' variant="soft" placeholder="Title" onChange={updateResponse}></TextField.Root>
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
                <TextArea name="description" className="description descriptionArea" placeholder="Description" onChange={updateResponse}/>
                <input type="submit" className="submit pageButton" value="Create Post"></input>
            </div>
        </form>
    )
}

export default Form
import { useEffect, useState } from "react"
import { Navigate, useNavigate } from "react-router"
import { supabase } from '../client'
import './Form.css'

const Form = ({o}) => {
    const navigate = useNavigate();
    const [birds, setBirds] = useState([]);
    const [search, setSearch] = useState("");
    const [response, setResponse] = useState({
        title: o == null ? '' : o.title,
        description: o == null ? '' : o.description,
        tag: o == null ? '' : o.tag,
        img: o == null ? null : o.img,
    })



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
            console.log(response);
            let { data, error } =  await supabase
                .from('content')
                .insert(response)
            if (error) console.error(error);
            // Discard the draft so the submitted data isn't restored on re-entry.
            navigate("/")
        }
    }

    const updateResponse = (e) => {
        e.preventDefault();
        const {name, value} = e.target;

        if (name === 'img') {
            setResponse((prev) => ({
                ...prev,
                img: e.target.files[0]
            }))
        } else {
            setResponse((prev) => ({
                ...prev,
                [name]: value
            }))
        }
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

    return (
        <div className="Form">
            <form onSubmit={submitToDB}>
                <div className="upperSection">
                    <div className="mainInputs">
                        <input name="title" className="text" type="text" placeholder="Title" onChange={updateResponse}></input>
                        <div className="tagForm">
                            <input name="search" className="text" type="text" placeholder="Search Tags" onChange={updateSearch}></input>
                            <h3>{response.tag}</h3>
                        </div>
                        <div className="tagsContainer">
                            {birds.map((o) => {
                                return <button key={o.id} value={o.common_name} onClick={onTagClick}>
                                    {o.common_name}
                                </button>
                            })}
                        </div>
                    </div>
                    <div className="imageInput">
                        <input name="img" type="file" className="file" accept=".png,.jpg,.jpeg" onChange={updateResponse}></input>
                    </div>
                </div>
                <textarea name="description" onChange={updateResponse}>
                    
                </textarea>
                <input type="submit" className="submit" value="Create Post"></input>
            </form>
        </div>
    )
}

export default Form
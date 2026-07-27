import { useEffect, useState } from 'react'
import './Home.css'
import Post from '../Components/Post.jsx';
import { supabase } from '../client.js';
import { TextField } from '@radix-ui/themes';
import * as Select from "@radix-ui/react-select";
import { MagnifyingGlassIcon, TriangleDownIcon } from "@radix-ui/react-icons";



function Home() {
    const [totalContent, setTotalContent] = useState([]);
    const [popular, setPopular] = useState([]);
    const [display, setDisplay] = useState([]);
    const [ordering, setOrdering] = useState("newest");
    const [search, setSearch] = useState("");

    const sorters = {
        "newest": (a, b) => new Date(b.created_at) - new Date(a.created_at),
        "popular": (a, b) => b.likes - a.likes,
    };

    //Use Effect
    useEffect(() => {
        const fetchData = async () => {
            let {data, error} = await supabase 
                .from('content')
                .select("*");
            if (error) console.error(error);
            data.forEach(row => {
                row.created_at = new Date(row.created_at).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                    hour12: false
                                });
            })
            setTotalContent(data);
        }
        fetchData();
    }, [])

    useEffect(() => {
        orderItems();
    }, [ordering, search])

    useEffect(() => {
        orderItems();
        filterPopular();
    }, [totalContent])

    const orderItems = () => {
        let result = [...totalContent];
        if (search != "") {
            result = result.filter(item => 
                item.title.toLowerCase().includes(search.toLowerCase())
            );
        }
        setDisplay(result.sort(sorters[ordering]));
    }

    const filterPopular = () => {
        let toFilter = [...totalContent];
        setPopular(toFilter.sort((a, b) => {
            const da = new Date(a.created_at);
            const db = new Date(b.created_at);
            const dayA = new Date(da.getFullYear(), da.getMonth(), da.getDate());
            const dayB = new Date(db.getFullYear(), db.getMonth(), db.getDate());

            if (dayA.getTime() !== dayB.getTime()) {
                return dayA - dayB; 
            }
            return b.likes - a.likes; 
        }))
    }

    const updateLikes = async (e) => {
        e.preventDefault();
        const id = e.target.value;
        setTotalContent(totalContent.map(item =>
            item.id == id
                ? { ...item, likes: item.likes + 1 }  //Change it
                : item) //Unchanged
        );
        const { data, error } = await supabase
            .from("content")
            .update({ likes: totalContent.find(item => item.id == id).id + 1})     // fields you want to update
            .eq("id", id);       
        if (error) console.error(error);
    }

    const onSearch = (e) => {
        e.preventDefault()
        setSearch(e.target.value);
    }

    return (
        <div className='Home'>
            <div className='sideBarContainer'>
                <div className='popularBar'>
                    <h2 className='headerTags'>
                        Popular sighting of the day
                    </h2>
                    <div className='popularPosts'>
                        {popular.map((o) => {
                            return <Post key={o.id} k={o.id} title={o.title} tag={o.tag} likes={o.likes} date={o.created_at} onLike={updateLikes} type="BigPost"/>
                        })}
                    </div>
                </div>
            </div>
            <div className='content'>
                <form>
                    <TextField.Root className='textRoot' variant="soft" placeholder="Search posts" onChange={onSearch}>
                        <TextField.Slot className='textField'>
                            <MagnifyingGlassIcon height="30" width="30" />
                        </TextField.Slot>
                    </TextField.Root>
                    <Select.Root value={ordering} onValueChange={setOrdering}>
                        <Select.Trigger className='selectTrigger'>
                            <Select.Value className='selectValue'/>
                            <TriangleDownIcon height="20" width="20" />
                        </Select.Trigger>

                        <Select.Content className='selectContent' position="popper" sideOffset={4} >
                            <Select.Item value="newest" className='selectItem'>
                                <Select.ItemText className='SelectItemText'>Newest</Select.ItemText>
                            </Select.Item>

                            <Select.Item value="popular" className='selectItem'>
                                <Select.ItemText className='SelectItemText'>Most Popular</Select.ItemText>
                            </Select.Item>
                        </Select.Content>
                    </Select.Root>
                </form>
                <div className='list'>
                    {display.map((o) => {
                        return <Post key={o.id} k={o.id} title={o.title} tag={o.tag} likes={o.likes} date={o.created_at} onLike={updateLikes} type="SmallPost"/>
                    })}
                </div>
            </div>
            <div className='sideBarContainer'>
                <div className='infoBar'>
                    <div className='additionalContent'></div>
                    <div className='footer'>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home
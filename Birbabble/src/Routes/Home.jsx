import { useState } from 'react'
import './Home.jsx'
import SmallPost from '../Components/SmallPost.jsx';

function Home() {
    const [totalContent, setTotalContent] = useState([]);
    const [popular, setPopular] = useState([]);
    const [display, setDisplay] = useState([]);

    //Use Effect

    return (
        <div className='Home'>
            <div className='sideBarContainer'>
                <div className='sideBar'>
                    <div className='popularPosts'>
                        {popular.map((o) => {
                            return <SmallPost title={popular.title} tag={popular.tag} likes={popular.likes} date={popular.created_at}/>
                        })}
                    </div>
                </div>
            </div>
            <div className='content'>
                {popular.map((o) => {
                    return <SmallPost title={popular.title} tag={popular.tag} likes={popular.likes} date={popular.created_at}/>
                })}
            </div>
        </div>
    )
}

export default Home
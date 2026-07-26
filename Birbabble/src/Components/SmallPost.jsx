import './SmallPost.css'


const SmallPost = ({title, tag, likes, date, onClick, onLike}) => {

    return(
        <div className="SmallPost">
            <div className="upperSection">
                <h3>{title}</h3>
                {/* Section to remove it if tag not there */}
                <div className="tag"></div>
            </div>
            <div className="lowerSection">
                <div className="likeButtonContainer">
                    <button className="likeButton">
                        {/* svg */}
                    </button>
                    <h4>{likes}</h4>
                </div>
                <h4>Posted on: {date}</h4>
            </div>
        </div>
    )
}

export default SmallPost
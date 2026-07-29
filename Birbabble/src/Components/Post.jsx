import './SmallPost.css'
import './BigPost.css'


const Post = ({title, tag, likes, date, onClick, onLike, id, type}) => {

    return(
        <div className={type + " Post"} data-value={id} onClick={onClick}>
            <div className="upperSection">
                <h3>{title}</h3>
                {tag && <h4 className="tag">{tag}</h4>}
            </div>
            <div className="lowerSection">
                <div className="likeButtonContainer">
                    <button className="likeButton" value={id} onClick={onLike}>
                    </button>
                    <h4>{likes}</h4>
                </div>
                <h4>Posted on: {date}</h4>
            </div>
        </div>
    )
}

export default Post
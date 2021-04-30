import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { FaRegHeart, FaHeart } from 'react-icons/fa'

//import "../questions/Question.css";
import { createLike, deleteLike, fetchLikes } from '../../store/modules/likes/actions/likesaction';
import { history } from '../../history'


const Likes = ({ questionsID }) => {

  const dispatch = useDispatch()

  const currentState = useSelector((state) => state);
  const questionsLikes  =  currentState.LikesState
  const currentUserState = useSelector((state) => state.Auth);

  const authID = currentUserState ? currentUserState.userId : ""

  let questionsLike = []
  let likeID = null
  let authLiked  = false

  if(questionsLikes){
    // eslint-disable-next-line array-callback-return
    questionsLikes.likeItems.map(eachItem => {
      if(eachItem.questionID === questionsID){
        questionsLike = eachItem.likes
        // eslint-disable-next-line array-callback-return
        eachItem.likes.map(eachLike => {
          if(eachLike.user_id === authID){
            authLiked = true
            likeID = eachLike.id
          } 
        })  
      }
    }) 
  }

  const getQuestionsLikes = id => dispatch(fetchLikes(id));
  const addLike = details => dispatch(createLike(details))
  const removeLike = details => dispatch(deleteLike(details))

  useEffect(() => {
    getQuestionsLikes(questionsID);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const unLike = (e) => {
    e.preventDefault()
    let id = likeID
    removeLike({id, questionsID})
  }

  const saveLike = (e) => {
    e.preventDefault()
    addLike({
      question_id: questionsID,
      user_id: authID
    })
  }

  const likeToggle = (e) => {
    e.preventDefault()
    authLiked ? unLike(e) : saveLike(e)
  }
  const noAuth = (e) => {
    e.preventDefault()
    history.push('/login');
  }

  return (
    <div className="style-fav">
      <div className="style-heart-outer">
        <span className="mr-4">
          { authID ? (
            <span onClick={likeToggle}>
            { authLiked ? 
              <FaHeart className="style-auth"/>
              :
              <FaRegHeart className="style-heart"/>
              
            }
            <span className="ml-2">
              {questionsLike.length}
            </span>
          </span>
          ) : (
          <span onClick={noAuth}>
              <FaRegHeart className="style-heart"/>
            <span className="ml-2">
              {questionsLike.length}
            </span>
          </span>
          )}
        </span>
      </div>
    </div>
  )
}

export default Likes
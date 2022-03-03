import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import PostCard from '../PostCard'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class PostsItem extends Component {
  state = {
    postsData: [],
    postsApiStatus: apiStatusConstants.initial,
  }

  componentDidMount() {
    this.renderPostsData()
  }

  renderPostsData = async () => {
    this.setState({postsApiStatus: apiStatusConstants.progress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/insta-share/posts'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const formattedData = data.posts.map(eachPost => ({
        comment: eachPost.comments.map(eachItem => ({
          userName: eachItem.user_name,
          comment: eachItem.comment,
          userId: eachItem.user_id,
        })),
        createdAt: eachPost.created_at,
        likesCount: eachPost.likes_count,
        postDetailsCaption: eachPost.post_details.caption,
        postDetailsImageUrl: eachPost.post_details.image_url,
        postId: eachPost.post_id,
        profilePic: eachPost.profile_pic,
        userId: eachPost.user_id,
        userName: eachPost.user_name,
      }))

      this.setState({
        postsData: formattedData,
        postsApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({postsApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  onClickTryAgain = () => {
    this.renderPostsData()
  }

  postFailure = () => (
    <div>
      <img
        src="https://res.cloudinary.com/dfll49x4h/image/upload/v1646101752/alert-triangle_ne0kzq.png"
        alt="alert-triangle"
      />
      <p>Something went wrong. Please try again</p>
      <button onClick={this.onClickTryAgain} type="button">
        Try again
      </button>
    </div>
  )

  postSuccess = () => {
    const {postsData} = this.state

    return (
      <ul>
        {postsData.map(eachItem => (
          <PostCard key={eachItem.postId} postDetails={eachItem} />
        ))}
      </ul>
    )
  }

  renderAllPosts = () => {
    const {postsApiStatus} = this.state

    switch (postsApiStatus) {
      case apiStatusConstants.progress:
        return this.renderLoader()
      case apiStatusConstants.failure:
        return this.postFailure()
      case apiStatusConstants.success:
        return this.postSuccess()
      default:
        return null
    }
  }

  render() {
    return <div className="post-container">{this.renderAllPosts()}</div>
  }
}

export default PostsItem

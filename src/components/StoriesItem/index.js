import {Component} from 'react'
import Slider from 'react-slick'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import './index.css'

const apiStatusConstants = {
  initial: 'INITIAL',
  progress: 'IN_PROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class StoriesItem extends Component {
  state = {storiesData: [], storiesApiStatus: apiStatusConstants.initial}

  componentDidMount() {
    this.renderStoriesData()
  }

  renderStoriesData = async () => {
    this.setState({storiesApiStatus: apiStatusConstants.progress})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl = 'https://apis.ccbp.in/insta-share/stories'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    if (response.ok) {
      const data = await response.json()
      const formattedData = data.users_stories.map(eachData => ({
        userId: eachData.user_id,
        userName: eachData.user_name,
        storyUrl: eachData.story_url,
      }))
      this.setState({
        storiesData: formattedData,
        storiesApiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({storiesApiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="TailSpin" color="#4094EF" height={50} width={50} />
    </div>
  )

  renderStoriesFailure = () => (
    <div>
      <img
        src="https://res.cloudinary.com/dfll49x4h/image/upload/v1646029214/something_went_wrong_zcgefv.png"
        alt="stories failure"
      />
      <p>Something went wrong. Please try again</p>
      <button onClick={this.storiesData} type="button">
        Try again
      </button>
    </div>
  )

  renderStoriesSuccess = () => {
    const {storiesData} = this.state

    const sets = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 4,
      slidesToScroll: 1,
    }

    const settings = {
      dots: false,
      infinite: false,
      speed: 500,
      slidesToShow: 7,
      slidesToScroll: 1,
    }

    return (
      <>
        <Slider {...sets} className="mobile-view-slider">
          {storiesData.map(eachData => (
            <ul className="slick-item" key={eachData.userName}>
              <li className="slick-story-items">
                <div className="story-ring">
                  <img
                    className="logo-image"
                    src={eachData.storyUrl}
                    alt="user story"
                  />
                </div>
                <h1 className="name">{eachData.userName}</h1>
              </li>
            </ul>
          ))}
        </Slider>

        <Slider {...settings} className="desktop-view-slider">
          {storiesData.map(eachData => (
            <ul className="slick-item" key={eachData.userName}>
              <li className="slick-story-items">
                <div className="story-ring">
                  <img
                    className="logo-image"
                    src={eachData.storyUrl}
                    alt="user story"
                  />
                </div>
                <h1 className="name">{eachData.userName}</h1>
              </li>
            </ul>
          ))}
        </Slider>
      </>
    )
  }

  storiesContainer = () => {
    const {storiesApiStatus} = this.state

    switch (storiesApiStatus) {
      case apiStatusConstants.progress:
        return this.renderLoader()
      case apiStatusConstants.success:
        return this.renderStoriesSuccess()
      case apiStatusConstants.failure:
        return this.renderStoriesFailure()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="main-container">
        <div className="slick-container">{this.storiesContainer()}</div>
      </div>
    )
  }
}

export default StoriesItem

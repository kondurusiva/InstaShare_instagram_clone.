import {Link} from 'react-router-dom'
import './index.css'

const NotFound = () => (
  <div className="not-found-container">
    <img
      src="https://res.cloudinary.com/dfll49x4h/image/upload/v1645971955/not-found_page_u2tjz7.png"
      alt="page not found"
      className="not-found-img"
    />
    <h1 className="heading">Page Not Found</h1>
    <p className="description" mb-0>
      we are sorry, the page you requested could not be found.
    </p>
    <p className="description" mt-0>
      Please go back to the homepage.
    </p>
    <Link to="/">
      <button className="home-button" type="button">
        Home Page
      </button>
    </Link>
  </div>
)

export default NotFound

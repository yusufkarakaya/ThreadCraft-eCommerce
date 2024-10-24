import { Tooltip as ReactTooltip } from 'react-tooltip'
import { CiLogin } from 'react-icons/ci'
import { CiLogout } from 'react-icons/ci'

import { CiShoppingCart } from 'react-icons/ci'
import { Link, useNavigate } from 'react-router-dom'
import { selectUser } from '../features/auth/authSlice'
import { useSelector } from 'react-redux'

import { useDispatch } from 'react-redux'
import { logOut } from '../features/auth/authSlice'
import { persistor } from '../app/store'

const Navbar = () => {
  const dispatch = useDispatch()

  const navigate = useNavigate()
  const user = useSelector(selectUser)
  const handleCategoryClick = (category) => {
    navigate(`/?category=${category}`)
  }

  const handleLogout = () => {
    dispatch(logOut())
    persistor.purge()
    navigate('/')
  }

  const shopAll = () => {
    navigate('/')
  }

  return (
    <header className="pt-12 pb-8">
      <nav className="flex justify-between items-center">
        <div className="text-5xl font-bold flex flex-col text-gray-700">
          <Link to="/">ThreadCraft</Link>
          <span className="text-sm font-semibold text-gray-500 mx-auto">
            Crafted for Comfort, Designed for Style
          </span>
        </div>

        <ul className="flex space-x-6">
          <li
            className="text-lg text-main-text cursor-pointer transition-all hover:text-gray-800 hover:underline hover:underline-offset-2"
            onClick={() => shopAll()}
          >
            Shop All
          </li>
          <li
            className="text-lg text-main-text cursor-pointer transition-all hover:text-gray-800 hover:underline hover:underline-offset-2"
            onClick={() => handleCategoryClick('Basic Collection')}
          >
            Basic Collection
          </li>
          <li
            className="text-lg text-main-text cursor-pointer transition-all hover:text-gray-800 hover:underline hover:underline-offset-2"
            onClick={() => handleCategoryClick('Graphic Series')}
          >
            Graphic Series
          </li>
          <li
            className="text-lg text-main-text cursor-pointer transition-all hover:text-gray-800 hover:underline hover:underline-offset-2"
            onClick={() => handleCategoryClick('Eco-Friendly Line')}
          >
            Eco-Friendly Line
          </li>
        </ul>

        <div className="flex space-x-4">
          <span>
            {user ? (
              <CiLogout
                data-tooltip-id="logout-tooltip"
                data-tooltip-content="Log Out"
                onClick={handleLogout}
                className="w-10 h-10 cursor-pointer"
              >
                Log Out
              </CiLogout>
            ) : (
              <Link to="/auth/login">
                <CiLogin
                  data-tooltip-id="logout-tooltip"
                  data-tooltip-content="Log In"
                  className="w-10 h-10 cursor-pointer"
                />
              </Link>
            )}
            <ReactTooltip id="logout-tooltip" />
          </span>
          <span>
            <Link to="/cart">
              <CiShoppingCart
                data-tooltip-id="cart-tooltip"
                data-tooltip-content="Shopping Cart"
                className="w-10 h-10 cursor-pointer"
              />
            </Link>
          </span>

          <ReactTooltip id="cart-tooltip" />
        </div>
      </nav>
      <section className="text-lg font-semibold text-main-text text-right">
        {user ? `Welcome, ${user.username}` : 'Welcome, Guest'}
      </section>
    </header>
  )
}

export default Navbar

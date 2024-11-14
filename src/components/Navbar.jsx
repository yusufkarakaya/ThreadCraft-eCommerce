import { useEffect, useState } from 'react'
import { Tooltip as ReactTooltip } from 'react-tooltip'
import { CiLogin, CiLogout, CiShoppingCart } from 'react-icons/ci'
import { RiAdminLine } from 'react-icons/ri'
import { Link, useNavigate } from 'react-router-dom'
import { selectUser } from '../features/auth/authSlice'
import { useSelector, useDispatch } from 'react-redux'
import { logOut } from '../features/auth/authSlice'
import { persistor } from '../app/store'
import { useGetCartQuery } from '../features/cart/cartSlice'

const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const user = useSelector(selectUser)
  const { data: cart, isSuccess } = useGetCartQuery()

  const [quantity, setQuantity] = useState(0)

  useEffect(() => {
    if (cart && cart.products && cart.products.length > 0) {
      const totalQuantity = cart.products.reduce(
        (acc, item) => acc + item.quantity,
        0
      )
      setQuantity(totalQuantity)
    }
  }, [cart])

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
        <div className="text-3xl font-bold flex flex-col text-gray-700">
          <Link to="/">ThreadCraft</Link>
          <span className="text-sm font-semibold text-gray-500 mx-auto">
            Crafted for Comfort, Designed for Style
          </span>
        </div>

        <ul className="flex space-x-3">
          <li
            className="text-base text-green-900 cursor-pointer hover:text-gray-800 hover:underline hover:underline-offset-2"
            onClick={shopAll}
          >
            Shop All
          </li>
          <span>|</span>
          <li
            className="text-base text-green-900 cursor-pointer transition-all hover:text-gray-800 hover:underline hover:underline-offset-2"
            onClick={() => handleCategoryClick('Basic Collection')}
          >
            Basic Collection
          </li>
          <span>|</span>
          <li
            className="text-base text-green-900 cursor-pointer transition-all hover:text-gray-800 hover:underline hover:underline-offset-2"
            onClick={() => handleCategoryClick('Graphic Series')}
          >
            Graphic Series
          </li>
          <span>|</span>
          <li
            className="text-base text-green-900 cursor-pointer transition-all hover:text-gray-800 hover:underline hover:underline-offset-2"
            onClick={() => handleCategoryClick('Eco-Friendly Line')}
          >
            Eco-Friendly Line
          </li>
        </ul>

        <div className="flex space-x-4 items-center">
          {user ? (
            <CiLogout
              data-tooltip-id="logout-tooltip"
              data-tooltip-content="Log Out"
              onClick={handleLogout}
              className="w-10 h-10 cursor-pointer"
            />
          ) : (
            <Link to="/auth/login">
              <CiLogin
                data-tooltip-id="login-tooltip"
                data-tooltip-content="Log In"
                className="w-10 h-10 cursor-pointer"
              />
            </Link>
          )}
          <ReactTooltip id="logout-tooltip" />
          <ReactTooltip id="login-tooltip" />

          {user && user.role === 'admin' ? (
            <Link to="/admin">
              <RiAdminLine
                data-tooltip-id="admin-tooltip"
                data-tooltip-content="Admin Dashboard"
                className="w-10 h-10 cursor-pointer"
              />
            </Link>
          ) : (
            <Link to="/cart" className="relative">
              <CiShoppingCart
                data-tooltip-id="cart-tooltip"
                data-tooltip-content="Shopping Cart"
                className="w-10 h-10 cursor-pointer outline-none"
              />
              {user && quantity > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full px-2 py-0.5 text-xs font-bold flex items-center justify-center">
                  {quantity}
                </span>
              )}
            </Link>
          )}
          <ReactTooltip id="admin-tooltip" />
          <ReactTooltip id="cart-tooltip" />
        </div>
      </nav>
      <section className="text-sm font-semibold text-main-text text-right">
        {user ? `Welcome, ${user.username}` : 'Welcome, Guest'}
      </section>
    </header>
  )
}

export default Navbar

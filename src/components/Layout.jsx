import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen ">
      <hr />
      <section className="max-w-screen-xl mx-auto w-full">
        <Navbar />
      </section>
      <hr />

      <main className="container max-w-screen-xl mx-auto flex-grow">
        <Outlet />
      </main>

      <Footer />
    </div>
  )
}

export default Layout

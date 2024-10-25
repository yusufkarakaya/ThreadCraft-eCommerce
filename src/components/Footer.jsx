import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-8 mt-12  ">
      <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-4">
        <div className="mb-6 md:mb-0">
          <h2 className="text-lg font-semibold mb-4">About ThreadCraft</h2>
          <p className="text-sm">
            Crafted for comfort, designed for style. Shop our latest collection
            and enjoy premium quality clothing.
          </p>
        </div>
      </div>
      <hr className="my-4 border-gray-600" />
      <div className="text-center text-sm">
        &copy; {new Date().getFullYear()} ThreadCraft. All rights reserved.
      </div>
    </footer>
  )
}

export default Footer

import React from 'react'
import { checkUser } from '@/lib/checkUser'

const MainLayout = async ({ children }) => {
  await checkUser();

  return (
    <div className='container mx-auto px-4 mt-24 mb-12 md:mt-28'>
      {children}
    </div>
  )
}

export default MainLayout;

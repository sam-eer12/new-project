import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import {api} from '../context/AppContext'

const NavBar = () => {
    const [isScrolled, setIsScrolled] = useState(false);
    const sideMenuRef = useRef();
    const openMenu = ()=>{
        sideMenuRef.current.style.transform = "translateX(-16rem)"
    }

    const closeMenu = ()=>{
            sideMenuRef.current.style.transform = "translateX(16rem)"
    }

    useEffect(()=>{
        window.addEventListener('scroll',()=>{
            if(scrollY>50){
        setIsScrolled(true);
      }else{
        setIsScrolled(false);
      }
    })
  },[])

  const {isAuthenticated} = api.useAuthStore()
  return (
    <div>
      <div>
        <div className='fixed top-0 left-0 w-11/12 translate-y-[-80%]  -z-10'>
            <Image draggable="false" src={assets.header_bg_color} alt='' className='w-full'/>
        </div>
        <nav className={`w-full fixed px-5 lg:px-8 xl:px-[8%] py-4 flex items-center justify-between z-50 ${isScrolled? " bg-opacity-60 duration-100 backdrop-blur-2xl shadow-sm": "" } `}>
            <a href="#top">
            <Image draggable="false" src={assets.logo} alt="Logo" className='w-44 cursor-pointer mr-14' />
            </a>
            <ul className={`hidden md:flex item-center gap-6 lg:gap-8 rounded-full px-12 py-3 ${isScrolled? "":"bg-white shadow-sm bg-opacity-50"} `}>
            <li><a className='font-Ovo' href="#top">Home</a></li>
            <li><a className='font-Ovo' href="#about">About</a></li>
            <li><a className='font-Ovo' href="/dashboard">Dashboard</a></li>
            </ul>
            <div className='flex items-center gap-4'>
            <button className='cursor-pointer'>
                {/* <Image src={assets.moon_icon} alt="Dark Mode" className='w-6 md:w-7 lg:w-8'/> */}
            </button>
            <a className='hidden lg:flex items-center gap-3 px-10 py-2.5 border border-gray-500 rounded-full ml-4' href="/login">Log In <Image draggable="false" src={assets.arrow_icon} alt='' className='w-3'/></a>

            <button onClick={openMenu} className='block md:hidden ml-3'>
                <Image draggable="false" src={assets.menu_black} alt='' className='w-6'/>
            </button>
            </div>

            {/* Mobile Menu */}

            <ul ref={sideMenuRef} className='flex md:hidden flex-col gap-4 py-20 px-10 fixed -right-64 top-0 bottom-0 w-44 z-50 h-screen bg-rose-50 transition duration-500'>
            <div onClick={closeMenu} className='absolute top-6 right-6'>
                <Image draggable="false" src={assets.close_black} alt='' className='w-6 cursor-pointer'/>
            </div>
            <li><a onClick={closeMenu} className='font-Ovo' href="#top">Home</a></li>
            <li><a onClick={closeMenu} className='font-Ovo' href="#about">About</a></li>
            <li><a onClick={closeMenu} className='font-Ovo' href="/dashboard">Dashboard</a></li>
            </ul>

        </nav>
        </div>
    </div>
  )
}

export default NavBar

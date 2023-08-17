import React, { useContext, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { configureStore, createSlice, getDefaultMiddleware } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import axios from 'axios';
import Link from 'next/link';

// Components from PrimeReact
import { StyleClass } from 'primereact/styleclass';
import { Button } from 'primereact/button';
import { Ripple } from 'primereact/ripple';
import { Divider } from 'primereact/divider';
import { classNames } from 'primereact/utils';

const initialState = {
    user: null,
    reviews: [],
    isLoading: false,
    error: null
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action) {
            state.user = action.payload;
        },
        setReviews(state, action) {
            state.reviews = action.payload;
        },
        setIsLoading(state, action) {
            state.isLoading = action.payload;
        },
        setError(state, action) {
            state.error = action.payload;
        }
    }
});

const middleware = [...getDefaultMiddleware(), thunk];

const store = configureStore({
    reducer: {
        user: userSlice.reducer
    },
    middleware
});

const Navbar = () => {
    const [isHidden, setIsHidden] = React.useState(false);
    const menuRef = useRef();

    const toggleMenuItemClick = () => {
        setIsHidden(prevState => !prevState);
    }

    return (
        <div id="home" className="landing-wrapper overflow-hidden relative">
            <div className="fixed top-0 left-0 py-4 px-4 mx-0 lg:px-6 flex align-items-center justify-content-between relative lg:static">
                <Link href="/" className="flex align-items-center">
                    <img src={`/layout/logo.png`} alt="Sakai Logo" height="50" className="mr-0 lg:mr-2" />
                    <span className="text-900 font-bold text-2xl line-height-3 mr-8">TagaTulong</span>
                </Link>
                <StyleClass nodeRef={menuRef} selector="@next" enterClassName="hidden" leaveToClassName="hidden" hideOnOutsideClick="true">
                    <i ref={menuRef} className="pi pi-bars text-4xl cursor-pointer block lg:hidden text-700"></i>
                </StyleClass>
                <div className={classNames('align-items-center surface-0 flex-grow-1 justify-content-between hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2', { hidden: isHidden })} style={{ top: '100%' }}>
                    <ul className="list-none p-0 m-0 ml-8 flex lg:align-items-center select-none flex-column lg:flex-row cursor-pointer">
                        <li>
                            <a href="#home" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 hover:text-pink-500">
                                <span>Home</span>
                                <Ripple />
                            </a>
                        </li>
                        <li>
                            <a href="#features" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 hover:text-pink-500">
                                <span>Reviews</span>
                                <Ripple />
                            </a>
                        </li>
                        <li>
                            <a href="#highlights" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 hover:text-pink-500">
                                <span>About Us</span>
                                <Ripple />
                            </a>
                        </li>
                        <li>
                            <a href="#pricing" onClick={toggleMenuItemClick} className="p-ripple flex m-0 md:ml-5 px-0 py-3 text-900 font-medium line-height-3 hover:text-pink-500">
                                <span>Contact Us</span>
                                <Ripple />
                            </a>
                        </li>
                    </ul>
                    <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                        <Link href="auth/login"><Button label="Login" outlined rounded className="line-height-2 border-cyan-400 text-cyan-400 hover:border-transparent hover:text-white hover:bg-cyan-400"></Button></Link>
                        <Link href="/register"><Button label="Register" rounded className="ml-3 line-height-2 border-pink-400 bg-pink-400 hover:surface-0 hover:text-pink-400"></Button></Link>
                    </div>
                </div>
            </div>

            <div className="grid grid-nogutter surface-0 text-800">
                <div className="md:col-6 p-5 text-center md:text-left flex align-items-center ">
                    <section>
                        <label className='text-2xl text-pink-400'>Let's help you</label>
                        <span className="block text-6xl pl-4">
                            <label>Find Your</label>
                            <label className='text-6xl font-bold'> Perfect</label>
                        </span>
                        <div className="text-6xl font-bold pl-4">
                            <label>Caretaker with</label>
                        </div>
                        <div className="text-6xl font-bold mb-5 pl-4">
                            <label>a Tap!</label>
                        </div>
                        <Link href="/register"><Button label="Find a Nanny" type="button" rounded className="mr-3 bg-cyan-400 border-cyan-400 hover:surface-0 hover:text-cyan-400" /></Link>
                        <Link href="/register"><Button label="Apply as Nanny" type="button" rounded outlined className="text-pink-400 border-pink-400 hover:bg-pink-400 hover:border-transparent hover:text-white" /></Link>
                        <div className='border-left-3 border-cyan-400'>
                            <p className="mx-3 mt-5 mb-4 text-xl line-height-3 text-justify" style={{cursor: 'default'}}>From cleaning and cooking to laundry and childcare, we've got you covered. Say goodbye to the stress and hassle of managing your household tasks and hello to more free time and peace of mind.</p>
                        </div>

                    </section>
                </div>
                <div className="col-12 md:col-6 overflow-hidden">
                    <img src="/layout/hero-resized.png" alt="hero-1" className="md:ml-auto block md:h-full" style={{ clipPath: 'polygon(8% 0, 100% 0%, 100% 100%, 0 100%)' }} />
                </div>
            </div>
    

        </div>
    );
}

export default Navbar;
import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import './index.css';

import TestPage from './test/testPage';

import {
	Header,
	Footer,
	Login,
	Title,
	Home,
	Post,
	Browse,
	Trip,
	Request,
	Profile,
	Register,
	Private,
	ViewPost,
	Public
} from "./components"

const Layout = () => {

	const [userName, setUserName] = useState("");

	return (
		<>
			
			<Header />
			<Outlet context={[userName, setUserName]}/>
			<Footer />
		</>
	)
};

const router = createBrowserRouter([
	{
		path: "/",
		element: <Layout />,

		children: [
			{
				path: '/',
				element: <Title />
			},
			{
				path: '/home',
				element: <Private><Home /></Private>
			},
			{
				path: '/post',
				element: <Private><Post /></Private>
			},
			{
				path: '/post/trip',
				element: <Private><Trip /></Private>
			},
			{
				path: '/post/request',
				element: <Private><Request /></Private>
			},
			{
				path: '/browse',
				element: <Browse />
			}, 
			{
				path: '/login',
				element: <Public><Login /></Public>
			},
			{
				path: '/profile',
				element: <Private><Profile /></Private>
			},
			{
				path: '/profile/:username',
				element: <Private><Profile /></Private>
			},
			{
				path: '/register',
				element: <Public><Register /></Public>
			},
			{
				path: '/post/view/:postID',
				element: <Private><ViewPost/></Private>
			}, 
			{
				path: 'test',
				element: <TestPage></TestPage>
			}
		]
	}

	
]);

ReactDOM.createRoot(document.getElementById("root")).render(
	<React.StrictMode>
    	<RouterProvider router={router} />
  	</React.StrictMode>
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

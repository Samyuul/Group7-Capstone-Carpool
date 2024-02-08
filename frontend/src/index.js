import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import './index.css';

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
	User,
	Logout,
	Register
} from "./components"

const Layout = () => {

	const [userName, setUserName] = useState("");

	return (
		<>
			<Header 
				userName={userName} 
				setUserName={setUserName}
			/>
			<Outlet context={[userName, setUserName]}/>
			<Footer />
		</>
	)
};

const router = createBrowserRouter([
	{
		element: <Layout />,

		children: [
			{
				path: '/',
				element: <Title />
			},
			{
				path: '/home',
				element: <Home />
			},
			{
				path: '/post',
				element: <Post />
			},
			{
				path: '/post/trip',
				element: <Trip />
			},
			{
				path: '/post/request',
				element: <Request />
			},
			{
				path: '/browse',
				element: <Browse />
			}, 
			{
				path: '/login',
				element: <Login />
			},
			{
				path: '/profile/:username',
				element: <User />
			},
			{
				path: '/logout',
				element: <Logout />
			},
			{
				path: '/register',
				element: <Register />
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

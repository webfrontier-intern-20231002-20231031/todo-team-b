"use client";

import React, {useState} from "react";


export default function InputForm() {

    type Login = {
        email: string;
        password: string;
    }

    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setEmailValue(e.target.value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setPasswordValue(e.target.value)
    }

    const handleLogin = async (): Promise<void> => {
        const req: Login = {
            email: emailValue,
            password: passwordValue
        };
        console.log(req)
        await fetch('/api/Login',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req)
        })
            .then(res => res.json())
            .then(json => {
            console.log(json)
        })
            .catch(error => {
            console.error('client side error : ', error)
        })
    }

    return (
        <div className="relative flex flex-col justify-center h-screen overflow-hidden">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-md ring-2 ring-gray-800/50 lg:max-w-lg">
            <h1 className="text-3xl font-semibold text-center text-gray-700">Login</h1>
            <form className="space-y-4">
                <div>
                    <label className="label">
                        <span className="text-base label-text">Email</span>
                    </label>
                    <input type="email" placeholder="Email Address"
                        className="w-full input input-bordered" onChange={handleEmailChange}/>
                </div>
                <div>
                    <label className="label">
                        <span className="text-base label-text">Password</span>
                    </label>
                    <input type="password" placeholder="Enter Password"
                        className="w-full input input-bordered" onChange={handlePasswordChange}/>
                </div>
                <a href="#" className="text-xs text-gray-600 hover:underline hover:text-blue-600">Forget Password?</a>
                <div>
                    <button className="btn btn-block" onClick={handleLogin}>Login</button>
                </div>
            </form>
        </div>
    </div>
    )
}
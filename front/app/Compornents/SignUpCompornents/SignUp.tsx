"use client";

import React, {useState} from "react";
import { useRouter } from "next/navigation";


export default function InputForm() {

    const router = useRouter();

    type SignUp = {
        email: string;
        password: string;
    }

    const [emailValue, setEmailValue] = useState("");
    const [passwordValue, setPasswordValue] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setEmailValue(e.target.value)
    }

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        console.log(e.target.value);
        setPasswordValue(e.target.value)
    }

    const handleLogin = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
        e.preventDefault();  
        const req: SignUp = {
            email: emailValue,
            password: passwordValue
        };
        console.log(req)
        await fetch('/api/SignUp',{
            method: 'POST',
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(req)
        })
        .then(res => {
            if (res.status === 400) {
                throw new Error("空欄があります");
            }else if (res.status === 401) {
                throw new Error("既に登録されています");
            }
            else if(400 > res.status && res.status >= 300){
                throw new Error("Redirection");
            }
            else if(500 > res.status && res.status >= 400){
                throw new Error("Client side error");
            }else if(res.status >= 500){
                throw new Error("Server side error");
            } else {
                setErrorMessage('');
                router.push("../../Login/");
            }
        })
        .catch(error => {
            console.error('client side error : ', error)
            setErrorMessage(error.message);
        })
    }


    return (
        <div className="relative flex flex-col justify-center h-screen overflow-hidden">
        <div className="w-full p-6 m-auto bg-white rounded-md shadow-md ring-2 ring-gray-800/50 lg:max-w-lg">
            <h1 className="text-3xl font-semibold text-center text-gray-700">SignUp</h1>
            <form className="space-y-4" onSubmit={(e) => handleLogin(e)}>
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
                <a href="./Login" className="text-xs text-gray-600 hover:underline hover:text-blue-600">Want Login?</a>
                {errorMessage && <p style={{ color: '#FF69B4' }}>{errorMessage}</p>}
                <div>
                    {/* <button className="btn btn-block" onClick={handleLogin}>Login</button> */}
                    <button className="btn btn-block">SignUp</button>
                </div>
            </form>
        </div>
    </div>
    )
}
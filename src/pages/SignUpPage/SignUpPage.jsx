import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";

const SignUpPage = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const [isShowConfirmPassword, setIsShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const mutation = useMutationHook(
        data => UserService.registerUser(data)
    )

    const { data, isSuccess } = mutation;

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            navigate('/sign-in');
        }
    }, [isSuccess, navigate, data?.status]);

    const handleNavigateSignIn = () => {
        navigate('/sign-in');
    }

    const handleName = (e) => {
        setName(e.target.value);
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleConfirmPassword = (e) => {
        setConfirmPassword(e.target.value);
    }

    const handleShowPassword = () => {
        setIsShowPassword(!isShowPassword);
    }

    const handleShowConfirmPassword = () => {
        setIsShowConfirmPassword(!isShowConfirmPassword);
    }

    const handleSignUp = (e) => {
        e.preventDefault();
        mutation.mutate({ name, email, password, confirmPassword });
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <h2 className="text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Đăng ký tài khoản
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form id="register-form" action="#" method="POST" className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm/6 font-medium text-gray-900">
                                Tên
                            </label>
                            <div className="mt-2">
                                <input
                                    id="name"
                                    name="name"
                                    type="name"
                                    placeholder="Name"
                                    value={name}
                                    onChange={(e) => handleName(e)}
                                    required
                                    autoComplete="name"
                                    className="block w-full rounded-md px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="email" className="block text-sm/6 font-medium text-gray-900">
                                Email
                            </label>
                            <div className="mt-2">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => handleEmail(e)}
                                    required
                                    autoComplete="email"
                                    className="block w-full rounded-md px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                Mật khẩu
                            </label>
                            <div className="mt-2">
                                <input
                                    id="password"
                                    name="password"
                                    type={isShowPassword ? "text" : "password"}
                                    placeholder="Mật khẩu"
                                    value={password}
                                    onChange={(e) => handlePassword(e)}
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                />
                            </div>
                            <div>
                                <input type="checkbox" onClick={() => handleShowPassword()} /> Hiển thị mật khẩu
                            </div>
                        </div>

                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm/6 font-medium text-gray-900">
                                Xác nhận mật khẩu
                            </label>
                            <div className="mt-2">
                                <input
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    type={isShowConfirmPassword ? "text" : "password"}
                                    placeholder="Xác nhận mật khẩu"
                                    value={confirmPassword}
                                    onChange={(e) => handleConfirmPassword(e)}
                                    required
                                    autoComplete="current-password"
                                    className="block w-full rounded-md border-0 px-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                                />
                            </div>
                            <div>
                                <input type="checkbox" onClick={() => handleShowConfirmPassword()} /> Hiển thị mật khẩu
                            </div>
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={(e) => handleSignUp(e)}
                            >
                                Đăng Ký
                            </button>
                            {data && data?.status === 'ERR' && <p className="font-medium text-red-500 text-sm/6">{data.message}</p>}
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Đã có tài khoản?{' '}
                        <span href="" onClick={() => handleNavigateSignIn()} className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                            Đăng nhập
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default SignUpPage;
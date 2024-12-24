import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as UserService from "../../services/UserService";
import { useMutationHook } from "../../hooks/useMutationHook";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { updateUser } from "../../redux/slides/userSlide";

const SignInPage = () => {
    const location = useLocation();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isShowPassword, setIsShowPassword] = useState(false);
    const dispatch = useDispatch();

    const navigate = useNavigate();

    const mutation = useMutationHook(
        data => UserService.loginUser(data)
    )

    const { data, isSuccess } = mutation;

    useEffect(() => {
        if (isSuccess && data?.status === 'OK') {
            if (location?.state) {
                navigate(location?.state);
            } else {
                navigate('/');
            }
            localStorage.setItem('access_token', JSON.stringify(data?.access_token));
            if (data?.access_token) {
                const decoded = jwtDecode(data?.access_token);
                if (decoded?.id) {
                    handleGetDetailsUser(decoded?.id, data?.access_token);
                }
            }
        }
    }, [isSuccess, navigate, data, location]);

    const handleGetDetailsUser = async (id, token) => {
        const res = await UserService.getDetailsUser(id, token);
        dispatch(updateUser({ ...res?.data, access_token: token }));
    }

    const handleEmail = (e) => {
        setEmail(e.target.value);
    }

    const handlePassword = (e) => {
        setPassword(e.target.value);
    }

    const handleShowPassword = (e) => {
        setIsShowPassword(!isShowPassword);
    }

    const handleNavigateSignUp = () => {
        navigate('/sign-up');
    }

    const handleSignIn = (e) => {
        e.preventDefault();
        mutation.mutate({ email, password });
    }

    return (
        <>
            <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                    <img
                        alt="Your Company"
                        src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600"
                        className="mx-auto h-10 w-auto"
                    />
                    <h2 className="mt-10 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
                        Đăng nhập vào tài khoản
                    </h2>
                </div>

                <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                    <form id="login-form" action="#" method="POST" className="space-y-6">
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
                            <div className="flex items-center justify-between">
                                <label htmlFor="password" className="block text-sm/6 font-medium text-gray-900">
                                    Mật khẩu
                                </label>
                                <div className="text-sm">
                                    <span className="font-semibold text-indigo-600 hover:text-indigo-500">
                                        Quên mật khẩu?
                                    </span>
                                </div>
                            </div>
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
                                <input id="isShowPassword" type="checkbox" onClick={(e) => handleShowPassword(e)} /> Show Password
                            </div>
                            {data && data?.status === 'ERR' && <p className="text-red-500 text-sm/6">{data.message}</p>}
                        </div>

                        <div>
                            <button
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm/6 font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                                onClick={(e) => handleSignIn(e)}
                            >
                                Đăng nhập
                            </button>
                        </div>
                    </form>

                    <p className="mt-10 text-center text-sm/6 text-gray-500">
                        Chưa có tài khoản?{' '}
                        <span onClick={() => handleNavigateSignUp()} className="font-semibold text-indigo-600 hover:text-indigo-500 cursor-pointer">
                            Tạo tài khoản
                        </span>
                    </p>
                </div>
            </div>
        </>
    );
};

export default SignInPage;
const SignInForm = () => {
    return (
        <form className="flex flex-col">
            <h2 className="self-start mt-7 text-3xl max-md:ml-0.5">Sign in</h2>
            <div className="mt-16 max-md:mt-10">
                <label htmlFor="email" className="self-start text-sm max-md:ml-0.5">
                    Email
                </label>
                <div className="flex gap-2.5 self-start mt-3.5 text-base max-md:ml-0.5">
                    <img loading="lazy"
                        src="https://cdn.builder.io/api/v1/image/assets/TEMP/ba95a09ab4826cc61adc21cfdaf0864fed97d4f319a7339e5754e5bd7c854929?placeholderIfAbsent=true&apiKey=30d3d8415b44457fb2b5713118cbf796"
                        alt="" className="object-contain shrink-0 self-start mt-1 aspect-square w-[17px]" />
                    <input type="email" id="email" placeholder="Enter your email address"
                        className="basis-auto bg-transparent" />
                </div>
                <div className="flex shrink-0 mt-2.5 max-w-full h-0.5 bg-white w-[429px]" />
            </div>
            <div className="flex gap-5 justify-between mt-12 max-md:mt-10 max-md:max-w-full">
                <div className="flex flex-col">
                    <label htmlFor="password" className="self-start text-sm">
                        Password
                    </label>
                    <div className="flex gap-2 mt-3.5 text-base">
                        <img loading="lazy"
                            src="https://cdn.builder.io/api/v1/image/assets/TEMP/faa7ef411c13cbe81c17322aed87036b86350443fdf620d298e962c2dd84aa93?placeholderIfAbsent=true&apiKey=30d3d8415b44457fb2b5713118cbf796"
                            alt="" className="object-contain shrink-0 my-auto aspect-square w-[17px]" />
                        <input type="password" id="password" placeholder="Enter your Password"
                            className="grow shrink w-[146px] bg-transparent" />
                    </div>
                </div>
                <img loading="lazy"
                    src="https://cdn.builder.io/api/v1/image/assets/TEMP/b577e89f47f09416f4ee2d4f89bf01f5a51f0cd9971c29f9f340730cefb2f69f?placeholderIfAbsent=true&apiKey=30d3d8415b44457fb2b5713118cbf796"
                    alt="Show password" className="object-contain shrink-0 self-end mt-10 w-3.5 aspect-square" />
            </div>
            <div className="flex shrink-0 mt-2.5 max-w-full h-0.5 bg-white w-[429px]" />
            <div className="flex gap-10 mt-4 mr-2.5 w-full text-xs font-light max-md:ml-0.5">
                <div className="flex flex-1 gap-2.5">
                    <input type="checkbox" id="remember-me"
                        className="shrink-0 self-start bg-white border border-white border-solid h-[15px] w-[15px]" />
                    <label htmlFor="remember-me">Remember Me</label>
                </div>
                <a href="#" className="text-white">Forgot Password?</a>
            </div>
            <button type="submit"
                className="px-16 py-4 mt-16 text-lg whitespace-nowrap bg-fuchsia-700 rounded-[32px] shadow-[0px_4px_26px_rgba(0,0,0,0.25)] max-md:px-5 max-md:mt-10 max-md:max-w-full">
                Login
            </button>
        </form>
    );
};

export default SignInForm;

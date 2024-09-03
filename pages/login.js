"use client"
import React from 'react';
// import { signIn } from 'next-auth/react';
import {BsGithub, BsLinkedin, BsApple, BsInstagram, BsFacebook, BsGlobe} from 'react-icons/bs'
import {AiFillTwitterCircle} from 'react-icons/ai'
import {IoLogoDiscord} from 'react-icons/io5'
import {FcGoogle} from 'react-icons/fc'
import { useForm } from "react-hook-form";
import authServ from "../services/auth.service";
import { useRouter } from "next/router";
import axios from "axios";
import getApiUrl from "../utils/BeUrl";
import { Box, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import Copyright from '../components/copyright';

export default function PageLogin() {

  React.useEffect(() => {
    if (!authServ.utenteNonLoggato()) router.push("/reclamiAssegnati");
  }, []);

  const form = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const { register, handleSubmit, formState, setError } = form;
  const { errors } = formState;
  const router = useRouter();
  const dataQuery = router.query;
  const instance = axios.create();
  const [loading, setLoading] = React.useState(false);
  const onSubmit = (data) => {
    setLoading(true);
    instance
      .post(getApiUrl() + "auth/login", data)
      .then((response) => {
        authServ.saveInfo(response.data);
        if (router.query && router.query.pName) router.push(router.query.pName);
        else router.push("/reclamiAssegnati");
      })
      .catch(() => {
        setError("password", {
          type: "custom",
          message: "Username o password errati",
        });
        setLoading(false);
      });
  };
  return (
    <div className='grid sm:grid-cols-2 grid-cols-1 auto-rows-[100vh] bg-stone-50'>
    
    <div
      className='login-left hidden bg-primary py-10 px-8 lg:px-16 sm:flex flex-col'
    >
      <img src ="/images/atech2.png" title='Atech.js' style={{width: 100, height: 60}} />
      <h1 className='text-[#e9e9e8] md:text-6xl 2xl:text-7xl font-bold my-auto 2xl:mt-[32vh] sm:mt-[28vh]  xs:ml-8  2xl:ml-28 sm:text-5xl'>ClaimTech <small className='text-lg font-light text-gray-200'>by <small className='text-secondary text-2xl'>Atech.js</small></small></h1>
      <div className="socials ml-8 lg:ml-24">
      <ul className='right list-none flex md:items-center gap-6'>
      <li><a href="#"><BsGlobe className='2xl:text-4xl sm:text-2xl text-tertiary'/></a></li>
      <li><a href="#"><BsLinkedin className='2xl:text-4xl sm:text-2xl text-tertiary'/></a></li>
      <li><a href="#"><BsInstagram className='2xl:text-4xl sm:text-2xl text-tertiary'/></a></li>
      <li><a href="#"><BsFacebook className='2xl:text-4xl sm:text-2xl text-tertiary'/></a></li>
      </ul>
      </div>
    </div>
    <div className="right flex flex-col justify-center items-center relative">
    <div className='flex absolute top-8 left-8 sm:hidden'>
      <h1 className='text-3xl font-bold flex items-center text-primary'>
        <img src="/images/atech1.png" title='Atech.js' style={{width: 40, height: 40}} alt="Logo" className="mr-2" />
        ClaimTech
      </h1>
    </div>

        <div className='lg:w-[26.5rem] w-80 flex flex-col gap-4 '>
        <div className='text-center '>
          <h1 className='text-4xl text-primary font-bold'>ClaimTech</h1>
          <p className='py-3 text-primary'>Il tuo gestionale reclami</p>
        </div>
        <div className="auth flex flex-col lg:flex-row w-full gap-4 lg:gap-2 lg:items-center justify-between">
          <div onClick={() => signIn('google')} className='cursor-pointer lg:border-none border border-[#e6ebf4] flex justify-center items-center bg-white gap-2 py-2 px-5 rounded-[10px]'>
            <FcGoogle/>
            <p className='text-[#858585] text-sm lg:text-base hover:text-black'>Accedi con Google</p>
          </div>
          <div className='cursor-pointer justify-center hover:text-black lg:border-none border border-[#e6ebf4] text-[#858585] flex items-center bg-white gap-2 py-2 px-5 rounded-[10px]'>
            <BsApple/>
            <p className='text-sm lg:text-base'>Accedi con Apple</p>
          </div>
        </div>
          <Box
            component="form"
            noValidate
            sx={{ mt: 1 }}
            onSubmit={handleSubmit(onSubmit)}
          >
          <div className='bg-white rounded-[20px] p-8 flex flex-col gap-5 lg:border-none border border-[#e6ebf4]'>
            <div className="email text-primary flex flex-col gap-3 items-start">
              <label htmlFor="username">Username</label>
              <TextField
              {...register("username", { required: "Username è obbligatorio" })}
             
              required
              fullWidth
              variant='standard'
              id="username"
              name="username"
              placeholder='Enter username'
              className='w-full px-4 py-2 text-primary mt-0 rounded-lg border-none outline-none bg-[#F5F5F5]'
              error={!!errors.username}
              helperText={errors.username?.message}
              autoFocus
              InputProps={{
                
                disableUnderline: true, // <== added this
              }}
              style={{ padding: 5 }}
            />
            </div>
            <div className="password text-primary flex flex-col gap-3 items-start">
              <label htmlFor="Password">Password</label>
              <TextField
              {...register("password", { required: "Password è obbligatorio" })}
              required
              fullWidth
              variant='standard'
              name="password"
              placeholder='Enter password'
              className='w-full px-4 py-2  mt-0 text-primary rounded-lg border-none outline-none bg-[#F5F5F5]'
              type="password"
              id="password"
              autoComplete="current-password"
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                
                disableUnderline: true, // <== added this
              }}
              style={{ padding: 5 }}
            />
            </div>
            {/* <p><a href="#" className='text-[#346BD4]'>Forgot password?</a></p> */}
            <LoadingButton
              type="submit"
              fullWidth
              variant="contained"
              loading={loading}
              sx={{ mt: 3, mb: 2 }}
              className='bg-secondary hover:bg-[#ffb954] text-white rounded-[10px] py-2 '
            >
              Accedi
            </LoadingButton>
          </div>
        </Box>
        {/* <p className='text-[#858585] lg:mt-4 mt-2 w-full text-center'>Don't have an account? <span className='text-[#346BD4]'><a href="#">Register here</a></span></p>*/}
        <Copyright sx={{ mt: 8, mb: 4 }} />
        </div>
        <ul className='right list-none flex items-center gap-6 bottom-8 absolute sm:hidden'>
        <li><a href="#"><BsGlobe className='text-3xl text-gray-800'/></a></li>
        <li><a href="#"><BsLinkedin className='text-3xl text-gray-800'/></a></li>
        <li><a href="#"><AiFillTwitterCircle className='text-3xl text-gray-800'/></a></li>
        <li><a href="#"><IoLogoDiscord className='text-3xl text-gray-800'/></a></li>
      </ul>
    </div>
  </div>
  );
}

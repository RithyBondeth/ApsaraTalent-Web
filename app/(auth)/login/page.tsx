'use client'
import { useTheme } from 'next-themes'
import React from 'react'

function LoginPage() {
    const { setTheme } = useTheme()

  return (
    <div>
        <h1><button onClick={() => setTheme('light')}>Change to light</button></h1>
        <h1 className='font-semibold'><button onClick={() => setTheme('dark')}>Change to dark</button></h1>
        
    </div> 
  )
}

export default LoginPage
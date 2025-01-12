import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/authContext.js'
import { doSignOut } from '../services/authService'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()

    return (
        <div className='flex fixed top-0 w-full h-12 border-b place-content-between items-center bg-gray-200 px-10'>
            <nav className='flex flex-row gap-x-2'>
                <Link className='text-sm text-blue-600 underline' to={'/'}>Accueil</Link>
                <Link className='text-sm text-blue-600 underline' to={'/calendrier'}>Calendrier</Link>
            </nav>
            <nav className='flex flex-row gap-x-2'>
                {
                    userLoggedIn
                        ?
                        <button onClick={() => { doSignOut().then(() => { navigate('/login') }) }} className='text-sm text-blue-600 underline'>Logout</button>
                        :
                        <>
                            <Link className='text-sm text-blue-600 underline' to={'/login'}>Login</Link>
                            <Link className='text-sm text-blue-600 underline' to={'/register'}>Register New Account</Link>
                        </>
                }
            </nav>
        </div>
    )
}

export default Header
import { useAuth } from "../contexts/authContext"

export default function Homepage() {
  const { currentUser } = useAuth()
  return (
    <div className='text-2xl font-bold pt-14'>Hello {currentUser.displayName ? currentUser.displayName : currentUser.email}, you are now logged in.</div>
  )
}

import { useAuth } from '../../contexts/authContext'

const Home = () => {
    const { currentUser } = useAuth()
    return (
        <div className="text-2xl font-bold pt-14">
            {currentUser ? (
                <>Hello {currentUser.displayName || currentUser.providerData[0].displayName}, you are now logged in.</>
            ) : (
                <>You are not logged in.</>
            )}
        </div>
    )
}

export default Home
import { useAuth } from '../../contexts/authContext'
import Calendar from '../../components/calendar.jsx'

const CalendarPage = () => {
    const { currentUser } = useAuth()
    return (
        <>
            <div className="text-2xl font-bold pt-14">
                {currentUser ? (
                    <>Hello {currentUser.displayName || currentUser.email}, you are now logged in.</>
                ) : (
                    <>You are not logged in.</>
                )}
            </div>
            <Calendar />
        </>
    )
}

export default CalendarPage
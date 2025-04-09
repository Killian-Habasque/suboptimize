const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer>
            <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8">
                <div className="border-t border-gray-200 py-8 text-center text-sm text-gray-500 sm:text-left">
                    <span className="block sm:inline">&copy; {year} Suboptimize.</span>{' '}
                    <span className="block sm:inline">Tous droits réservés</span>
                </div>
            </div>
        </footer>
    )
}
export default Footer
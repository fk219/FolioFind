import { Link, useRouteError } from 'react-router-dom'

const ErrorPage = () => {
    const error = useRouteError()
    const status = error?.status || 404

    return (
        <div className="min-h-[80vh] flex items-center justify-center bg-[#f8f7f4] px-6 pt-12">
            <div className="max-w-md text-center">
                <div className="text-8xl font-semibold tracking-tighter text-emerald-900/80 mb-1">{status}</div>
                <h1 className="text-4xl font-semibold tracking-tight">
                    {status === 404 ? "We couldn't find that page" : "Something went wrong"}
                </h1>
                <p className="mt-4 text-gray-600">{error?.statusText || error?.message || "The page may have moved or no longer exists."}</p>
                
                <Link to="/" className="btn-primary mt-10 inline-flex px-10">Return to homepage</Link>
            </div>
        </div>
    )
}

export default ErrorPage
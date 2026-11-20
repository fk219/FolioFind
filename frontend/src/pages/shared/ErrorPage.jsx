import { Link, useRouteError } from 'react-router-dom'

const ErrorPage = () => {
    const error = useRouteError()
    const status = error?.status || 404

    return (
        <div className="bg-paper">
            <div className="container-bookshop flex min-h-[65vh] items-center py-16">
                <div className="max-w-2xl">
                    <p className="eyebrow">{status} / {status === 404 ? 'Page not found' : 'Something went wrong'}</p>
                    <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6rem)] font-light leading-[0.9] tracking-[-0.045em] text-ink">
                        This page is <span className="italic text-oxblood">off the shelf.</span>
                    </h1>
                    <p className="mt-5 max-w-md text-base leading-relaxed text-muted">
                        {error?.statusText || error?.message || 'The page may have moved, or the address may be incomplete.'}
                    </p>
                    <div className="mt-7 flex flex-wrap gap-3">
                        <Link to="/" className="btn-primary">Back to the shop</Link>
                        <Link to="/shop" className="btn-outline">Browse the shelves</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage

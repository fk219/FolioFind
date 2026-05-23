import { useContext } from 'react'
import { useLoaderData } from 'react-router-dom'
import { AuthContext } from '../../contexts/AuthProvider'

const CONDITION_COLORS = {
  New: 'bg-green-100 text-green-800',
  'Like New': 'bg-emerald-100 text-emerald-800',
  Good: 'bg-yellow-100 text-yellow-800',
  Acceptable: 'bg-orange-100 text-orange-800'
}

const SingleBook = () => {
    const data = useLoaderData()
    const { user } = useContext(AuthContext)

    return (
        <div className="pt-16 pb-20 bg-[#f8f7f4]">
            <div className="max-w-5xl mx-auto px-4">
                <div className="card overflow-hidden">
                    <div className="grid md:grid-cols-5">
                        {/* Image Side */}
                        <div className="md:col-span-2 bg-[#f4f3ef] p-8 md:p-12 flex items-center justify-center">
                            <div className="relative w-full max-w-[280px]">
                                <img
                                    src={data.imageURL}
                                    alt={data.bookTitle}
                                    className="rounded-3xl shadow-2xl w-full object-cover aspect-[4/5]"
                                    onError={(e) => { e.target.src = 'https://picsum.photos/id/1011/400/500' }}
                                />
                                {data.condition && (
                                    <span className="absolute top-4 right-4 badge">{data.condition}</span>
                                )}
                            </div>
                        </div>

                        {/* Details Side */}
                        <div className="md:col-span-3 p-8 md:p-12 flex flex-col">
                            <div>
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="badge">{data.category}</span>
                                    {data.status && <span className="text-xs uppercase tracking-widest px-3 py-1 rounded-full bg-gray-100 text-gray-600">{data.status}</span>}
                                </div>

                                <h1 className="text-4xl lg:text-5xl font-semibold tracking-[-1.5px] leading-none mb-3">{data.bookTitle}</h1>
                                <p className="text-2xl text-gray-500">by {data.authorName}</p>
                            </div>

                            {data.price != null && (
                                <div className="mt-6">
                                    <span className="text-6xl font-semibold tracking-[-2px] text-emerald-700">${Number(data.price).toFixed(2)}</span>
                                </div>
                            )}

                            {data.status === 'available' && data.sellerName && (
                                <div className="mt-8 p-5 bg-white border border-gray-100 rounded-2xl">
                                    <div className="text-xs uppercase tracking-wider text-emerald-700 mb-1 font-medium">Listed by</div>
                                    <div className="font-semibold text-lg">{data.sellerName}</div>
                                    <div className="text-gray-500 text-sm">{data.sellerEmail}</div>
                                </div>
                            )}

                            <div className="mt-8 flex-1">
                                <div className="uppercase text-xs tracking-[1.5px] text-gray-500 mb-2">About this book</div>
                                <p className="text-[15px] leading-relaxed text-gray-600 max-w-prose">
                                    {data.bookDescription || "A beautiful addition to any collection. More details coming soon."}
                                </p>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-8 mt-auto border-t">
                                {data.status === 'available' && data.sellerEmail && user?.email !== data.sellerEmail && (
                                    <a href={`mailto:${data.sellerEmail}?subject=Interested in: ${data.bookTitle}`} className="btn-primary flex-1 justify-center">
                                        Contact the seller
                                    </a>
                                )}

                                {data.bookPDFURL && (
                                    <a href={data.bookPDFURL} target="_blank" rel="noopener noreferrer" className="btn-secondary flex-1 justify-center">
                                        Download sample PDF
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleBook
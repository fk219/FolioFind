import { Spinner } from 'flowbite-react';
import { useContext } from 'react'
import { AuthContext } from '../../contexts/AuthProvider';
const posts = [
  {
    id: 1,
    title: 'Boost your conversion rate',
    href: '#',
    description:
      'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
    date: 'Mar 16, 2020',
    datetime: '2020-03-16',
    category: { title: 'Marketing', href: '#' },
    author: {
      name: 'Michael Foster',
      role: 'Co-Founder / CTO',
      href: '#',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 2,
    title: 'Boost your conversion rate',
    href: '#',
    description:
      'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
    date: 'Mar 16, 2020',
    datetime: '2020-03-16',
    category: { title: 'Marketing', href: '#' },
    author: {
      name: 'Michael Foster',
      role: 'Co-Founder / CTO',
      href: '#',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 4,
    title: 'Boost your conversion rate',
    href: '#',
    description:
      'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
    date: 'Mar 16, 2020',
    datetime: '2020-03-16',
    category: { title: 'Marketing', href: '#' },
    author: {
      name: 'Michael Foster',
      role: 'Co-Founder / CTO',
      href: '#',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  {
    id: 3,
    title: 'Boost your conversion rate',
    href: '#',
    description:
      'Illo sint voluptas. Error voluptates culpa eligendi. Hic vel totam vitae illo. Non aliquid explicabo necessitatibus unde. Sed exercitationem placeat consectetur nulla deserunt vel. Iusto corrupti dicta.',
    date: 'Mar 16, 2020',
    datetime: '2020-03-16',
    category: { title: 'Marketing', href: '#' },
    author: {
      name: 'Michael Foster',
      role: 'Co-Founder / CTO',
      href: '#',
      imageUrl:
        'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    },
  },
  // More posts...
]

const Blog = () => {
  const {loading } = useContext(AuthContext);

  if(loading) {
    return <div className='text-center mt-28'>
      <Spinner aria-label="Center-aligned spinner example" />
    </div>
  }


  return (
    <div className="pt-20 bg-[#f8f7f4] pb-20">
      <div className="container-custom">
        <div className="max-w-2xl mx-auto text-center pt-8 mb-14">
          <div className="badge mx-auto mb-3">Stories &amp; essays</div>
          <h1 className="text-6xl tracking-[-2px] font-semibold">From the FolioFid Journal</h1>
          <p className="mt-4 text-xl text-gray-600">Thoughts on books, reading culture, and the joy of collecting.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {posts.map((post) => (
            <a href={post.href} key={post.id} className="card group p-8 block h-full">
              <div className="flex gap-3 text-xs text-gray-500 mb-5">
                <time>{post.date}</time>
                <span className="text-emerald-600 font-medium">{post.category.title}</span>
              </div>
              <h3 className="text-2xl font-semibold tracking-tight group-hover:text-emerald-700 transition leading-snug">{post.title}</h3>
              <p className="mt-4 text-gray-600 line-clamp-3">{post.description}</p>
              <div className="flex items-center gap-3 mt-8 pt-6 border-t">
                <img src={post.author.imageUrl} alt="" className="w-9 h-9 rounded-full" />
                <div className="text-sm">
                  <div className="font-medium text-gray-900">{post.author.name}</div>
                  <div className="text-gray-500 text-xs">{post.author.role}</div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Blog

import { BsCloudArrowUp } from 'react-icons/bs';
import { HiLockClosed, HiServer } from "react-icons/hi";

const About = () => {
  return (
    <div className="pt-20 bg-[#f8f7f4]">
      <div className="container-custom py-16">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <div className="badge mx-auto mb-4">Our story</div>
          <h1 className="text-6xl tracking-[-2px] font-semibold">Made for people who love books.</h1>
          <p className="mt-6 text-xl text-gray-600">FolioFid was born from a simple belief: beautiful books deserve beautiful homes, and readers deserve a better way to find them.</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          <div className="card p-10">
            <h3 className="font-semibold text-2xl mb-4">A marketplace, reimagined</h3>
            <p className="text-gray-600 leading-relaxed">We built FolioFid to feel like your favorite independent bookstore — warm, curated, and personal. Every book is hand-reviewed, every seller is part of our trusted community.</p>
          </div>
          <div className="card p-10">
            <h3 className="font-semibold text-2xl mb-4">Why it matters</h3>
            <p className="text-gray-600 leading-relaxed">In a world of algorithms, we believe in serendipity. Our platform helps you discover books you’ll cherish for years — and pass them on when the time is right.</p>
          </div>
        </div>

        <div className="mt-20 text-center max-w-md mx-auto">
          <p className="text-gray-500">Whether you’re a collector, a casual reader, or a seller of beautiful editions — welcome home.</p>
          <a href="/shop" className="btn-primary mt-8 inline-flex">Start exploring</a>
        </div>
      </div>
    </div>
  )
}

export default About

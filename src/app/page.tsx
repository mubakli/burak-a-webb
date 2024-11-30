import Head from "next/head";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Head>
        <title>My Homepage</title>
        <meta
          name="description"
          content="A simple homepage built with Next.js and Tailwind CSS"
        />
      </Head>

      {/* Header Section */}
      <header className="bg-blue-500 text-white py-6">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl font-bold">Welcome to My Homepage</h1>
        </div>
      </header>

      {/* Main Content Section */}
      <main className="py-12">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-gray-800">About Me</h2>
          <p className="mt-4 text-lg text-gray-600">
            This is a simple homepage built with Next.js and Tailwind CSS. It
            includes a header, content section, and footer.
          </p>
        </div>
      </main>

      {/* Footer Section */}
      <footer className="bg-blue-500 text-white py-6">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p>Created with ❤️ using Next.js and Tailwind CSS</p>
        </div>
      </footer>
    </div>
  );
}

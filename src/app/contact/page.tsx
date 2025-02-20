export default function contact() {
  return (
    <div className="mt-40 animate-slideUp">
      <div className="flex mx-10 my-10 font bold justify-center">
        <p>E-mail:</p>
        <p className="pl-5 underline decoration-rose-700">
          brkasarcikli@outlook.com
        </p>
      </div>
      <div className="flex mx-10 my-10 font bold justify-center">
        <p>Linkedln:</p>
        <a
          href="www.linkedin.com/in/burak-asarcikli"
          className="pl-5 underline decoration-teal-800"
        >
          www.linkedin.com/in/burak-asarcikli
        </a>
      </div>
      <div className="flex mx-10 my-10 font bold justify-center">
        <p>Github:</p>
        <a
          href="https://github.com/mubakli"
          className="pl-5 underline decoration-orange-800"
        >
          https://github.com/mubakli
        </a>
      </div>
    </div>
  );
}

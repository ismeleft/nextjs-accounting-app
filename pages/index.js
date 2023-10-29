import Link from "next/link";
import Signin from "./Signin";

function HomePage() {
  return (
    <div>
      <h1 className="text-2xl">記帳，從現在開始</h1>
      <br />
      <Signin />
    </div>
  );
}

export default HomePage;

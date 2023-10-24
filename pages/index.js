import Link from "next/link";

function HomePage() {
  return (
    <div>
      <h1>記帳，從現在開始</h1>
      <Link href="/accounting" className="goToAccount">
        點我去記帳
      </Link>
    </div>
  );
}

export default HomePage;

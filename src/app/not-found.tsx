import Link from "next/link";

export default function NotFound() {
  return (
    <div className="grid">
      <div className="lab" />
      <div>
        <h1 className="page-name">This page does not exist.</h1>
        <Link className="link after" href="/">
          Back to the front page
        </Link>
      </div>
    </div>
  );
}

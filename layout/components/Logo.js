import Link from "next/link";

const Logo = () => {
  return (
    <Link legacyBehavior href="/">
      <a className="font-bold text-xl text-900 flex align-items-center">
        <img
          src={`/layout/logo.png`}
          alt="Sakai Logo"
          height="50"
          width="50"
          className="mr-0 lg:mr-2"
        />
        KasambahayKo
      </a>
    </Link>
  );
};

export default Logo;

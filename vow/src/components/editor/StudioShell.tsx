import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function StudioShell({
  children,
  active = "invitation",
}: {
  children: React.ReactNode;
  active?: "invitation" | "guests";
}) {
  return (
    <div className="studio">
      <aside className="sidebar">
        <Link className="brand" href="/">
          vow<span>®</span>
        </Link>
        <p className="brand-caption">THIỆP CƯỚI ONLINE</p>
        <nav>
          <Link
            href="/"
            aria-current={active === "invitation" ? "page" : undefined}
            className={active === "invitation" ? "nav-item active" : "nav-item"}
          >
            <Icon name="edit" />
            Nội dung thiệp
          </Link>
          <Link
            href="/guests"
            aria-current={active === "guests" ? "page" : undefined}
            className={active === "guests" ? "nav-item active" : "nav-item"}
          >
            <Icon name="people" />
            Khách mời
          </Link>
        </nav>
        <Link
          href="/xem-thiep"
          target="_blank"
          className="nav-item nav-xem"
        >
          <Icon name="eye" />
          Xem thử thiệp
        </Link>
      </aside>
      <div className="studio-content">
        <header className="topbar">
          <span className="demo-pill">BẢN DEMO</span>
        </header>
        {children}
      </div>
    </div>
  );
}

import { useContext, useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { FaBarsStaggered, FaBookOpen, FaXmark } from "react-icons/fa6";
import { AuthContext } from "../../contexts/AuthProvider";

const navItems = [
  { label: "Shop", to: "/shop" },
  { label: "Reading room", to: "/reading-room" },
  { label: "Notes", to: "/blog" },
  { label: "About", to: "/about" }
];

function navClass({ isActive }) {
  return `font-mono text-[10px] uppercase tracking-[0.14em] transition-colors ${
    isActive ? "text-oxblood" : "text-muted hover:text-ink"
  }`;
}

export default function Navbar() {
  const { user, logOut } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);
  const dialogRef = useRef(null);
  const closeRef = useRef(null);

  useEffect(() => {
    setMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (menuOpen) {
      if (typeof dialog.showModal === "function") dialog.showModal();
      else dialog.setAttribute("open", "");
      document.body.style.overflow = "hidden";
      closeRef.current?.focus();
    } else {
      if (typeof dialog.close === "function") dialog.close();
      else dialog.removeAttribute("open");
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const handleSignOut = () => {
    logOut();
    navigate("/");
  };

  const displayName = user?.fullName?.trim() || user?.email?.split("@")[0] || "Reader";

  return (
    <header className="sticky top-0 z-40 border-b border-line bg-paper">
      <div className="container-bookshop flex h-16 items-center justify-between gap-4 lg:h-20">
        <Link to="/" className="flex min-w-0 items-center gap-3" aria-label="FolioFind home">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-oxblood text-paper">
            <FaBookOpen className="h-4 w-4" aria-hidden="true" />
          </span>
          <span className="flex flex-col leading-none">
            <span className="font-display text-2xl tracking-tight text-ink">FolioFind</span>
            <span className="mt-1 hidden font-mono text-[8px] uppercase tracking-[0.2em] text-muted sm:block">
              The second shelf
            </span>
          </span>
        </Link>

        <nav aria-label="Primary" className="hidden items-center gap-7 lg:flex">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={navClass}>
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          {user ? (
            <>
              <Link to="/my-listings" className="link-line font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink">
                {displayName}
              </Link>
              {user.role === "admin" && (
                <Link to="/admin/dashboard" className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink">
                  Dashboard
                </Link>
              )}
              <span className="h-3 w-px bg-line" aria-hidden="true" />
              <button
                type="button"
                onClick={handleSignOut}
                className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted transition-colors hover:text-oxblood"
              >
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-ink">
              Log in
            </Link>
          )}
          <Link to={user ? "/sell" : "/create-user"} className="btn-primary min-h-11 px-4 py-2">
            Sell a book
          </Link>
        </div>

        <button
          type="button"
          onClick={() => setMenuOpen(true)}
          className="flex h-10 w-10 items-center justify-center text-ink lg:hidden"
          aria-label="Open menu"
          aria-expanded={menuOpen}
          aria-controls="foliofind-menu"
        >
          <FaBarsStaggered className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      <dialog
        ref={dialogRef}
        id="foliofind-menu"
        aria-label="Site menu"
        onClose={() => setMenuOpen(false)}
        className="m-0 h-full w-full max-w-none border-0 bg-paper p-0 text-ink backdrop:bg-paper lg:hidden"
      >
        <div className="flex h-full flex-col">
          <div className="container-bookshop flex h-16 items-center justify-between border-b border-line">
            <span className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center bg-oxblood text-paper">
                <FaBookOpen className="h-4 w-4" aria-hidden="true" />
              </span>
              <span className="font-display text-xl tracking-tight">FolioFind</span>
            </span>
            <button
              ref={closeRef}
              type="button"
              onClick={() => setMenuOpen(false)}
              className="flex h-10 w-10 items-center justify-center text-ink"
              aria-label="Close menu"
            >
              <FaXmark className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <nav aria-label="Mobile primary" className="container-bookshop flex flex-1 flex-col justify-center gap-1 py-8">
            {navItems.map((item, index) => (
              <Link
                key={item.to}
                to={item.to}
                className="flex items-baseline gap-4 border-b border-line py-5 font-display text-4xl tracking-tight transition-colors hover:text-oxblood sm:text-5xl"
              >
                <span className="font-mono text-[10px] tracking-[0.16em] text-muted">
                  {String(index + 1).padStart(2, "0")}
                </span>
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="container-bookshop border-t border-line py-6">
            {user ? (
              <>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="font-mono text-[9px] uppercase tracking-[0.14em] text-muted">Signed in as</p>
                    <p className="mt-1 text-sm text-ink">{displayName}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="font-mono text-[10px] uppercase tracking-[0.14em] text-muted hover:text-oxblood"
                  >
                    Sign out
                  </button>
                </div>
                <div className="mt-4 grid gap-2">
                  <Link to="/reading-room" className="btn-outline">
                    My reading room
                  </Link>
                  <Link to="/my-listings" className="btn-outline">
                    My listings
                  </Link>
                  {user.role === "admin" && (
                    <Link to="/admin/dashboard" className="btn-outline">
                      Admin dashboard
                    </Link>
                  )}
                  <Link to="/sell" className="btn-primary">
                    Sell a book
                  </Link>
                </div>
              </>
            ) : (
              <div className="grid gap-2">
                <Link to="/create-user" className="btn-primary">
                  Create an account
                </Link>
                <Link to="/login" className="btn-outline">
                  Log in
                </Link>
              </div>
            )}
            <p className="mt-5 font-mono text-[9px] uppercase tracking-[0.14em] text-muted">
              Portfolio demo · Seeded listings
            </p>
          </div>
        </div>
      </dialog>
    </header>
  );
}

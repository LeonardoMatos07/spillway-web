"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useLayoutEffect, useRef, useState } from "react";

import { isNavActive, NAV, type NavItem } from "@/lib/navigation";

const LINK_BASE = "block rounded-full px-3 py-1.5";
const ACTIVE = "bg-accent-soft text-accent-strong";
const IDLE = "text-ink-2 hover:bg-surface-2 hover:text-ink";

function Chevron({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 12 12"
      className={`size-3 transition-transform ${open ? "rotate-180" : ""}`}
    >
      <path
        d="M2 4l4 4 4-4"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function DesktopItem({
  item,
  active,
  open,
  onToggle,
  onClose,
}: {
  item: NavItem;
  active: boolean;
  open: boolean;
  onToggle: () => void;
  onClose: () => void;
}) {
  const wrapper = useRef<HTMLDivElement>(null);
  // Open towards the left when the panel (w-72 = 288 px) would run past the right edge.
  const [alignRight, setAlignRight] = useState(false);
  useLayoutEffect(() => {
    if (!open || !wrapper.current) return;
    setAlignRight(wrapper.current.getBoundingClientRect().left + 288 > window.innerWidth - 16);
  }, [open]);
  const children = item.children;
  if (!children) {
    return (
      <Link
        href={item.href}
        aria-current={active ? "page" : undefined}
        className={`${LINK_BASE} ${active ? ACTIVE : IDLE}`}
      >
        {item.label}
      </Link>
    );
  }
  const menuId = `menu-${item.label.toLowerCase()}`;
  return (
    <div className="relative" ref={wrapper}>
      <button
        type="button"
        aria-expanded={open}
        aria-controls={menuId}
        aria-haspopup="true"
        onClick={onToggle}
        className={`${LINK_BASE} flex items-center gap-1 ${active ? ACTIVE : IDLE}`}
      >
        {item.label}
        <Chevron open={open} />
      </button>
      {open ? (
        <ul
          id={menuId}
          className={`border-grid bg-surface shadow-card absolute top-full ${alignRight ? "right-0" : "left-0"} z-40 mt-2 w-72 max-w-[calc(100vw-2rem)] rounded-2xl border p-2 whitespace-normal`}
        >
          {children.map((child) => (
            <li key={child.href}>
              <Link
                href={child.href}
                onClick={onClose}
                className="hover:bg-surface-2 block rounded-xl px-3 py-2"
              >
                <span className="text-ink block text-sm font-semibold">{child.label}</span>
                <span className="text-muted block text-xs">{child.description}</span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

/** Desktop menu (md and up): plain links and dropdowns. Esc and outside clicks close a dropdown. */
export function NavLinks() {
  const pathname = usePathname() ?? "/";
  const [openLabel, setOpenLabel] = useState<string | null>(null);
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    setOpenLabel(null);
  }, [pathname]);

  useEffect(() => {
    if (!openLabel) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpenLabel(null);
    };
    const onPointer = (event: PointerEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) setOpenLabel(null);
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openLabel]);

  return (
    <nav ref={ref} aria-label="Principal" className="hidden md:block">
      <ul className="flex gap-1 text-sm font-medium whitespace-nowrap">
        {NAV.map((item) => (
          <li key={item.href}>
            <DesktopItem
              item={item}
              active={isNavActive(pathname, item.matches)}
              open={openLabel === item.label}
              onToggle={() => setOpenLabel(openLabel === item.label ? null : item.label)}
              onClose={() => setOpenLabel(null)}
            />
          </li>
        ))}
      </ul>
    </nav>
  );
}

/** Mobile menu (below md): a button that opens a drawer with every area and its pages. */
export function MobileMenu() {
  const pathname = usePathname() ?? "/";
  const [open, setOpen] = useState(false);
  // Groups are collapsed; the one for the current page starts open.
  const activeLabel = NAV.find((item) => isNavActive(pathname, item.matches))?.label ?? null;
  const [expanded, setExpanded] = useState<string | null>(activeLabel);

  useEffect(() => {
    setOpen(false);
    setExpanded(activeLabel);
  }, [pathname, activeLabel]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="md:hidden">
      <button
        type="button"
        aria-expanded={open}
        aria-controls="menu-mobile"
        onClick={() => setOpen(!open)}
        className="border-line text-ink-2 hover:bg-surface-2 inline-flex h-11 w-11 items-center justify-center gap-1.5 rounded-full border px-0 text-sm font-semibold sm:w-auto sm:gap-2 sm:px-4"
      >
        <svg aria-hidden="true" viewBox="0 0 24 24" className="size-4">
          <path
            d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
        <span className="sr-only sm:not-sr-only">Menu</span>
      </button>
      {open ? (
        <nav
          id="menu-mobile"
          aria-label="Principal"
          className="border-grid bg-surface absolute inset-x-0 top-full z-40 max-h-[calc(100dvh-4rem)] overflow-y-auto border-b px-4 py-4 shadow-lg"
        >
          <ul className="divide-grid divide-y">
            {NAV.map((item) => {
              const active = isNavActive(pathname, item.matches);
              const isOpen = expanded === item.label;
              const panelId = `menu-mobile-${item.label.toLowerCase()}`;
              return (
                <li key={item.href} className="py-1">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => setExpanded(isOpen ? null : item.label)}
                    className={`flex min-h-11 w-full items-center justify-between py-2 text-left text-base font-bold ${active ? "text-accent-strong" : "text-ink"}`}
                  >
                    {item.label}
                    <Chevron open={isOpen} />
                  </button>
                  {isOpen && item.children ? (
                    <ul id={panelId} className="border-grid mb-2 ml-1 space-y-1 border-l pl-3">
                      {item.children.map((child) => (
                        <li key={child.href}>
                          <Link
                            href={child.href}
                            aria-current={pathname === child.href ? "page" : undefined}
                            className={`hover:text-ink block min-h-11 py-2.5 text-sm ${pathname === child.href ? "text-accent-strong font-semibold" : "text-ink-2"}`}
                          >
                            {child.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </div>
  );
}

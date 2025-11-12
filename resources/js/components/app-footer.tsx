export function AppFooter() {
  const year = new Date().getFullYear();

  return (
    <div className="border-t border-sidebar-border/80">
      <div className="mx-auto flex h-14 w-full items-center justify-between px-4 text-sm text-neutral-500 md:max-w-7xl">
        <div>© {year} E-Auction</div>
      </div>
    </div>
  );
}

export default AppFooter;

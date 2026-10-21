import { NavLink, Outlet } from 'react-router'
import { cn } from '@/utils/cn'

function sectionLinkClass({ isActive }: { isActive: boolean }) {
  return cn(
    'font-medium text-sm transition-colors',
    isActive
      ? 'text-slate-900 underline decoration-2 underline-offset-8'
      : 'text-slate-500 hover:text-slate-900',
  )
}

export default function OtherLayout() {
  return (
    <div className="space-y-6">
      <nav
        aria-label="Other section"
        className="flex items-center gap-5 border-slate-200 border-b pb-3"
      >
        <NavLink to="/other" end className={sectionLinkClass}>
          Overview
        </NavLink>
        <NavLink to="/other/inner-page" className={sectionLinkClass}>
          Inner page
        </NavLink>
      </nav>

      <Outlet />
    </div>
  )
}

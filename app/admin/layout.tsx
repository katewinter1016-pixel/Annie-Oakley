import AdminSidebar from './AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex bg-stone-100">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        {children}
      </div>
    </div>
  )
}

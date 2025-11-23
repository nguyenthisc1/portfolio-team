import DashboardLayout from '@/shared/layouts/DashboardLayout'
import React from 'react'

export default function layout({ children }: { children: React.ReactNode }) {
    return <DashboardLayout>{children}</DashboardLayout>
}

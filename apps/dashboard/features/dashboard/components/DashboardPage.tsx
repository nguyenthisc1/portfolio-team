'use client'

import { Analytics } from '@vercel/analytics/react'
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/Card'
import {
    Users,
    Eye,
    TrendingUp,
    Clock,
    MousePointerClick,
    Globe,
    ArrowUpRight,
    ArrowDownRight,
} from 'lucide-react'

interface MetricCardProps {
    title: string
    value: string | number
    description?: string
    icon: React.ReactNode
    trend?: {
        value: number
        isPositive: boolean
    }
}

function MetricCard({ title, value, description, icon, trend }: MetricCardProps) {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
                <div className="text-muted-foreground">{icon}</div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {description && <p className="text-muted-foreground mt-1 text-xs">{description}</p>}
                {trend && (
                    <div className="mt-2 flex items-center text-xs">
                        {trend.isPositive ? (
                            <ArrowUpRight className="mr-1 h-3 w-3 text-green-500" />
                        ) : (
                            <ArrowDownRight className="mr-1 h-3 w-3 text-red-500" />
                        )}
                        <span className={trend.isPositive ? 'text-green-500' : 'text-red-500'}>
                            {Math.abs(trend.value)}%
                        </span>
                        <span className="text-muted-foreground ml-1">from last month</span>
                    </div>
                )}
            </CardContent>
        </Card>
    )
}

export default function DashboardPage() {
    // Mock data - in production, this would come from your analytics API
    const analyticsData = {
        totalUsers: 12453,
        pageViews: 45678,
        uniqueVisitors: 8934,
        bounceRate: 42.5,
        avgSessionDuration: '3m 24s',
        topPages: [
            { path: '/', views: 12345, title: 'Home' },
            { path: '/about', views: 5678, title: 'About' },
            { path: '/projects', views: 4321, title: 'Projects' },
            { path: '/contact', views: 2345, title: 'Contact' },
        ],
    }

    return (
        <>
            <div className="container mx-auto space-y-6 p-6">
                <div>
                    <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of your website performance
                    </p>
                </div>

                {/* Metrics Grid */}
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <MetricCard
                        title="Total Users"
                        value={analyticsData.totalUsers.toLocaleString()}
                        description="All-time visitors"
                        icon={<Users className="h-4 w-4" />}
                        trend={{ value: 12.5, isPositive: true }}
                    />
                    <MetricCard
                        title="Page Views"
                        value={analyticsData.pageViews.toLocaleString()}
                        description="Total page views"
                        icon={<Eye className="h-4 w-4" />}
                        trend={{ value: 8.2, isPositive: true }}
                    />
                    <MetricCard
                        title="Unique Visitors"
                        value={analyticsData.uniqueVisitors.toLocaleString()}
                        description="Last 30 days"
                        icon={<Globe className="h-4 w-4" />}
                        trend={{ value: 5.1, isPositive: true }}
                    />
                    <MetricCard
                        title="Bounce Rate"
                        value={`${analyticsData.bounceRate}%`}
                        description="Visitors who leave immediately"
                        icon={<MousePointerClick className="h-4 w-4" />}
                        trend={{ value: 2.3, isPositive: false }}
                    />
                    <MetricCard
                        title="Avg. Session"
                        value={analyticsData.avgSessionDuration}
                        description="Average session duration"
                        icon={<Clock className="h-4 w-4" />}
                        trend={{ value: 15.7, isPositive: true }}
                    />
                    <MetricCard
                        title="Growth Rate"
                        value="+18.2%"
                        description="Month over month"
                        icon={<TrendingUp className="h-4 w-4" />}
                        trend={{ value: 18.2, isPositive: true }}
                    />
                </div>

                {/* Top Pages */}
                <Card>
                    <CardHeader>
                        <CardTitle>Top Pages</CardTitle>
                        <CardDescription>Most visited pages in the last 30 days</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {analyticsData.topPages.map((page, index) => (
                                <div key={page.path} className="flex items-center justify-between">
                                    <div className="flex items-center space-x-4">
                                        <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full">
                                            <span className="text-sm font-medium">{index + 1}</span>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{page.title}</p>
                                            <p className="text-muted-foreground text-xs">
                                                {page.path}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-medium">
                                            {page.views.toLocaleString()}
                                        </p>
                                        <p className="text-muted-foreground text-xs">views</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Stats */}
                <div className="grid gap-4 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Traffic Sources</CardTitle>
                            <CardDescription>Where your visitors come from</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Direct</span>
                                    <span className="text-sm font-medium">45%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Search Engines</span>
                                    <span className="text-sm font-medium">32%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Social Media</span>
                                    <span className="text-sm font-medium">18%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Referrals</span>
                                    <span className="text-sm font-medium">5%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Device Breakdown</CardTitle>
                            <CardDescription>Devices used by your visitors</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Desktop</span>
                                    <span className="text-sm font-medium">58%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Mobile</span>
                                    <span className="text-sm font-medium">35%</span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm">Tablet</span>
                                    <span className="text-sm font-medium">7%</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
            <Analytics />
        </>
    )
}

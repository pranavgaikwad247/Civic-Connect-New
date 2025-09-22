import React from 'react';
import { Report, ReportStatus, ReportCategory } from '../types';
import { ClockIcon, CheckCircleIcon, TagIcon } from './Icons';

interface DashboardStatsProps {
    reports: Report[];
}

const DashboardStats: React.FC<DashboardStatsProps> = ({ reports }) => {
    const stats = React.useMemo(() => {
        const resolved = reports.filter(r => r.status === ReportStatus.Resolved).length;
        const pending = reports.filter(r => r.status === ReportStatus.Open || r.status === ReportStatus.InProgress).length;

        const categoryCounts = reports.reduce((acc, report) => {
            acc[report.category] = (acc[report.category] || 0) + 1;
            return acc;
        }, {} as Record<ReportCategory, number>);
        
        const topCategory = Object.entries(categoryCounts).sort((entryA, entryB) => entryB[1] - entryA[1])[0];

        return {
            resolved,
            pending,
            topCategory: topCategory ? { name: topCategory[0], count: topCategory[1] } : { name: 'N/A', count: 0 }
        };
    }, [reports]);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatCard 
                title="Pending Issues" 
                value={stats.pending} 
                icon={ClockIcon} 
                color="orange" 
            />
            <StatCard 
                title="Resolved Issues" 
                value={stats.resolved} 
                icon={CheckCircleIcon}
                color="green" 
            />
            <StatCard 
                title="Most Frequent Problem" 
                value={stats.topCategory.name.replace('-', ' ')} 
                icon={TagIcon}
                color="blue"
                isCategory
            />
        </div>
    );
};

interface StatCardProps {
    title: string;
    value: number | string;
    icon: React.FC<React.SVGProps<SVGSVGElement>>;
    color: 'orange' | 'green' | 'blue';
    isCategory?: boolean;
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, isCategory = false }) => {
    const colors = {
        orange: { bg: 'bg-orange-500', iconBg: 'bg-orange-600' },
        green: { bg: 'bg-green-500', iconBg: 'bg-green-600' },
        blue: { bg: 'bg-blue-500', iconBg: 'bg-blue-600' },
    };
    
    return (
        <div className={`p-5 rounded-xl shadow-lg text-white flex items-center ${colors[color].bg}`}>
            <div className={`p-3 rounded-lg mr-4 ${colors[color].iconBg}`}>
                <Icon className="w-8 h-8 text-white" />
            </div>
            <div>
                <h3 className="text-lg font-semibold text-white/90">{title}</h3>
                <p className={`font-bold mt-1 ${isCategory ? 'text-2xl capitalize' : 'text-4xl'}`}>{value}</p>
            </div>
        </div>
    );
};

export default DashboardStats;
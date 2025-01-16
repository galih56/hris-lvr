import { paths } from '@/apps/hris-dashboard/paths';
import { Breadcrumb, BreadcrumbItem, BreadcrumbList } from '@/components/ui/breadcrumb';
import {  Link } from 'react-router-dom';
import {  adjustActiveBreadcrumbs, useBreadcrumbs } from './breadcrumbs-store';
import { useEffect } from 'react';

export const Breadcrumbs = () => {
    const {items} = useBreadcrumbs();
    adjustActiveBreadcrumbs();
    return (
        <Breadcrumb>
            <BreadcrumbList>
                {items.map((item, index) => (
                <BreadcrumbItem key={index}>
                    <Link to={item.url} className="text-blue-500 hover:underline">
                    {item.title}
                    </Link>
                    {index < items.length - 1 && (
                    <span className="mx-2">/</span>
                    )}
                </BreadcrumbItem>
                ))}
            </BreadcrumbList>
        </Breadcrumb>
    );
};

export default Breadcrumbs;

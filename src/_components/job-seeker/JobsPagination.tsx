/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import * as React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationNext,
    PaginationEllipsis,
} from "~/components/ui/pagination";
type JobsPaginationProps = {
    page: number; // 1-based
    totalPages: number;
    onPageChange: (page: number) => void;
    siblingCount?: number; // pages next to current
    className?: string;
};

function range(start: number, end: number) {
    const out: number[] = [];
    for (let i = start; i <= end; i++) out.push(i);
    return out;
}

/**
 * Returns array of: number | "ellipsis"
 * Example: [1, "ellipsis", 4, 5, 6, "ellipsis", 10]
 */
function getPaginationItems(
    currentPage: number,
    totalPages: number,
    siblingCount: number
): Array<number | "ellipsis"> {
    const firstPage = 1;
    const lastPage = totalPages;
    const totalNumbersToShow = siblingCount * 2 + 5; // first + last + current + 2 ellipsis + siblings

    if (totalPages <= totalNumbersToShow) return range(1, totalPages);

    const leftSibling = Math.max(currentPage - siblingCount, firstPage);
    const rightSibling = Math.min(currentPage + siblingCount, lastPage);

    const showLeftEllipsis = leftSibling > 2;
    const showRightEllipsis = rightSibling < totalPages - 1;

    // Case: only right ellipsis
    if (!showLeftEllipsis && showRightEllipsis) {
        const leftRange = range(1, 3 + siblingCount * 2);
        return [...leftRange, "ellipsis", lastPage];
    }

    // Case: only left ellipsis
    if (showLeftEllipsis && !showRightEllipsis) {
        const rightRange = range(totalPages - (3 + siblingCount * 2) + 1, totalPages);
        return [firstPage, "ellipsis", ...rightRange];
    }

    // Case: both
    const middleRange = range(leftSibling, rightSibling);
    return [firstPage, "ellipsis", ...middleRange, "ellipsis", lastPage];
}

export default function JobsPagination({
    page,
    totalPages,
    onPageChange,
    siblingCount = 1,
    className,
}: JobsPaginationProps) {
    if (totalPages <= 1) return null;

    const items = getPaginationItems(page, totalPages, siblingCount);

    const goTo = (p: number) => {
        const next = Math.min(Math.max(p, 1), totalPages);
        if (next !== page) onPageChange(next);
    };

    return (
        <Pagination className={className}>
            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        href="#"
                        onClick={(e: any) => {
                            e.preventDefault();
                            goTo(page - 1);
                        }}
                        className={page === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>

                {items.map((it, idx) =>
                    it === "ellipsis" ? (
                        <PaginationItem key={`e-${idx}`}>
                            <PaginationEllipsis />
                        </PaginationItem>
                    ) : (
                        <PaginationItem key={it}>
                            <PaginationLink
                                href="#"
                                isActive={it === page}
                                onClick={(e: any) => {
                                    e.preventDefault();
                                    goTo(it);
                                }}
                            >
                                {it}
                            </PaginationLink>
                        </PaginationItem>
                    )
                )}

                <PaginationItem>
                    <PaginationNext
                        href="#"
                        onClick={(e: any) => {
                            e.preventDefault();
                            goTo(page + 1);
                        }}
                        className={page === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}

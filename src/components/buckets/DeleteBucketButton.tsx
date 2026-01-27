'use client';

import React, { useState } from 'react';
import { deleteAllocation } from '@/app/actions/deleteAllocation';

interface DeleteBucketButtonProps {
    id: string;
    name: string;
}

export const DeleteBucketButton = ({ id, name }: DeleteBucketButtonProps) => {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm(`Are you sure you want to delete "${name}"?`)) return;

        setIsDeleting(true);
        const result = await deleteAllocation(id);

        if (!result.success) {
            alert(result.error || "Failed to delete");
            setIsDeleting(false);
        }
    };

    return (
        <button
            onClick={handleDelete}
            disabled={isDeleting}
            className="p-2 text-gray-400 hover:text-red-500 transition-colors disabled:opacity-50"
            title="Delete Allocation"
        >
            {isDeleting ? '...' : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
            )}
        </button>
    );
};
